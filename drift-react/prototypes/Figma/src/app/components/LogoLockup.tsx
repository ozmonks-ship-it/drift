interface LogoLockupProps {
  color?: string;
}

export function LogoLockup({ color = '#ffffff' }: LogoLockupProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Icon — 52×52, paths sourced from SolmLogo1 */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 75 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer circle */}
        <path
          d="M37.5 73.5C57.3823 73.5 73.5 57.3823 73.5 37.5C73.5 17.6177 57.3823 1.5 37.5 1.5C17.6177 1.5 1.5 17.6177 1.5 37.5C1.5 57.3823 17.6177 73.5 37.5 73.5Z"
          stroke={color}
          strokeWidth="3"
        />
        {/* Inner dot — concentric, r=15 in 75×75 space */}
        <circle cx="37.5" cy="37.5" r="15" fill={color} />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontSize: '56px',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color,
        }}
      >
        solm
      </span>
    </div>
  );
}
