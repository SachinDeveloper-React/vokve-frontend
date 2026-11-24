import { Fragment } from 'react';
import { cx } from '@/lib/format';

export type DayStatus = { text: string; state: 'neutral' | 'pending' | 'paid' };

/**
 * The site's signature: a day written the way the wallet writes it —
 * "Today · 8,432 steps · +7.98 coins" — with a dot for where its coins are
 * (grey counted, amber pending, green paid). It appears only where a day is
 * shown: the Today card, the how-it-works steps, the fair-play chart and the
 * invite page.
 */
export function DayLine({
  parts,
  status,
  className,
}: {
  parts: string[];
  status?: DayStatus | null;
  className?: string;
}) {
  return (
    <p className={cx('day-line', className)}>
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {i > 0 ? (
            <span className="text-ink-3" aria-hidden="true">
              ·
            </span>
          ) : null}
          <span>{part}</span>
        </Fragment>
      ))}
      {status ? (
        <span className={cx('inline-flex items-center gap-2', parts.length > 0 && 'ml-auto')}>
          <span className="status-dot" data-state={status.state} aria-hidden="true" />
          {status.text}
        </span>
      ) : null}
    </p>
  );
}
