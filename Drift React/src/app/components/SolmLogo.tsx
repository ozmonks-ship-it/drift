type SolmLogoSize = 'sm' | 'md' | 'lg';

const sizeConfig = {
  sm: { mark: 18, word: 24, gap: 8 },
  md: { mark: 28, word: 36, gap: 10 },
  lg: { mark: 40, word: 56, gap: 12 },
} as const;

export type SolmMarkProps = {
  size?: SolmLogoSize;
  className?: string;
};

export function SolmMark({ size = 'md', className }: SolmMarkProps) {
  const px = sizeConfig[size].mark;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

export type SolmLogoProps = {
  size?: SolmLogoSize;
  markOnly?: boolean;
  wordOnly?: boolean;
  className?: string;
};

export function SolmLogo({
  size = 'lg',
  markOnly = false,
  wordOnly = false,
  className,
}: SolmLogoProps) {
  const { word, gap } = sizeConfig[size];

  if (markOnly) {
    return <SolmMark size={size} className={className} />;
  }

  if (wordOnly) {
    return (
      <span
        className={className}
        style={{
          fontSize: word,
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        solm
      </span>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
      }}
    >
      <SolmMark size={size} />
      <span
        style={{
          fontSize: word,
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        solm
      </span>
    </div>
  );
}
