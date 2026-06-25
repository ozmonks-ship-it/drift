type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, { mark: number; text: number; gap: number; stroke: number; dot: number }> = {
  sm: { mark: 18, text: 13, gap: 8, stroke: 1.2, dot: 1.4 },
  md: { mark: 28, text: 20, gap: 10, stroke: 1.2, dot: 2 },
  lg: { mark: 44, text: 32, gap: 14, stroke: 1.2, dot: 3 },
};

interface SolmLogoProps {
  size?: Size;
  /** Show just the icon mark, no wordmark */
  markOnly?: boolean;
  /** Show just the wordmark, no mark */
  wordOnly?: boolean;
  className?: string;
}

export function SolmLogo({ size = 'md', markOnly = false, wordOnly = false, className = '' }: SolmLogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap }}>
      {!wordOnly && (
        <SolmMark size={size} />
      )}
      {!markOnly && (
        <span
          style={{
            fontSize: s.text,
            fontWeight: 300,
            letterSpacing: '0.04em',
            lineHeight: 1,
            color: 'currentColor',
          }}
        >
          solm
        </span>
      )}
    </div>
  );
}

interface SolmMarkProps {
  size?: Size;
  className?: string;
}

export function SolmMark({ size = 'md', className = '' }: SolmMarkProps) {
  const s = sizes[size];
  const cx = s.mark / 2;
  const r = cx - s.stroke;

  return (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox={`0 0 ${s.mark} ${s.mark}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="currentColor"
        strokeWidth={s.stroke}
      />
      <circle
        cx={cx}
        cy={cx}
        r={s.dot}
        fill="currentColor"
      />
    </svg>
  );
}
