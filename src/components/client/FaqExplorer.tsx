'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { FaqItem } from '@/lib/content/schemas';
import { cx } from '@/lib/format';

type Category = { id: string; title: string; icon: ReactNode };

/** Every word typed must appear in the question, the answer or a tag. */
function matches(item: FaqItem, words: string[]) {
  if (words.length === 0) return true;
  const haystack = `${item.question} ${item.answer} ${item.tags.join(' ')}`.toLowerCase();
  return words.every(word => haystack.includes(word));
}

/**
 * Search and topic filter over the help centre. Icons arrive already drawn
 * from the server, so the icon set never ships to the browser. Answers are
 * pre-rendered too (`answers`), keeping the link/bold parser server-side.
 */
export function FaqExplorer({
  categories,
  items,
  answers,
  labels,
}: {
  categories: Category[];
  items: FaqItem[];
  answers: Record<string, ReactNode>;
  labels: { searchPlaceholder: string; allCategories: string; noResults: string };
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = items.filter(item => (category === null || item.category === category) && matches(item, words));
  const counts = new Map<string, number>();
  for (const item of items) if (matches(item, words)) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);

  const groups =
    category === null && words.length === 0
      ? categories
          .map(c => ({ category: c, items: visible.filter(item => item.category === c.id) }))
          .filter(group => group.items.length > 0)
      : [{ category: null, items: visible }];

  return (
    <div>
      <label className="glass flex h-16 items-center gap-3 rounded-full px-6">
        <Search className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
        <span className="sr-only">{labels.searchPlaceholder}</span>
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={labels.searchPlaceholder}
          className="h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
        />
      </label>

      <div className="no-scrollbar max-sm:scroller-mask -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0" role="toolbar">
        <FilterChip active={category === null} onClick={() => setCategory(null)}>
          {labels.allCategories}
          <span className="text-ink-3">{items.filter(item => matches(item, words)).length}</span>
        </FilterChip>
        {categories.map(c => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(category === c.id ? null : c.id)}>
            <span className="[&>svg]:size-4">{c.icon}</span>
            {c.title}
            <span className="text-ink-3">{counts.get(c.id) ?? 0}</span>
          </FilterChip>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {visible.length === 0 ? (
          <p className="glass p-8 text-center text-ink-2">{labels.noResults}</p>
        ) : (
          groups.map(group => (
            <section key={group.category?.id ?? 'results'} aria-label={group.category?.title}>
              {group.category ? (
                <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-ink">
                  <span className="icon-orb [--size:2.25rem] [&>svg]:size-4" data-tone="brand">
                    {group.category.icon}
                  </span>
                  {group.category.title}
                </h2>
              ) : null}
              <div className="space-y-3">
                {group.items.map(item => (
                  <details key={item.id} className="disclosure glass rounded-panel" name="faq">
                    <summary className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                      <span className="flex-1 text-base font-semibold text-ink sm:text-lg">{item.question}</span>
                      <span className="well grid size-8 shrink-0 place-items-center rounded-full">
                        <ChevronDown className="disclosure-chevron size-4 text-ink-2" aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="px-5 pb-5 leading-relaxed text-ink-2 sm:px-6 sm:pb-6">{answers[item.id]}</div>
                  </details>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
        active ? 'btn-primary text-white [&_.text-ink-3]:text-white/70' : 'btn-glass text-ink-2 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
