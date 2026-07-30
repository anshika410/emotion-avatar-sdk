// emotion-sdk-v0.1.2\src\services\emotion\emotionStreamProcessor.ts
//
// v4 revision — streaming performance + negation/contrast correction pass.
//
// Problems this revision fixes (see PR description for the full writeup):
//
//   1. LAG: every call to `processAndClassify` ran ONNX inference, even when
//      only 1-2 new characters had streamed in since the last call. Fixed by
//      a pending-chunk buffer (`pendingBuffer`) that only flushes to the
//      model once it holds > 2 words AND > 15 characters — see
//      `decideChunksToFlush`. Turns that don't clear the threshold return
//      instantly with no model call (`peekSmoothedScores` reuses the last
//      smoothed distribution instead of leaving the fields empty).
//
//   2. REDUNDANT INFERENCE: overlapping/duplicate chunks (e.g. the same
//      clause re-sent because the buffer hadn't advanced) were re-scored
//      every time. Fixed with `chunkScoreCache`, a small LRU keyed on the
//      normalized chunk text.
//
//   3. NEGATION/CONTRAST WAS NEVER APPLIED TO THE OUTPUT: `computeValence`
//      (which already resolves negation, double-negation, and contrast
//      weighting correctly) only ever fed the debug-facing
//      `sentimentValence` field. The actual `modelEmotion` came straight
//      from the ONNX distribution with no lexical correction, so "I'm not
//      disappointed" could still emit `disappointment`. Fixed with
//      `applyLexicalCorrection`, which nudges the model's per-label
//      probabilities toward/away from the polarity implied by the SAME
//      chunk's negation-resolved valence before smoothing.
//
//   4. CONTRAST-TRIGGERED HISTORY RESET was keyed off "does the newly added
//      text contain a contrast word", which could fire on the wrong turn
//      relative to when the post-contrast clause actually reaches the
//      model. It's now tracked per-chunk (`flushIsPostContrastShift`) so the
//      smoothing history is cleared exactly on the turn the post-contrast
//      chunk is sent, however many turns that ends up taking.
//
// What's unchanged: the structural word classes (NEGATION_WORDS,
// INTENSIFIER_WORDS, CONTRAST_WORDS, EMOTION_HINT_WORDS,
// NEGATIVE_PREFIXES), `analyzeSegment`'s negation-scope-and-parity logic,
// `computeValence`'s later-clause weighting, and the explanation-chunk
// scoring used for the UI. Those were already doing the right thing — they
// just weren't wired into the emitted emotion.
// ---------------------------------------------------------------------------

import type {
  TextSignals,
  EmotionExplanation,
  EmotionExplanationChunk,
} from "../../types/emotion";
import { predictTopK } from "./onnxRuntime";
import type { EmotionLabel } from "../../types/emotion";

// NOTE: call `warmUpEmotionModel()` (from ./onnxRuntime) once at app startup
// so the first real transcript chunk doesn't pay the cold-load cost. See
// onnxRuntime.ts for warmUpEmotionModel / isEmotionModelReady / dispose /
// getStats.

/** Flip on only for local debugging — these log full score distributions
 * (JSON.stringify of up to 28 labels) on every call, which is itself a
 * measurable source of lag if left on in a live stream. */
const DEBUG_LOGGING = true;

/**
 * predictTopK slices its sorted result to this many entries. We want the
 * FULL emotion distribution here (getSmoothedScores, entropy, and the
 * complexity/uncertainty math all need every label's score, not just the
 * top few) — set well above the classifier head's actual label count
 * (GoEmotions-style heads are typically ~28) so nothing gets truncated
 * even if the underlying model is swapped later.
 */
const MAX_EMOTION_LABELS = 28;

// ──────────────────── Structural word classes ────────────────────
// These are the only lexicons in this file. Each is small, closed, and
// grounded in grammatical function (negators, intensifiers, contrastive
// conjunctions) rather than trying to enumerate "all positive/negative
// English words". EMOTION_HINT_VALENCE is the one exception that's a set of
// content words rather than function words, but it's deliberately kept tiny
// (~20 entries) and closed — extend it only when a concrete case needs a
// specific word, not to chase general coverage.

const NEGATION_WORDS = new Set([
  "not", "never", "no", "none", "nobody", "nothing", "neither", "nor",
  "cannot", "cant", "can't", "dont", "don't", "didnt", "didn't", "wont", "won't",
  "isnt", "isn't", "wasnt", "wasn't", "without",
]);

const INTENSIFIER_WORDS = new Set([
  "very", "really", "so", "too", "extremely", "highly", "super", "totally",
  "absolutely", "incredibly", "deeply", "strongly", "quite", "massively",
  "entirely", "completely", "fully",
]);

const CONTRAST_WORDS = new Set([
  "but", "however", "though", "although", "yet", "instead", "rather",
  // "then"/"once" are weaker, more ambiguous cues than "but"/"although" (they
  // can be purely sequential/neutral). Included because the spec calls
  // "then" out explicitly as a turning-point marker in spoken transcripts.
  "then", "once",
]);

/**
 * Small, closed map of content words to a valence direction. Add a word here
 * only when a specific, concrete case needs it. 0 means "known emotion word,
 * but not consistently positive or negative" (e.g. "surprised").
 */
const EMOTION_HINT_VALENCE: Record<string, number> = {
  happy: 1,
  excited: 1,
  love: 1,
  confident: 1,
  convinced: 1,
  sad: -1,
  angry: -1,
  afraid: -1,
  fear: -1,
  scared: -1,
  confused: -1,
  frustrated: -1,
  nervous: -1,
  worried: -1,
  hate: -1,
  guilty: -1,
  ashamed: -1,
  anxious: -1,
  disappointed: -1,
  surprised: 0,
};

/** Derived from EMOTION_HINT_VALENCE — single source of truth, not a second list. */
const EMOTION_HINT_WORDS = new Set(Object.keys(EMOTION_HINT_VALENCE));

