interface PlaceholderImageProps {
  text: string;
  className?: string;
  icon?: string;
}

export default function PlaceholderImage({ text, className = '', icon = '🥋' }: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gradient-to-br from-royal-blue/10 to-saffron/10 flex flex-col items-center justify-center ${className}`}
    >
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-sm text-gray-500 font-medium text-center px-4">{text}</span>
    </div>
  );
}
