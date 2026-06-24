import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

type ThemeOption = (typeof OPTIONS)[number]['value'];

export function AppearanceSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = (theme ?? 'system') as ThemeOption;

  return (
    <div className="rounded-2xl border border-solm-border p-5">
      <p
        className="tracking-[0.22em] uppercase mb-4"
        style={{ fontSize: '10px', color: 'var(--solm-text-3)' }}
      >
        Appearance
      </p>
      <div
        className="flex rounded-2xl border border-solm-border p-1 gap-1"
        role="radiogroup"
        aria-label="Color theme"
      >
        {OPTIONS.map(({ value, label }) => {
          const selected = mounted && current === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!mounted}
              onClick={() => setTheme(value)}
              className="flex-1 rounded-xl py-2.5 transition-colors"
              style={{
                fontSize: '13px',
                fontWeight: selected ? 400 : 300,
                color: selected ? 'var(--solm-text-1)' : 'var(--solm-text-4)',
                background: selected ? 'var(--solm-surface)' : 'transparent',
                border: selected ? '0.5px solid var(--solm-border-strong)' : '0.5px solid transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
