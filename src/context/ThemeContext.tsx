import { useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeContext } from './theme-context';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'auto';
}

function getInitialEffectiveTheme(t: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  if (t === 'dark') return 'dark';
  if (t === 'light') return 'light';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    getInitialEffectiveTheme(getInitialTheme())
  );

  useEffect(() => {
    const updateTheme = () => {
      let activeTheme: 'light' | 'dark';

      if (theme === 'auto') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        activeTheme = theme;
      }

      setEffectiveTheme(activeTheme);
      document.documentElement.setAttribute('data-theme', activeTheme);
      document.documentElement.classList.toggle('dark', activeTheme === 'dark');
      document.documentElement.style.backgroundColor = activeTheme === 'dark' ? '#090A0F' : '#F8F9FA';
    };

    updateTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
