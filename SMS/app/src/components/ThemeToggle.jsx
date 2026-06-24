import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const getInitial = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('sms_theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeToggle = () => {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    localStorage.setItem('sms_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-xs transition-all"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
