import { ArrowRight, ArrowUpRight, Check, Medal } from 'lucide-react';
import { SpatialStage } from '@/components/client/SpatialStage';
import { FaqDisclosure, SectionHeading } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { CoinMark, LogoMark } from '@/components/ui/Logo';
import { RichText } from '@/components/ui/RichText';
import { SmartLink } from '@/components/ui/SmartLink';
import { StoreButtons } from '@/components/ui/StoreButtons';
import type { HomePage, SiteConfig, Tone } from '@/lib/content/schemas';
import { cx, pad2 } from '@/lib/format';
import { HeroScene } from './HeroScene';

const STEP_TONES: Tone[] = ['brand', 'violet', 'gold', 'pink'];

function Headline({ title, highlight }: { title: string; highlight: string | null }) {
  const at = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <span className="text-gradient-ink">{title}</span>;
  return (
    <>
      <span className="text-gradient-ink">{title.slice(0, at)}</span>
      <span className="text-gradient-brand">{highlight}</span>
      <span className="text-gradient-ink">{title.slice(at + highlight.length)}</span>
    </>
  );
}

function Announcement({ announcement }: { announcement: NonNullable<SiteConfig['announcement']> }) {
  const body = (
    <>
      {announcement.badge ? (
        <span className="rounded-full bg-[linear-gradient(100deg,var(--brand),var(--brand-2))] px-2.5 py-0.5 text-xs font-bold text-white">
          {announcement.badge}
        </span>
      ) : null}
      <span className="truncate">{announcement.text}</span>
      {announcement.link ? <ArrowRight className="size-4 shrink-0" aria-hidden="true" /> : null}
    </>
  );
  const className =
    'glass-ornament mb-6 inline-flex max-w-full items-center gap-2 py-1.5 pl-1.5 pr-4 text-sm text-ink-2 transition hover:text-ink';
  return announcement.link ? (
    <SmartLink href={announcement.link.href} className={className} aria-label={`${announcement.text} — ${announcement.link.label}`}>
      {body}
    </SmartLink>
  ) : (
    <p className={className}>{body}</p>
  );
}

export function Hero({ hero, announcement }: { hero: HomePage['hero']; announcement: SiteConfig['announcement'] }) {
  return (
    <section className="relative overflow-x-clip pt-32 pb-10 sm:pt-40">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="text-center lg:text-left">
          {announcement ? <Announcement announcement={announcement} /> : null}
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,6.4vw,5rem)] font-bold leading-[0.98] tracking-[-0.04em]">
            <Headline title={hero.title} highlight={hero.highlight} />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2 lg:mx-0 lg:text-xl">{hero.subtitle}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <SmartLink href={hero.primaryCta.href} className="btn btn-primary h-13 px-7 text-base">
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </SmartLink>
            {hero.secondaryCta ? (
              <SmartLink href={hero.secondaryCta.href} className="btn btn-glass h-13 px-7 text-base">
                {hero.secondaryCta.label}
              </SmartLink>
            ) : null}
          </div>
          <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-2 lg:justify-start">
            {hero.trust.map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid grid-cols-1 size-5 place-items-center rounded-full bg-green/15">
                  <Check className="size-3 text-green" strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HeroScene scene={hero.scene} />
      </div>
    </section>
  );
}

