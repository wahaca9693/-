import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'mnr-theme';

const readInitialTheme = (): Theme => {
  if (typeof document === 'undefined') return 'dark';
  if (document.documentElement.classList.contains('dark')) return 'dark';
  return 'light';
};

/**
 * إدارة ثيم الواجهة (فاتح / داكن).
 * الاختيار يُحفظ في localStorage ومُطبّق على <html> عبر class="dark".
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.backgroundColor = theme === 'dark' ? '#070a12' : '#f2f5fb';
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* التخزين غير متاح (وضع التصفح الخاص) — نتجاهل بأمان */
    }
  }, [theme]);

  /** في حال تغيّر تفضيل النظام ولم يختر المستخدم بنفسه، نتبع النظام */
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* تجاهل */
      }
      setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, setTheme };
};
