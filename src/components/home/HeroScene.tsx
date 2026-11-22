import { BadgeCheck, Flame, Medal } from 'lucide-react';
import { SpatialStage } from '@/components/client/SpatialStage';
import { Icon } from '@/components/ui/Icon';
import { CoinMark } from '@/components/ui/Logo';
import type { HomePage } from '@/lib/content/schemas';
import { fill, formatNumber } from '@/lib/format';

const RING_RADIUS = 84;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * The hero's spatial scene: today's step window in the middle, with streak,
 * coins, challenge and rank floating in front of it at their own depths.
 * The stage leans toward the pointer; each layer's `--z` is what turns that
 * lean into parallax.
 */
export function HeroScene({ scene }: { scene: HomePage['hero']['scene'] }) {
  const progress = Math.min(1, scene.steps / scene.goal);
  return (
    <SpatialStage className="stage relative mx-auto aspect-[10/11] w-full max-w-[33rem]" strength={9}>
      <div className="stage-inner size-full [--base-rx:7deg] [--base-ry:-15deg] max-sm:[--base-ry:-8deg]">
        {/* Shadow on the floor beneath the windows */}
        <div className="layer inset-x-[12%] bottom-[0%] h-[12%] rounded-[50%] bg-black/25 blur-2xl [--z:-120px] dark:bg-black/60" />

        {/* Main window: today */}
        <div className="layer glass left-[16%] top-[9%] w-[68%] p-[4.5%] [--z:0px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-2">{scene.dayLabel}</span>
            <span className="chip text-green">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {scene.verifiedLabel}
            </span>
          </div>
          <div className="relative mx-auto my-[6%] aspect-square w-[80%]">
            <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden="true">
              <defs>
                <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" className="[stop-color:var(--brand-2)]" />
                  <stop offset="1" className="[stop-color:var(--brand)]" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r={RING_RADIUS} fill="none" strokeWidth="14" className="ring-track" />
              <circle
                cx="100"
                cy="100"
                r={RING_RADIUS}
                fill="none"
                stroke="url(#hero-ring)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${(RING_LENGTH * progress).toFixed(1)} ${RING_LENGTH.toFixed(1)}`}
                className="[filter:drop-shadow(0_0_8px_color-mix(in_oklab,var(--brand)_65%,transparent))]"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-[clamp(1.75rem,4.2vw,2.6rem)] font-bold tabular-nums tracking-tight text-ink">
                  {formatNumber(scene.steps)}
                </p>
                <p className="text-xs text-ink-3 sm:text-sm">
                  {scene.stepsLabel} · {fill(scene.goalLabel, { goal: formatNumber(scene.goal) })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {scene.metrics.map(metric => (
              <div key={metric.label} className="well rounded-2xl px-1 py-2.5 text-center">
                <Icon name={metric.icon} className="mx-auto size-4 text-brand" />
                <p className="mt-1 text-xs font-semibold text-ink sm:text-sm">{metric.value}</p>
                <p className="text-[0.6875rem] text-ink-3">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="layer floating glass left-[-2%] top-[20%] flex items-center gap-3 rounded-3xl p-3 pr-5 [--delay:-2s] [--z:110px]">
          <span className="icon-orb [--size:2.75rem]" data-tone="orange">
            <Flame className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold leading-none text-ink">{scene.streak.value}</p>
            <p className="mt-1 text-xs text-ink-2">{scene.streak.label}</p>
          </div>
        </div>

        {/* Coins today */}
        <div className="layer floating glass-ornament right-[2%] top-[3%] flex items-center gap-2.5 py-2 pl-2 pr-4 [--delay:-4s] [--z:160px]">
          <CoinMark className="size-8 drop-shadow-[0_4px_10px_rgb(245_179_1/0.55)]" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-ink tabular-nums">{scene.coin.value}</p>
            <p className="text-[0.6875rem] text-ink-2">{scene.coin.label}</p>
          </div>
        </div>

        {/* Challenge */}
        <div className="layer floating glass right-[-4%] top-[56%] hidden w-[46%] rounded-3xl p-4 sm:block [--delay:-1s] [--z:80px]">
          <p className="text-sm font-semibold text-ink">{scene.challenge.title}</p>
          <div className="well mt-3 h-2 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-2),var(--brand))]"
              style={{ width: `${Math.round(scene.challenge.progress * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-2 tabular-nums">{Math.round(scene.challenge.progress * 100)}%</span>
            <span className="font-semibold text-gold">{scene.challenge.reward}</span>
          </div>
        </div>

        {/* Rank */}
        <div className="layer floating glass bottom-[6%] left-[4%] flex items-center gap-3 rounded-3xl p-3 pr-5 max-sm:-bottom-[4%] max-sm:left-[0%] [--delay:-5.5s] [--z:135px]">
          <span className="icon-orb [--size:2.75rem]" data-tone="violet">
            <Medal className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold leading-none text-ink">{scene.rank.value}</p>
            <p className="mt-1 text-xs text-ink-2">{scene.rank.label}</p>
          </div>
        </div>
      </div>
    </SpatialStage>
  );
}
