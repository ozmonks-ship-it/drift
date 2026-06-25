import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { resolved, setMode, mode } = useTheme();

  const next = resolved === 'dark' ? 'light' : 'dark';
  const label = resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={() => setMode(next)}
      aria-label={label}
      title={label}
      className="flex items-center justify-center transition-colors"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '12px',
        border: '0.5px solid var(--solm-border)',
        color: 'var(--solm-text-4)',
        background: 'transparent',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--solm-text-2)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--solm-border-hover)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--solm-text-4)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--solm-border)';
      }}
    >
      {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 1.5V3M8 13v1.5M14.5 8H13M3 8H1.5M12.36 3.64l-1.06 1.06M4.7 11.3l-1.06 1.06M12.36 12.36l-1.06-1.06M4.7 4.7L3.64 3.64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}
