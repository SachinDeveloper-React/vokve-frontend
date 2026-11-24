'use client';

import { useEffect, useState } from 'react';
import { cx, pad2 } from '@/lib/format';

/** The document's sections, with the one you are reading lit. */
export function LegalToc({ sections, label }: { sections: { id: string; title: string }[]; label: string }) {
  const [current, setCurrent] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const targets = sections
      .map(section => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={label}>
      <p className="px-3 pb-2 text-sm font-medium text-ink-3">{label}</p>
      <ol className="space-y-0.5">
        {sections.map((section, index) => {
          const active = section.id === current;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? 'location' : undefined}
                className={cx(
                  'flex gap-2.5 rounded-lg px-3 py-2 text-sm leading-snug transition-colors',
                  active
                    ? 'bg-raised text-ink'
                    : 'text-ink-2 hover:text-ink',
                )}
              >
                <span className={cx('font-mono text-xs leading-5', active ? 'text-brand-ink' : 'text-ink-3')}>
                  {pad2(index + 1)}
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
