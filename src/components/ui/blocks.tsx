import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FaqItem, SiteConfig } from '@/lib/content/schemas';
import { cx } from '@/lib/format';
import { RichText } from './RichText';

/** Eyebrow, title and lead for a section — the same rhythm on every page. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={cx(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl', className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Heading
        className={cx(
          'text-gradient-ink font-display font-bold leading-[1.05]',
          eyebrow ? 'mt-5' : null,
          Heading === 'h1' ? 'text-[clamp(2.4rem,5.5vw,4.25rem)]' : 'text-[clamp(2rem,4.2vw,3.25rem)]',
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className={cx('mt-5 text-lg leading-relaxed text-ink-2', align === 'center' && 'mx-auto max-w-2xl')}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** The hero every inner page opens with. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative pt-36 pb-12 sm:pt-44 sm:pb-16">
      <div className="container-x">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children ? <div className="mt-8 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
      </div>
    </section>
  );
}

/** "Account › Privacy › Delete my account" — where to tap, as floating chips. */
export function PathChips({ path, className }: { path: string[]; className?: string }) {
  return (
    <ol className={cx('flex flex-wrap items-center gap-1.5', className)} aria-label="Where to find it in the app">
      {path.map((step, i) => (
        <li key={`${step}-${i}`} className="flex items-center gap-1.5">
          <span
            className={cx(
              'rounded-full px-3 py-1 text-sm font-semibold',
              i === path.length - 1
                ? 'bg-brand/10 text-brand-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_30%,transparent)]'
                : 'well text-ink',
            )}
          >
            {step}
          </span>
          {i < path.length - 1 ? <ChevronRight className="size-4 text-ink-3" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  );
}

/** One question in a native, keyboard-friendly accordion. */
export function FaqDisclosure({ item, group }: { item: FaqItem; group?: string }) {
  return (
    <details className="disclosure glass group/faq rounded-panel" name={group}>
      <summary className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <span className="flex-1 text-base font-semibold text-ink sm:text-lg">{item.question}</span>
        <span className="well grid size-8 shrink-0 place-items-center rounded-full">
          <ChevronDown className="disclosure-chevron size-4 text-ink-2" aria-hidden="true" />
        </span>
      </summary>
      <div className="px-5 pb-5 text-ink-2 leading-relaxed sm:px-6 sm:pb-6">
        <RichText text={item.answer} />
      </div>
    </details>
  );
}

/** A card that closes a page: "questions? write to us". */
export function QuestionsCard({ site }: { site: SiteConfig }) {
  return (
    <div className="glass flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
      <div className="flex-1">
        <p className="font-display text-xl font-semibold text-ink">{site.labels.questionsTitle}</p>
        <p className="mt-1 text-ink-2">{site.labels.questionsBody}</p>
      </div>
      <a href={`mailto:${site.company.email}`} className="btn btn-glass">
        {site.company.email}
      </a>
    </div>
  );
}
