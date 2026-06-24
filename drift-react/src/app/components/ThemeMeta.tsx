import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const THEME_COLORS = {
  light: '#fafafa',
  dark: '#0c0c0c',
} as const;

export function ThemeMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const mode = resolvedTheme === 'light' ? 'light' : 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[mode]);
    }
    document.documentElement.style.colorScheme = mode;
  }, [resolvedTheme]);

  return null;
}