/**
 * Negative morphological prefixes. On their own these say nothing — "un",
 * "in", "non" are common word-starts that aren't negations at all. The only
 * thing that makes this useful without becoming a dictionary is checking the
 * STRIPPED ROOT against the small EMOTION_HINT_VALENCE map above rather than
 * maintaining a separate whitelist of negatable roots.
 */
const NEGATIVE_PREFIXES = ["un", "dis", "in", "im", "non", "ir"];

/**
 * How many preceding words we scan for a syntactic negator when scoring an
 * anchor word. 3 comfortably covers "wasn't entirely unconvinced" (negator
 * is 2 words back) without reaching so far it flips unrelated words.
 */
const NEGATION_SCOPE_WINDOW = 3;

/**
 * Maps the ONNX model's output labels to a coarse polarity, used ONLY to
 * apply the lexical negation/contrast correction below (§ applyLexicalCorrection).
 * This is the standard GoEmotions-style taxonomy — verify the label strings
 * against whatever `predictTopK` actually returns for the deployed model and
 * adjust. Labels not present here (polarity 0, e.g. "curiosity", "surprise",
 * "neutral") are left untouched by the correction.
 */
const EMOTION_LABEL_POLARITY: Record<string, number> = {
  admiration: 1, amusement: 1, anger: -1, annoyance: -1, approval: 1,
  caring: 1,  desire: 1, disappointment: -1, disapproval: -1,
  disgust: -1, embarrassment: -1, excitement: 1, fear: -1, gratitude: 1,
  grief: -1, joy: 1, love: 1, nervousness: -1, optimism: 1, pride: 1,
  relief: 1, remorse: -1, sadness: -1, confusion: 0, curiosity: 0, realization: 0, surprise: 0
};

/** How hard the lexical valence pulls the model's distribution. 0 = no
 * correction, 1 = fully zero out every label that disagrees with the
 * lexical sign. Kept moderate so a shaky/weak lexical signal can't override
 * a confident model prediction outright — it nudges, not overrides. */
const LEXICAL_CORRECTION_STRENGTH = 0.35;

/**
 * Tokenizes for lexical analysis: lowercases and splits on anything that
 * isn't a letter, digit, or apostrophe. Keeping the apostrophe in-token
 * matters — splitting on \W+ turns "wasn't" into "wasn" + "t", which
 * silently breaks negation matching against NEGATION_WORDS. This is the
 * tokenizer used everywhere lexical class membership is checked; it's
 * distinct from `tokenize()` below, which is whitespace-only and used for
 * the raw-text diffing algorithm.
 */
function extractWords(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9']+/i).filter(Boolean);
}

/**
 * Resolves a single token to a base valence, either directly (it's an
 * EMOTION_HINT_VALENCE anchor) or via a stripped negative prefix whose root
 * is itself an anchor (e.g. "unconvinced" -> "convinced" -> flip to -1).
 */
function anchorPolarity(word: string): { polarity: number; matched: boolean } {
  const direct = EMOTION_HINT_VALENCE[word];
  if (direct !== undefined) {
    return { polarity: direct, matched: true };
  }

  for (const prefix of NEGATIVE_PREFIXES) {
    if (word.length > prefix.length + 3 && word.startsWith(prefix)) {
      const root = word.slice(prefix.length);
      const rootPolarity = EMOTION_HINT_VALENCE[root];
      if (rootPolarity !== undefined && rootPolarity !== 0) {
        return { polarity: -rootPolarity, matched: true };
      }
    }
  }

  return { polarity: 0, matched: false };
}

interface SegmentAnalysis {
  positiveWords: string[];
  negativeWords: string[];
  valence: number;
  hasSignal: boolean;
}

/**
 * Scores a single already-bounded span of words (a contrast segment, a model
 * chunk, or an explanation chunk). For each anchor word found, looks back up
 * to NEGATION_SCOPE_WINDOW words for syntactic negators and counts them: an
 * ODD count flips the anchor's polarity, an EVEN count (incl. zero) leaves
 * it — this is what resolves double negation:
 *
 *   "I'm not disappointed"        -> "disappointed" (-1) flipped once -> +1
 *   "wasn't entirely unconvinced" -> "unconvinced" is already -1 via the
 *                                     prefix check; "wasn't" flips it -> +1
 */
function analyzeSegment(words: string[]): SegmentAnalysis {
  const positiveWords: string[] = [];
  const negativeWords: string[] = [];
  let pos = 0;
  let neg = 0;

  for (let i = 0; i < words.length; i++) {
    const { polarity, matched } = anchorPolarity(words[i]);
    if (!matched || polarity === 0) continue;

    const windowStart = Math.max(0, i - NEGATION_SCOPE_WINDOW);
    let negatorCount = 0;
    for (let j = windowStart; j < i; j++) {
      if (NEGATION_WORDS.has(words[j])) negatorCount++;
    }

    const effective = negatorCount % 2 === 0 ? polarity : -polarity;

    if (effective > 0) {
      pos++;
      positiveWords.push(words[i]);
    } else if (effective < 0) {
      neg++;
      negativeWords.push(words[i]);
    }
  }

  const total = pos + neg;
  return {
    positiveWords: Array.from(new Set(positiveWords)),
    negativeWords: Array.from(new Set(negativeWords)),
    valence: total === 0 ? 0 : (pos - neg) / total,
    hasSignal: total > 0,
  };
}

const CONTRAST_WORDS_PATTERN = Array.from(CONTRAST_WORDS).join("|");
const CONTRAST_SPLIT_REGEX = new RegExp(`\\s+(?=(?:${CONTRAST_WORDS_PATTERN})\\b)`, "i");

