import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FaqItem, SiteConfig } from '@/lib/content/schemas';
import { cx } from '@/lib/format';
import { RichText } from './RichText';

/** Section name, title and lead — the same rhythm on every page. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
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
      {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
      <Heading
        className={cx(
          'text-ink',
          eyebrow ? 'mt-3' : null,
          Heading === 'h1'
            ? 'text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)] leading-[1.06] tracking-[-0.025em]'
            : 'text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] leading-[1.1]',
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

/** The title block every inner page opens with. */
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
    <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="container-x">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children ? <div className="mt-8 flex flex-wrap items-center gap-2">{children}</div> : null}
      </div>
    </section>
  );
}

/** "Account › Privacy › Delete my account" — where to tap, as keys, the last one pressed. */
export function PathChips({ path, className }: { path: string[]; className?: string }) {
  return (
    <ol className={cx('flex flex-wrap items-center gap-1.5', className)} aria-label="Where to find it in the app">
      {path.map((step, i) => (
        <li key={`${step}-${i}`} className="flex items-center gap-1.5">
          <span
            className={cx(
              'inline-flex h-7 items-center rounded-md px-2.5 text-sm',
              i === path.length - 1 ? 'bg-ink font-medium text-bg' : 'bg-raised text-ink',
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

/**
 * One question in a native, keyboard-friendly accordion. Rows are divided by
 * hairlines, so a run of them belongs inside one `.card`.
 */
export function FaqDisclosure({ item, group }: { item: FaqItem; group?: string }) {
  return (
    <details className="disclosure border-t border-hairline first:border-t-0" name={group}>
      <summary className="flex items-center gap-4 rounded-card px-5 py-5 text-ink transition-colors hover:text-ink-2 sm:px-6">
        <span className="flex-1 text-base font-medium sm:text-[1.0625rem]">{item.question}</span>
        <ChevronDown className="disclosure-chevron size-4.5 shrink-0 text-ink-3" aria-hidden="true" />
      </summary>
      <div className="max-w-prose px-5 pb-6 leading-relaxed text-ink-2 sm:px-6">
        <RichText text={item.answer} />
      </div>
    </details>
  );
}

/** A card that closes a page: "questions? write to us". */
export function QuestionsCard({ site }: { site: SiteConfig }) {
  return (
    <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
      <div className="flex-1">
        <p className="text-xl font-medium text-ink">{site.labels.questionsTitle}</p>
        <p className="mt-1 text-ink-2">{site.labels.questionsBody}</p>
      </div>
      <a href={`mailto:${site.company.email}`} className="btn btn-secondary">
        {site.company.email}
      </a>
    </div>
  );
}
