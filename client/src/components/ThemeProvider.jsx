import { useEffect } from 'react';
import { useThemeStore } from '@/store';

export function ThemeProvider({ children }) {
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
}
