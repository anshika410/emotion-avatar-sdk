import PlaceholderImage from './PlaceholderImage';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  placeholderText?: string;
  type?: 'image' | 'video' | 'youtube';
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function MediaRenderer({
  src,
  alt = '',
  className = '',
  placeholderText = 'Image',
  type = 'image',
}: MediaRendererProps) {
  if (!src || !isSafeUrl(src)) {
    return <PlaceholderImage text={placeholderText} className={className} />;
  }

  if (type === 'youtube' || src.includes('youtube.com') || src.includes('youtu.be')) {
    const videoId = getYouTubeId(src);
    if (videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={alt}
          className={className}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  if (type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm')) {
    return (
      <video controls className={className}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
