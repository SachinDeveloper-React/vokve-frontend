import { Flame, Medal } from 'lucide-react';
import type { CSSProperties } from 'react';
import { DayLine } from '@/components/ui/DayLine';
import { Icon } from '@/components/ui/Icon';
import { CoinMark } from '@/components/ui/Logo';
import type { HomePage } from '@/lib/content/schemas';
import { fill, formatNumber } from '@/lib/format';

const RING_RADIUS = 84;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * The hero's one product view: today as the app shows it — the step ring,
 * the day's numbers and the challenge in progress — closed by the day line,
 * with a coin resting against the card's edge. The ring is the only red on
 * it, and it fills once when the page opens.
 */
export function TodayCard({ scene }: { scene: HomePage['hero']['scene'] }) {
  const progress = Math.min(1, scene.steps / scene.goal);
  const percent = Math.round(scene.challenge.progress * 100);
  const ring = { '--ring-length': RING_LENGTH.toFixed(1) } as CSSProperties;

  return (
    <figure className="relative mx-auto w-full max-w-[27rem]">
      <div className="card p-6 shadow-float sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.9375rem] font-medium text-ink">{scene.dayLabel}</p>
          <p className="flex items-center gap-4 font-mono text-xs text-ink-2">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-3.5 text-ink-3" aria-hidden="true" />
              {scene.streak.value} {scene.streak.label}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Medal className="size-3.5 text-ink-3" aria-hidden="true" />
              {scene.rank.value} {scene.rank.label}
            </span>
          </p>
        </div>

        <div className="relative mx-auto my-8 aspect-square w-[62%]">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={RING_RADIUS} fill="none" strokeWidth="12" stroke="var(--raised)" />
            <circle
              cx="100"
              cy="100"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH.toFixed(1)}
              strokeDashoffset={(RING_LENGTH * (1 - progress)).toFixed(1)}
              className="ring-fill"
              style={ring}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                {formatNumber(scene.steps)}
              </p>
              <p className="mt-2 text-[0.8125rem] text-ink-3">
                {scene.stepsLabel} · {fill(scene.goalLabel, { goal: formatNumber(scene.goal) })}
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-4">
          {scene.metrics.map(metric => (
            <div key={metric.label} className="flex flex-col">
              <dt className="order-2 mt-1 flex items-center gap-1.5 text-xs text-ink-3">
                <Icon name={metric.icon} className="size-3.5" />
                {metric.label}
              </dt>
              <dd className="order-1 text-[1.0625rem] font-medium text-ink tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-hairline pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[0.9375rem] font-medium text-ink">{scene.challenge.title}</p>
            <p className="font-mono text-[0.8125rem] text-ink-2 tabular-nums">{scene.challenge.reward}</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
            <div className="h-full rounded-full bg-ink" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 font-mono text-xs text-ink-3 tabular-nums">{percent}%</p>
        </div>

        <DayLine
          className="mt-5 border-t border-hairline pt-4"
          parts={[scene.dayLabel, `${formatNumber(scene.steps)} ${scene.stepsLabel}`, `${scene.coin.value} ${scene.coin.label}`]}
          status={{ text: scene.verifiedLabel, state: 'paid' }}
        />
      </div>

      <CoinMark className="absolute top-[34%] -right-4 size-16 rotate-[16deg] drop-shadow-[0_10px_12px_var(--coin-shadow)] sm:-right-10 sm:size-20" />
    </figure>
  );
}
