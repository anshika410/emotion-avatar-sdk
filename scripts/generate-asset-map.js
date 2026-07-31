// emotion-sdk-v0.1.2/scripts/generate-asset-map.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const finalPath = path.resolve(__dirname, "../dist/index.js");
const tmpPath = finalPath + ".tmp";

const ASSETS_DIR = path.resolve(__dirname, "../public/assets");
const OUT_FILE = path.resolve(__dirname, "../src/constants/emotionAssetData.ts");

const files = fs.readdirSync(ASSETS_DIR).filter((f) => f.endsWith(".webp"));

const entries = files
  .map((file) => {
    const key = path.basename(file, ".webp"); // preserves exact on-disk casing
    const buffer = fs.readFileSync(path.join(ASSETS_DIR, file));
    const dataUri = `data:image/webp;base64,${buffer.toString("base64")}`;
    return `  "${key}": "${dataUri}",`;
  })
  .join("\n");

fs.writeFileSync(
  OUT_FILE,
  `// AUTO-GENERATED — run \`npm run build:assets\` to regenerate.\nexport const EMOTION_ASSET_DATA: Record<string, string> = {\n${entries}\n};\n`
);

console.log(`Generated ${files.length} asset entries -> ${OUT_FILE}`);