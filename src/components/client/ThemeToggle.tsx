'use client';

import { Moon, Sun } from 'lucide-react';
import { THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * The inline script in the root layout applies a saved choice before first
 * paint; without one the site follows the system. Both icons are rendered
 * and CSS shows the right one, so the server and browser HTML always match.
 */
export function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice lasts for this page only.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-10 shrink-0 place-items-center rounded-full text-ink-2 transition hover:bg-[var(--well)] hover:text-ink"
    >
      <Moon className="size-[1.125rem] dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-[1.125rem] dark:block" aria-hidden="true" />
    </button>
  );
}
