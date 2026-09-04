type WordmarkProps = {
  inverse?: boolean;
  className?: string;
};

export function Wordmark({ inverse = false, className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark ${inverse ? "wordmark-inverse" : ""} ${className}`}>
      <strong>CMU</strong> <span>Study</span>
    </span>
  );
}