export function StatsStrip({ stats }: { stats: HomePage['stats'] }) {
  if (stats.length === 0) return null;
  return (
    <section className="container-x pb-6">
      <dl className="glass grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cx(
              'px-6 py-7 text-center sm:px-8',
              i % 2 === 1 && 'border-l border-hairline',
              i >= 2 && 'border-t border-hairline lg:border-t-0',
              i === 2 && 'lg:border-l',
            )}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="text-gradient-brand block font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 block text-sm text-ink-2">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function HowItWorks({ section }: { section: HomePage['howItWorks'] }) {
  return (
    <section id="how-it-works" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <div className="relative mt-16">
          <div className="beam absolute inset-x-[10%] top-[3.25rem] hidden h-px lg:block" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {section.steps.map((step, i) => (
              <li
                key={step.title}
                className="glass lift reveal p-6 sm:p-7"
                data-specular
                data-tilt
                data-tone={STEP_TONES[i % STEP_TONES.length]}
              >
                <div className="flex items-start justify-between">
                  <span className="icon-orb">
                    <Icon name={step.icon} className="size-5" />
                  </span>
                  <span className="font-display text-5xl font-bold leading-none text-ink/10">{pad2(i + 1)}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Features({ section }: { section: HomePage['features'] }) {
  return (
    <section id="features" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
          {section.items.map(feature => (
            <article
              key={feature.title}
              data-tone={feature.tone}
              data-specular
              data-tilt
              className={cx(
                'glass lift reveal overflow-hidden p-6 sm:p-7',
                feature.span === 'wide' ? 'sm:col-span-2 md:col-span-3' : 'md:col-span-2',
              )}
            >
              <div
                aria-hidden="true"
                className={cx(
                  'pointer-events-none absolute -top-16 -right-16 -z-10 rounded-full bg-[var(--tone)] blur-3xl',
                  feature.span === 'wide' ? 'size-56 opacity-25' : 'size-40 opacity-15',
                )}
              />
              <span className="icon-orb">
                <Icon name={feature.icon} className="size-5" />
              </span>
              <h3 className={cx('mt-6 font-semibold text-ink', feature.span === 'wide' ? 'text-2xl' : 'text-xl')}>
                {feature.title}
              </h3>
              <p className="mt-2 max-w-md leading-relaxed text-ink-2">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Challenges({ section }: { section: HomePage['challenges'] }) {
  return (
    <section id="challenges" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
      </div>
      <div className="container-x">
        <div className="scroller-mask no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-4 pb-12 sm:-mx-6 sm:px-6">
          {section.items.map(item => (
            <article
              key={item.id}
              className="glass lift w-[16.5rem] shrink-0 snap-start p-5 sm:w-[18rem] sm:p-6"
              data-specular
              data-tilt
            >
              <div className="flex items-start justify-between">
                <span className="well grid grid-cols-1 size-14 place-items-center rounded-2xl text-3xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="chip">{item.cadence}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-2">{item.description}</p>
              <div className="mt-6 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold/12 py-1 pr-3 pl-1 text-sm font-bold text-gold">
                  <CoinMark className="size-6" />
                  {item.rewardLabel}
                </span>
                {item.badgeLabel ? (
                  <span className="chip">
                    <Medal className="size-3.5" aria-hidden="true" />
                    {item.badgeLabel}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {section.note ? (
          <p className="prose-legal mx-auto max-w-2xl text-center text-sm">
            <RichText text={section.note} />
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function FairPlay({ section }: { section: HomePage['fairPlay'] }) {
  return (
    <section id="fair-play" className="section">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="text-center lg:text-left">
          <SectionHeading align="left" eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} className="mx-auto lg:mx-0" />
          {section.note ? (
            <p className="prose-legal mx-auto mt-6 max-w-xl lg:mx-0">
              <RichText text={section.note} />
            </p>
          ) : null}
        </div>
        <SpatialStage className="stage" strength={5}>
          <ol className="stage-inner space-y-4 [--base-rx:6deg] [--base-ry:-14deg] max-lg:[--base-rx:0deg] max-lg:[--base-ry:0deg]">
            {section.layers.map((layer, i) => (
              <li
                key={layer.title}
                className={cx(
                  'glass flex items-start gap-4 p-5 sm:p-6',
                  ['lg:translate-z-0', 'lg:ml-8 lg:translate-z-[40px]', 'lg:ml-16 lg:translate-z-[80px]', 'lg:ml-24 lg:translate-z-[120px]'][i % 4],
                )}
                data-tone={(['blue', 'violet', 'gold', 'green'] as const)[i % 4]}
              >
                <span className="icon-orb [--size:2.75rem]">
                  <Icon name={layer.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="flex items-baseline gap-2.5 text-lg font-semibold text-ink">
                    <span className="font-mono text-xs text-ink-3">{pad2(i + 1)}</span>
                    {layer.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{layer.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </SpatialStage>
      </div>
    </section>
  );
}

export function PrivacyPromise({ section }: { section: HomePage['privacy'] }) {
  return (
    <section id="privacy" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.points.map(point => (
            <article key={point.title} className="glass lift reveal flex flex-col p-6" data-tone={point.tone} data-specular data-tilt>
              <span className="icon-orb">
                <Icon name={point.icon} className="size-5" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-ink">{point.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{point.body}</p>
              {point.link ? (
                <SmartLink
                  href={point.link.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition hover:gap-2.5"
                >
                  {point.link.label}
                  <ArrowUpRight className="size-4 text-brand" aria-hidden="true" />
                </SmartLink>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqTeaser({ section }: { section: HomePage['faq'] }) {
  return (
    <section id="faq" className="section">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="text-center lg:text-left">
          <SectionHeading align="left" eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} className="mx-auto lg:mx-0" />
          <SmartLink href={section.cta.href} className="btn btn-glass mt-8">
            {section.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </SmartLink>
        </div>
        <div className="space-y-3">
          {section.items.map(item => (
            <FaqDisclosure key={item.id} item={item} group="home-faq" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Download({ section, site }: { section: HomePage['download']; site: SiteConfig }) {
  return (
    <section id="download" className="section pb-12">
      <div className="container-x">
        <div className="glass relative overflow-hidden p-8 sm:p-12 lg:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[28rem] rounded-full bg-[var(--brand)] opacity-25 blur-[110px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[var(--brand-2)] opacity-20 blur-[100px]" />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2 className="text-gradient-ink mt-5 font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-bold leading-[1.02]">
                {section.title}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-ink-2 lg:mx-0">{section.subtitle}</p>
              <StoreButtons stores={site.stores} className="mt-8 justify-center lg:justify-start" />
              {section.note ? <p className="mt-6 text-sm text-ink-3">{section.note}</p> : null}
            </div>
            <SpatialStage className="stage mx-auto w-full max-w-[18rem]" strength={14}>
              <div className="stage-inner aspect-square [--base-rx:12deg] [--base-ry:-18deg]">
                <div className="layer inset-x-[8%] -bottom-[16%] h-[16%] rounded-[50%] bg-[var(--brand)] opacity-40 blur-2xl [--z:-60px]" />
                <div className="layer floating inset-0 [--z:40px]">
                  <LogoMark className="size-full rounded-[22.6%] shadow-[0_40px_80px_-24px_rgb(229_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.4)]" />
                </div>
              </div>
            </SpatialStage>
          </div>
        </div>
      </div>
    </section>
  );
}
