import { DayLine } from '@/components/ui/DayLine';
import type { HomePage } from '@/lib/content/schemas';
import { cx, formatNumber, pad2 } from '@/lib/format';

type Sample = NonNullable<HomePage['fairPlay']['sample']>;

/** Gridlines on round numbers: 2,850 steps → lines at 1,000, 2,000 and 3,000. */
function axis(max: number) {
  let step = 10 ** Math.floor(Math.log10(Math.max(max, 1)));
  if (Math.ceil(max / step) < 3) step /= 2;
  if (Math.ceil(max / step) > 5) step *= 2;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = step; t <= top; t += step) ticks.push(t);
  return { top, ticks };
}

const HOUR_LABELS = [0, 6, 12, 18, 24];

/**
 * One day of steps, hour by hour: the walk in red, every other hour in the
 * neutral bar colour, closed by the day line with its status. Bars are plain
 * boxes in a flex row, so labels stay crisp text at every width.
 */
export function DayChart({ sample }: { sample: Sample }) {
  const total = sample.hours.reduce((sum, steps) => sum + steps, 0);
  const walked = sample.hours.slice(sample.walk.from, sample.walk.to).reduce((sum, steps) => sum + steps, 0);
  const { top, ticks } = axis(Math.max(...sample.hours));
  const at = (steps: number) => `${(steps / top) * 100}%`;

  return (
    <figure className="card p-6 sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="text-[0.9375rem] font-medium text-ink">{sample.title}</span>
        <span className="inline-flex items-center gap-2 text-sm text-ink-2">
          <span className="size-2.5 rounded-[2px] bg-brand" aria-hidden="true" />
          {sample.walk.label}
          <span className="font-mono text-ink tabular-nums">{formatNumber(walked)}</span>
        </span>
      </figcaption>

      <div className="mt-8 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3">
        <div className="relative h-52 font-mono text-[0.6875rem] text-ink-3 tabular-nums" aria-hidden="true">
          {ticks.map(tick => (
            <span key={tick} className="absolute right-0 translate-y-1/2" style={{ bottom: at(tick) }}>
              {formatNumber(tick)}
            </span>
          ))}
        </div>
        <div
          className="relative h-52"
          role="img"
          aria-label={`${sample.title}: ${formatNumber(total)} ${sample.stepsLabel}`}
        >
          {ticks.map(tick => (
            <div key={tick} className="absolute inset-x-0 border-t border-hairline" style={{ bottom: at(tick) }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[3px] border-b border-hairline sm:gap-1">
            {sample.hours.map((steps, hour) => (
              <div
                key={hour}
                className={cx(
                  'flex-1 rounded-t-[2px]',
                  hour >= sample.walk.from && hour < sample.walk.to ? 'bg-brand' : 'bg-[var(--bar)]',
                )}
                style={{ height: steps > 0 ? `max(2px, ${at(steps)})` : 0 }}
              />
            ))}
          </div>
        </div>
        <div />
        <div className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink-3" aria-hidden="true">
          {HOUR_LABELS.map(hour => (
            <span key={hour}>{pad2(hour)}</span>
          ))}
        </div>
      </div>

      <DayLine
        className="mt-6 border-t border-hairline pt-5"
        parts={[sample.date, `${formatNumber(total)} ${sample.stepsLabel}`]}
        status={sample.status}
      />
    </figure>
  );
}