/**
 * Splits text into clauses at contrast-marker boundaries only (coarser than
 * `splitIntoChunks` below, which also splits on punctuation — that one is
 * for the UI-facing explanation chunks; this one drives both `computeValence`
 * and the model-chunk buffer below).
 */
function splitByContrastMarkers(text: string): string[] {
  return text
    .split(CONTRAST_SPLIT_REGEX)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sentence/transcript-level valence, used for the rule-only `sentimentValence`
 * debug field. Handles the contrast edge case structurally: splits on
 * contrast markers, analyzes each resulting clause independently (so
 * negation scope doesn't leak across a "but"), drops clauses with no anchor
 * words at all, and weights later signal-bearing clauses more heavily
 * (the clause after "but"/"although" reflects the speaker's current emotion).
 */
function computeValence(text: string): number {
  if (!text.trim()) return 0;

  const segments = splitByContrastMarkers(text);
  const analyzed = segments
    .map((segment) => analyzeSegment(extractWords(segment)))
    .filter((seg) => seg.hasSignal);

  if (analyzed.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;
  analyzed.forEach((seg, i) => {
    const weight = Math.pow(2, i); // later signal-bearing clauses dominate
    weightedSum += seg.valence * weight;
    weightTotal += weight;
  });

  return weightTotal > 0 ? weightedSum / weightTotal : 0;
}

/**
 * Applies the chunk's own negation/contrast-resolved valence to the raw
 * model scores for that SAME chunk, before smoothing. Labels whose polarity
 * (EMOTION_LABEL_POLARITY) agrees with the lexical valence sign are boosted;
 * labels that disagree are dampened; unmapped labels (0 polarity) pass
 * through untouched. This is what makes "I'm not disappointed" actually
 * suppress `disappointment` in the output instead of just recording the
 * negation in a debug field nobody reads.
 */
function applyLexicalCorrection(
  rawScores: Record<string, number>,
  chunkAnalysis: SegmentAnalysis,
): Record<string, number> {
  if (!chunkAnalysis.hasSignal) return rawScores;

  const valenceSign = Math.sign(chunkAnalysis.valence);
  if (valenceSign === 0) return rawScores;
  const magnitude = Math.min(1, Math.abs(chunkAnalysis.valence));

  // NOTE: predictTopK's per-label scores are independent sigmoid
  // probabilities (multi-label), not a softmax distribution — several
  // labels can legitimately be high at once (e.g. sadness 0.99 AND grief
  // 0.70 together) and they do NOT sum to 1 across the label set. An
  // earlier version of this function renormalized `corrected` to sum to 1,
  // which silently crushed every label — including ones with no lexical
  // disagreement at all — whenever several labels fired simultaneously.
  // Each label is corrected independently and clamped to [0,1]; nothing is
  // renormalized against the others.
  const corrected: Record<string, number> = {};
  for (const [label, score] of Object.entries(rawScores)) {
    const polarity = EMOTION_LABEL_POLARITY[label] ?? 0;
    const adjusted =
      polarity === 0
        ? score
        : polarity === valenceSign
        ? score 
        : score * (1 - LEXICAL_CORRECTION_STRENGTH * magnitude);
    corrected[label] = Math.max(0, Math.min(1, adjusted));
  }
  return corrected;
}

// ──────────────────── Streaming chunk buffer ────────────────────
//
// This tracks a single number — `activeSegmentStartIndex`, a character
// offset into the CURRENT full transcript marking where the active clause
// began (0, or right after the most recent contrast marker). Every call
// re-slices the real transcript from that offset instead of accumulating a
// separately-diffed buffer, so there's no diffing algorithm that can
// mis-split a word that grows across calls (e.g. an interim "ner" that
// later completes to "nervous") — the sliced text is always an exact
// substring of what the ASR actually produced.
//
// Flow per call: (1) slice `transcript` from `activeSegmentStartIndex` ->
// (2) if that slice contains a contrast marker, flush the pre-marker clause
// immediately in full (a conjunction means the clause is complete — no size
// gate applies) and move the boundary to just after the marker, flagging
// the new segment as "post-conjunction, not yet sent" -> (3) decide whether
// to (re-)send the current slice as-is: the very first segment (before any
// conjunction has ever been seen) is sent on every change with no size
// gate, matching how a from-scratch utterance should be scored as it
// grows; a post-conjunction segment is held back until it clears the
// word/char threshold ONCE, and after that first send behaves like the
// first segment (resent on every change, no gate) until the next
// conjunction resets it -> (4) skip entirely if the slice is unchanged
// since the last flush (dedupe), and skip the model call (not just the
// flush) via `chunkScoreCache` if the exact text was already scored before.
//
// Trade-off worth knowing: because the pre-conjunction segment is never
// gated, a long clause with no "but"/"although" in it will still trigger a
// model call on every transcript update within that clause (mitigated only
// by the cache, which won't help since the text is different — longer —
// each time). If that turns out to be too chatty in practice, add a light
// debounce (e.g. skip if less than N new words since the last flush) on top
// of this.


/**
 * Gate applied to a tail (still-growing, not-yet-contrast-terminated)
 * segment's chunk: how much NEW text must have accumulated since the last
 * time *this segment* was actually sent to the model before we send again.
 * Measured against `lastSentSegmentText` in processAndClassify — not the
 * segment's absolute length — so the gate applies on every send within a
 * clause, not just the first one. That's what actually stops "resent on
 * every keystroke after the first send" chattiness.
 */
const MIN_CHUNK_WORDS = 3; // "words > 2"
const MIN_CHUNK_CHARS = 16; // "characters > 15"
/** Cap on the chunk->scores cache so it can't grow unbounded over a long call. */
const CHUNK_SCORE_CACHE_LIMIT = 40;

let activeSegmentStartIndex = 0;
let contrastShiftPendingForSegment = false;
/** Last tail-candidate text returned by `decideChunksToFlush` for the
 * current segment (regardless of whether it ended up gated/sent) — pure
 * dedup, so we don't return the exact same candidate twice in a row. */
/** Last tail text actually SENT to the model for the current segment.
 * processAndClassify diffs new candidates against this to measure how
 * much is genuinely new since the last real send. */
let lastSentSegmentText = "";
const chunkScoreCache: Map<string, Record<string, number>> = new Map();

interface ChunkToScore {
  text: string;
  /** True if no chunk from this segment (or the pre-marker clause that
   * preceded it) has been successfully sent since the segment opened —
   * signals processAndClassify to clear smoothing history for this
   * chunk's score. */
  postContrastShift: boolean;
  /** True for a clause closed out by hitting a contrast marker — these are
   * syntactically complete and always sent, regardless of the size gate
   * (which only applies to a still-growing tail segment). */
  segmentComplete: boolean;
}

function normalizeChunkKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function cacheScoresForChunk(key: string, scores: Record<string, number>): void {
  if (chunkScoreCache.size >= CHUNK_SCORE_CACHE_LIMIT) {
    const oldestKey = chunkScoreCache.keys().next().value;
    if (oldestKey !== undefined) chunkScoreCache.delete(oldestKey);
  }
  chunkScoreCache.set(key, scores);
}

function startNewSegment(newStartIndex: number): void {
  activeSegmentStartIndex = newStartIndex;
  lastSentSegmentText = "";
  contrastShiftPendingForSegment = true;
}

/**
 * Re-slices the current transcript from the tracked segment boundary and
 * returns candidate chunk(s) for this turn. This function ONLY decides
 * segment *boundaries* (where a clause starts/ends relative to contrast
 * markers) and dedupes identical-text candidates — it applies no size
 * gate. Sizing lives in processAndClassify, which measures growth against
 * the text actually last SENT for a segment, not this function's output.
 *
 * Flow per call: (1) slice `transcript` from `activeSegmentStartIndex` ->
 * (2) if that slice contains a contrast marker, close out the pre-marker
 * clause immediately as a `segmentComplete` chunk (always sent later, no
 * gate — a conjunction means the clause is syntactically finished) and
 * move the boundary to just after the marker, flagging the new segment as
 * pending a contrast-shift reset -> (3) return the current tail slice as a
 * non-`segmentComplete` candidate if it changed since the last candidate
 * returned -> (4) skip entirely if the slice is unchanged since then.
 */
function decideChunksToFlush(transcript: string): ChunkToScore[] {
  // Defensive: if the transcript was ever replaced with something shorter
  // than our tracked boundary (e.g. a corrected/rewritten final transcript),
  // fall back to treating it as a fresh utterance rather than slicing
  // negative/garbage indices.
  if (activeSegmentStartIndex > transcript.length) {
    activeSegmentStartIndex = 0;
    contrastShiftPendingForSegment = false;
    lastSentSegmentText = "";
  }

  const chunks: ChunkToScore[] = [];
  let activeSegment = transcript.slice(activeSegmentStartIndex);

  // Contrast markers close out the current clause immediately, no gate.
  let segments = splitByContrastMarkers(activeSegment);
  while (segments.length > 1) {
    const before = segments.slice(0, -1).join(" ").trim();
    if (before && before !== lastSentSegmentText) {
      chunks.push({
        text: before,
        postContrastShift: contrastShiftPendingForSegment,
        segmentComplete: true,
      });
    }

    const remainder = segments[segments.length - 1];
    const remainderIndex = transcript.indexOf(remainder, activeSegmentStartIndex);
    startNewSegment(remainderIndex >= 0 ? remainderIndex : activeSegmentStartIndex + (activeSegment.length - remainder.length));
    activeSegment = transcript.slice(activeSegmentStartIndex);
    segments = splitByContrastMarkers(activeSegment);
  }

  // No (more) contrast markers in the active segment — return it as a tail
  // candidate if it's new. Sizing/gating happens in processAndClassify.
  const trimmedActive = activeSegment.trim();
  if (!trimmedActive) {
    return chunks;
  }

  chunks.push({
    text: trimmedActive,
    postContrastShift: contrastShiftPendingForSegment,
    segmentComplete: false,
  });
  return chunks;
}

/**
 * Marks a tail segment's text as actually sent to the model: updates the
 * incremental-diff baseline (`lastSentSegmentText`) and clears the
 * post-contrast-shift flag so later chunks from the same segment aren't
 * re-flagged as a fresh shift. NOT called for `segmentComplete` chunks —
 * by the time those are handled, `startNewSegment` has already moved the
 * tracked segment forward, so there's nothing of theirs left to mark.
 */
function markSegmentChunkSent(sentText: string): void {
  lastSentSegmentText = sentText;
  contrastShiftPendingForSegment = false;
}

// ──────────────────── Rolling average + threshold logic ────────────────────

/** Number of past predictions for taking average */
const SMOOTHING_WINDOW = 5;

/**
 * Minimum gap between top two smoothed emotions to allow a switch.
 * Bypassed for a chunk whose `postContrastShift` flag is set — see
 * `processAndClassify`. Without that bypass, a genuine mid-sentence
 * emotional reversal could fail to cross this threshold because the
 * smoothed history is still weighted toward the pre-contrast emotion.
 */
const EMOTION_SWITCH_THRESHOLD = 0.05;

/** History of (lexically corrected) emotion scores fed into smoothing. */
let predictionHistory: Array<Record<string, number>> = [];

/** Last emotion that was actually emitted (default: neutral) */
let lastEmittedEmotion: string = 'neutral';

/** Confidence of the last emitted emotion (from the SMOOTHED scores) */
let lastEmittedConfidence: number = 0;

/** Last analyzed transcript for explanation diffing. */
let lastTranscript = "";

/**
 * Whitespace-only tokenizer used for the raw-text diff algorithm below.
 * Deliberately NOT the same as `extractWords` — this one needs to preserve
 * punctuation attached to words so `computeAddedText` reconstructs exact
 * substrings of the original transcript, not normalized lexical tokens.
 */
function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function computeAddedText(previous: string, current: string): string {
  const prev = previous.trim();
  const curr = current.trim();
  if (!curr) return "";
  if (!prev) return curr;
  if (curr.startsWith(prev)) {
    // Only safe to take this shortcut if `prev` actually ends on a word
    // boundary in `curr` — otherwise `prev`'s last "word" was really just a
    // partial prefix of a longer word `curr` goes on to complete (e.g.
    // prev="...was ner", curr="...was nervous"), and slicing at prev.length
    // would wrongly return just the trailing fragment ("vous") instead of
    // the whole completed word ("nervous"). Fall through to the word-level
    // diff below in that case.
    const lastPrevChar = prev.charAt(prev.length - 1);
    const nextCurrChar = curr.charAt(prev.length);
    const endsOnWordBoundary =
      nextCurrChar === "" ||
      /\s/.test(nextCurrChar) ||
      !/[a-z0-9']/i.test(lastPrevChar);
    if (endsOnWordBoundary) {
      return curr.slice(prev.length).trim();
    }
  }

  const prevWords = tokenize(prev);
  const currWords = tokenize(curr);

  let prefix = 0;
  while (
    prefix < prevWords.length &&
    prefix < currWords.length &&
    prevWords[prefix].toLowerCase() === currWords[prefix].toLowerCase()
  ) {
    prefix += 1;
  }

  let prevSuffix = prevWords.length - 1;
  let currSuffix = currWords.length - 1;
  while (
    prevSuffix >= prefix &&
    currSuffix >= prefix &&
    prevWords[prevSuffix].toLowerCase() === currWords[currSuffix].toLowerCase()
  ) {
    prevSuffix -= 1;
    currSuffix -= 1;
  }

  const addedWords = currWords.slice(prefix, currSuffix + 1);
  return addedWords.join(" ").trim();
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?,;:])\s+|\s+(?=but\b|however\b|although\b|though\b|yet\b|then\b|once\b)/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function countWordHits(words: string[], dictionary: Set<string>): number {
  let hits = 0;
  for (const word of words) {
    if (dictionary.has(word)) hits += 1;
  }
  return hits;
}

function getMatchedWords(words: string[], dictionary: Set<string>): string[] {
  return Array.from(new Set(words.filter((word) => dictionary.has(word))));
}

function scoreChunk(chunk: string): EmotionExplanationChunk {
  const words = extractWords(chunk);
  const { positiveWords, negativeWords, valence } = analyzeSegment(words);
  const emotionWords = getMatchedWords(words, EMOTION_HINT_WORDS);
  const hasNegation = countWordHits(words, NEGATION_WORDS) > 0;
  const hasIntensifier = countWordHits(words, INTENSIFIER_WORDS) > 0;
  const hasContrast = countWordHits(words, CONTRAST_WORDS) > 0;

  const matchedKeywords = {
    positive: positiveWords,
    negative: negativeWords,
    emotion: emotionWords,
    negation: getMatchedWords(words, NEGATION_WORDS),
    intensifier: getMatchedWords(words, INTENSIFIER_WORDS),
    contrast: getMatchedWords(words, CONTRAST_WORDS),
  };

  const triggerWords = Array.from(new Set([
    ...matchedKeywords.positive,
    ...matchedKeywords.negative,
    ...matchedKeywords.emotion,
    ...matchedKeywords.negation,
    ...matchedKeywords.intensifier,
    ...matchedKeywords.contrast,
  ]));

  // Count of recognized emotion-hint words in this chunk. (positive/negative
  // are polarity-resolved views of this SAME set, not counted again to
  // avoid double-weighting a chunk just for having an anchor word.)
  const keywordHits = emotionWords.length;

  const valenceScore = Math.abs(valence);
  const negationBonus = hasNegation ? 0.8 : 0;
  const intensifierBonus = hasIntensifier ? 0.6 : 0;
  const contrastBonus = hasContrast ? 0.5 : 0;
  const lengthBonus = Math.min(words.length / 12, 0.4);
  const score =
    valenceScore +
    keywordHits * 1.2 +
    negationBonus +
    intensifierBonus +
    contrastBonus +
    lengthBonus;

  return {
    text: chunk,
    score,
    valence,
    hasNegation,
    hasIntensifier,
    hasContrast,
    keywordHits,
    triggerWords,
    matchedKeywords,
    scoreBreakdown: {
      valence: valenceScore,
      keywordHits,
      negationBonus,
      intensifierBonus,
      contrastBonus,
      lengthBonus,
      total: score,
    },
  };
}

function buildChunkReason(chunk: EmotionExplanationChunk | null): string {
  if (!chunk) {
    return "No high-signal phrase found in this turn.";
  }

  const parts: string[] = [];
  if (chunk.triggerWords.length > 0) {
    parts.push(`keywords: ${chunk.triggerWords.join(", ")}`);
  }
  if (chunk.matchedKeywords.negation.length > 0) {
    parts.push(`negation: ${chunk.matchedKeywords.negation.join(", ")}`);
  }
  if (chunk.matchedKeywords.intensifier.length > 0) {
    parts.push(`intensifier: ${chunk.matchedKeywords.intensifier.join(", ")}`);
  }
  if (chunk.matchedKeywords.contrast.length > 0) {
    parts.push(`contrast: ${chunk.matchedKeywords.contrast.join(", ")}`);
  }
  if (chunk.valence > 0.2) parts.push(`positive valence ${chunk.valence.toFixed(2)}`);
  if (chunk.valence < -0.2) parts.push(`negative valence ${chunk.valence.toFixed(2)}`);

  if (parts.length === 0) {
    return "Explanation is based on weak lexical cues from the selected phrase.";
  }

  return `Top phrase selected because ${parts.join(", ")}.`;
}

function buildEmotionExplanation(previousTranscript: string, currentTranscript: string): EmotionExplanation {
  const addedText = computeAddedText(previousTranscript, currentTranscript);
  const source = addedText ? "addedText" : "fullTranscript";
  const chunksSource = addedText || currentTranscript;
  const chunks = splitIntoChunks(chunksSource).map(scoreChunk);
  const topChunk = chunks.length > 0
    ? chunks.reduce((best, current) => (current.score > best.score ? current : best))
    : null;
  const chunkReason = buildChunkReason(topChunk);

  const reason = source === "addedText"
    ? chunkReason
    : `No new text detected, so explanation is based on the full current transcript. ${chunkReason}`;

  return {
    previousTranscript,
    currentTranscript,
    addedText,
    source,
    reason,
    topChunk,
    chunks,
  };
}

/**
 * Update rolling window and return element‑wise average of all scores.
 * The window is a FIFO queue of the last n (SMOOTHING_WINDOW) predictions.
 */
function getSmoothedScores(newScores: Record<string, number>): Record<string, number> {
  predictionHistory.push(newScores);
  if (predictionHistory.length > SMOOTHING_WINDOW) {
    predictionHistory.shift();
  }
  return peekSmoothedScores();
}

/**
 * Element-wise average of the current history WITHOUT pushing anything new.
 * Used on buffered turns (no chunk flushed) so callers still get a
 * consistent `emotionScores` distribution instead of `{}`.
 */
function peekSmoothedScores(): Record<string, number> {
  const count = predictionHistory.length;
  if (count === 0) return {};

  const allKeys = new Set<string>();
  for (const entry of predictionHistory) {
    for (const key of Object.keys(entry)) {
      allKeys.add(key);
    }
  }

  const averaged: Record<string, number> = {};
  for (const key of allKeys) {
    let sum = 0;
    for (const entry of predictionHistory) {
      sum += (entry[key] ?? 0);
    }
    averaged[key] = sum / count;
  }
  return averaged;
}

/** Get top N emotions (sorted descending by score). */
function getTopN(scores: Record<string, number>, n: number): Array<{ emotion: string; score: number }> {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([emotion, score]) => ({ emotion, score }));
}

/**
 * Reset all rolling/buffering state. Call this when starting a new
 * conversation. Currently called after Final Transcript with a timeout of
 * 1000 ms.
 */
export function resetEmotionProcessing(): void {
  predictionHistory = [];
  lastEmittedEmotion = 'neutral';
  lastEmittedConfidence = 0;
  lastTranscript = "";
  activeSegmentStartIndex = 0;
  contrastShiftPendingForSegment = false;
  lastSentSegmentText = "";
  chunkScoreCache.clear();
}

// ──────────────────── Public API ────────────────────

/** Default empty ML fields */
const EMPTY_ML: Pick<TextSignals, "modelEmotion" | "modelConfidence" | "emotionScores" | "inferenceLatencyMs" | "analysisLatencyMs" | "emotionCount" | "complexityScore" | "complexityBreakdown" | "uncertaintyScore" | "uncertaintyBreakdown"> = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {},
  inferenceLatencyMs: 0,
  analysisLatencyMs: 0,
  emotionCount: 0,
  complexityScore: 0,
  complexityBreakdown: {
    topGapComplexity: 0,
    entropyComplexity: 0,
    lexicalConflictComplexity: 0,
    emotionCountComplexity: 0,
    total: 0,
    notes: ["ML not available"],
  },
  uncertaintyScore: 1,
  uncertaintyBreakdown: {
    confidenceUncertainty: 1,
    gapUncertainty: 1,
    entropyUncertainty: 1,
    lexicalUncertainty: 1,
    total: 1,
    notes: ["ML not available"],
  },
};

function countTokens(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function computeNormalizedEntropy(scores: Record<string, number>): number {
  const values = Object.values(scores).filter((score) => score > 0);
  const total = values.reduce((sum, score) => sum + score, 0);
  if (total <= 0 || values.length <= 1) return 0;

  let entropy = 0;
  for (const score of values) {
    const probability = score / total;
    entropy -= probability * Math.log(probability);
  }

  return clamp01(entropy / Math.log(values.length));
}

function computeLexicalUncertainty(explanation: EmotionExplanation | undefined): { score: number; notes: string[] } {
  if (!explanation) {
    return { score: 0.4, notes: ["No explanation available"] };
  }

  const topChunk = explanation.topChunk;
  if (!topChunk) {
    return { score: 0.6, notes: ["No strong chunk identified"] };
  }

  const notes: string[] = [];
  let score = 0;

  if (topChunk.triggerWords.length === 0) {
    score += 0.35;
    notes.push("No trigger words found");
  }

  const hasPositive = topChunk.matchedKeywords.positive.length > 0;
  const hasNegative = topChunk.matchedKeywords.negative.length > 0;
  if (hasPositive && hasNegative) {
    score += 0.35;
    notes.push("Positive and negative cues in same chunk");
  }

  if (topChunk.hasNegation) {
    score += 0.15;
    notes.push("Negation present");
  }

  if (topChunk.hasContrast) {
    score += 0.15;
    notes.push("Contrast present");
  }

  if (topChunk.hasIntensifier) {
    score += 0.05;
    notes.push("Intensifier present");
  }

  return { score: clamp01(score), notes };
}

function computeComplexity(
  smoothedScores: Record<string, number>,
  topTwo: Array<{ emotion: string; score: number }>,
  explanation: EmotionExplanation | undefined,
): TextSignals["complexityBreakdown"] {
  const topScore = topTwo[0]?.score ?? 0;
  const secondScore = topTwo[1]?.score ?? 0;
  const topGapComplexity = clamp01(1 - Math.max(0, topScore - secondScore));
  const entropyComplexity = computeNormalizedEntropy(smoothedScores);

  const topChunk = explanation?.topChunk;
  let lexicalConflictComplexity = 0;
  const notes: string[] = [];

  if (topChunk) {
    const hasPositive = topChunk.matchedKeywords.positive.length > 0;
    const hasNegative = topChunk.matchedKeywords.negative.length > 0;
    if (hasPositive && hasNegative) {
      lexicalConflictComplexity = 1;
      notes.push("Positive and negative cues in same chunk");
    } else if ((hasPositive || hasNegative) && topChunk.hasContrast) {
      lexicalConflictComplexity = 0.85;
      notes.push("Contrast with emotional cue");
    } else if ((hasPositive || hasNegative) && topChunk.hasNegation) {
      lexicalConflictComplexity = 0.75;
      notes.push("Negation with emotional cue");
    } else if (topChunk.triggerWords.length === 0) {
      lexicalConflictComplexity = 0.35;
      notes.push("No strong emotional trigger words");
    } else {
      lexicalConflictComplexity = 0.25;
    }
  } else {
    lexicalConflictComplexity = 0.4;
    notes.push("No top chunk available");
  }

  const emotionCount = Object.values(smoothedScores).filter((score) => score >= 0.15).length;
  const emotionCountComplexity = clamp01(Math.max(0, emotionCount - 1) / 4);
  const total = clamp01(
    topGapComplexity * 0.35 +
    entropyComplexity * 0.25 +
    lexicalConflictComplexity * 0.25 +
    emotionCountComplexity * 0.15,
  );

  return {
    topGapComplexity,
    entropyComplexity,
    lexicalConflictComplexity,
    emotionCountComplexity,
    total,
    notes,
  };
}

function computeUncertainty(
  smoothedScores: Record<string, number>,
  topTwo: Array<{ emotion: string; score: number }>,
  explanation: EmotionExplanation | undefined,
): TextSignals["uncertaintyBreakdown"] {
  const topScore = topTwo[0]?.score ?? 0;
  const secondScore = topTwo[1]?.score ?? 0;
  const confidenceUncertainty = clamp01(1 - topScore);
  const gapUncertainty = clamp01(1 - Math.max(0, topScore - secondScore));
  const entropyUncertainty = computeNormalizedEntropy(smoothedScores);
  const lexical = computeLexicalUncertainty(explanation);

  const total = clamp01(
    confidenceUncertainty * 0.35 +
    gapUncertainty * 0.30 +
    entropyUncertainty * 0.20 +
    lexical.score * 0.15,
  );

  return {
    confidenceUncertainty,
    gapUncertainty,
    entropyUncertainty,
    lexicalUncertainty: lexical.score,
    total,
    notes: lexical.notes,
  };
}

/** Instant rule‑based extraction (no ML). Returns in <1 ms. */
export function extractTextSignals(transcript: string): TextSignals {
  return {
    // contentCompleteness is retained at 0 for TextSignals type
    // compatibility only — the old STAR-completeness regex logic was
    // removed in v3 and nothing downstream reads this field. Drop it from
    // the type entirely if that's still true.
    contentCompleteness: 0,
    tokenCount: countTokens(transcript),
    sentimentValence: computeValence(transcript),
    ...EMPTY_ML,
  };
}

/**
 * Scores one finalized chunk against the model, using the dedup cache to
 * skip inference entirely for text we've already scored (e.g. an
 * overlapping re-flush of the same clause).
 */
async function scoreChunkWithModel(chunkText: string): Promise<{
  scores: Record<string, number> | null;
  inferenceMs: number;
  fromCache: boolean;
}> {
  const key = normalizeChunkKey(chunkText);
  const cached = chunkScoreCache.get(key);
  if (cached) {
    return { scores: cached, inferenceMs: 0, fromCache: true };
  }

  try {
    const inferenceStartMs = performance.now();
    const preds = await predictTopK(chunkText, MAX_EMOTION_LABELS);
    const inferenceMs = performance.now() - inferenceStartMs;

    const scores: Record<string, number> = {};
    for (const { label, probability } of preds) {
      scores[label] = probability;
    }
    cacheScoresForChunk(key, scores);
    return { scores, inferenceMs, fromCache: false };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("SUPERSEDED")) {
      // Expected under load — a fresher request already superseded this one.
      return { scores: null, inferenceMs: 0, fromCache: false };
    }
    // Let the controller run its rule-based classifier when ML is unavailable.
    throw error;
  }
}

/**
 * Full extraction: rule‑based + smoothed, lexically-corrected ML emotion.
 *
 * Per turn: (1) diff the transcript to get newly added text, (2) fold it
 * into the pending chunk buffer and see whether a contrast marker or the
 * size threshold finalizes one or more chunks, (3) for each finalized chunk
 * — skipping the model entirely if it's a cache hit — score it, apply the
 * chunk's own negation/contrast-resolved valence to the raw scores, and fold
 * the corrected scores into the smoothing window (clearing the window first
 * if this chunk is flagged `postContrastShift`), (4) pick the emitted
 * emotion from the resulting smoothed distribution using the existing
 * gap-threshold/sticky logic. If no chunk was finalized this turn, no model
 * call happens at all — the previous smoothed distribution is reused.
 */
export async function processAndClassify(
  transcript: string,
  bypassChunkSizeGate: boolean = false,
): Promise<TextSignals & {
  topEmotions?: Array<{ emotion: string; score: number }>;
  explanation?: EmotionExplanation;
  contrastShiftDetected?: boolean;
  chunksScored?: string[];
}> {
  const analysisStartMs = performance.now();
  const base = extractTextSignals(transcript);
  const explanation = buildEmotionExplanation(lastTranscript, transcript);
  lastTranscript = transcript;
  const candidateChunks = decideChunksToFlush(transcript);
  if (DEBUG_LOGGING) { console.log(`Transcript: "${transcript}"`) }
 
  // Decide which candidates actually get sent to the model this turn.
  // `segmentComplete` chunks always go. A still-growing tail chunk only
  // goes once enough NEW text has accumulated since this segment was last
  // sent — unless `bypassChunkSizeGate` is set (pass this for a final
  // transcript, so a short post-contrast tail like "now happy" isn't
  // stranded unsent).
  const chunksToScore: ChunkToScore[] = [];
  for (const candidate of candidateChunks) {
    if (candidate.segmentComplete) {
      chunksToScore.push(candidate);
      continue;
    }
    const newText = computeAddedText(lastSentSegmentText, candidate.text);
    if (!newText) continue; // nothing new since this segment was last sent
    const newWordCount = extractWords(newText).length;
    const newCharCount = newText.length;
    const gatePasses =
      bypassChunkSizeGate ||
      (newWordCount >= MIN_CHUNK_WORDS || newCharCount >= MIN_CHUNK_CHARS);
    if (!gatePasses) continue;
    markSegmentChunkSent(candidate.text);
    chunksToScore.push(candidate);
  }

  if (chunksToScore.length === 0) {
    // Buffering — not enough new material yet, and no contrast marker to
    // force an early flush. No model call this turn.
    const smoothed = peekSmoothedScores();
    const topTwo = getTopN(smoothed, 2);
    return {
      ...base,
      modelEmotion: (predictionHistory.length > 0 ? lastEmittedEmotion : null) as EmotionLabel | null,
      modelConfidence: lastEmittedConfidence,
      emotionScores: smoothed,
      inferenceLatencyMs: 0,
      analysisLatencyMs: performance.now() - analysisStartMs,
      emotionCount: Object.values(smoothed).filter((score) => score >= 0.15).length,
      complexityScore: predictionHistory.length > 0 ? computeComplexity(smoothed, topTwo, explanation).total : 0,
      complexityBreakdown: predictionHistory.length > 0
        ? computeComplexity(smoothed, topTwo, explanation)
        : base.complexityBreakdown,
      uncertaintyScore: predictionHistory.length > 0 ? computeUncertainty(smoothed, topTwo, explanation).total : 1,
      uncertaintyBreakdown: predictionHistory.length > 0
        ? computeUncertainty(smoothed, topTwo, explanation)
        : base.uncertaintyBreakdown,
      topEmotions: topTwo,
      explanation,
      contrastShiftDetected: false,
      chunksScored: [],
    };
  }

  let smoothedScores: Record<string, number> = peekSmoothedScores();
  let anyContrastShift = false;
  let totalInferenceMs = 0;

  const chunksScored: string[] = [];

  for (const chunk of chunksToScore) {
    const { scores: rawScores, inferenceMs, fromCache } = await scoreChunkWithModel(chunk.text);
    totalInferenceMs += inferenceMs;
    chunksScored.push(chunk.text);
    if (!rawScores) continue; // inference failed/superseded — skip this chunk, keep prior smoothing state

    const chunkAnalysis = analyzeSegment(extractWords(chunk.text));
    const correctedScores = applyLexicalCorrection(rawScores, chunkAnalysis);

    if (chunk.postContrastShift) {
      // Clear smoothing history BEFORE folding in this chunk's scores, so
      // the average isn't still weighted toward the pre-contrast emotion —
      // this is what lets "...but I became anxious" actually register.
      predictionHistory = [];
      anyContrastShift = true;
    }

    smoothedScores = getSmoothedScores(correctedScores);

    if (DEBUG_LOGGING) {
      console.log(`[emotion] chunk="${chunk.text}" cache=${fromCache}\nraw=`, rawScores,"\ncorrected=", correctedScores);
      console.log(`Emotion Buffer:\n${JSON.stringify(getTopN(smoothedScores, 5))}`)
    }
  }

  const topTwo = getTopN(smoothedScores, 2);
  const topEmotion = topTwo[0]?.emotion ?? null;
  const topScore = topTwo[0]?.score ?? 0;
  const secondScore = topTwo[1]?.score ?? 0;
  const diff = topScore - secondScore;
  const complexityBreakdown = computeComplexity(smoothedScores, topTwo, explanation);
  const uncertaintyBreakdown = computeUncertainty(smoothedScores, topTwo, explanation);

  let emittedEmotion: string;
  let emittedConfidence: number;

  if (topEmotion === null) {
    emittedEmotion = 'neutral';
    emittedConfidence = 0;
  } else if (anyContrastShift || diff >= EMOTION_SWITCH_THRESHOLD) {
    // Clear winner, or a contrast-triggered shift bypasses the gap
    // requirement entirely — the lexical evidence already tells us an
    // emotion change is happening.
    emittedEmotion = topEmotion;
    emittedConfidence = topScore;
    lastEmittedEmotion = emittedEmotion;
    lastEmittedConfidence = emittedConfidence;
  } else {
    // Difference too small — stay sticky on the last emitted emotion.
    emittedEmotion = lastEmittedEmotion;
    const score = smoothedScores[emittedEmotion];
    emittedConfidence = (score !== undefined) ? score : lastEmittedConfidence;
    if (score !== undefined) {
      lastEmittedConfidence = emittedConfidence;
    }
  }

  return {
    ...base,
    modelEmotion: emittedEmotion as EmotionLabel,
    modelConfidence: emittedConfidence,
    emotionScores: smoothedScores,
    inferenceLatencyMs: totalInferenceMs,
    analysisLatencyMs: performance.now() - analysisStartMs,
    emotionCount: Object.values(smoothedScores).filter((score) => score >= 0.15).length,
    complexityScore: complexityBreakdown.total,
    complexityBreakdown,
    uncertaintyScore: uncertaintyBreakdown.total,
    uncertaintyBreakdown,
    topEmotions: topTwo,
    explanation,
    contrastShiftDetected: anyContrastShift,
    chunksScored,
  };
}
