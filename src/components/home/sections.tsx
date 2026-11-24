import { ArrowRight, Check } from 'lucide-react';
import { FaqDisclosure, SectionHeading } from '@/components/ui/blocks';
import { DayLine } from '@/components/ui/DayLine';
import { Icon } from '@/components/ui/Icon';
import { CoinMark, LogoMark } from '@/components/ui/Logo';
import { RichText } from '@/components/ui/RichText';
import { SmartLink } from '@/components/ui/SmartLink';
import { StoreButtons } from '@/components/ui/StoreButtons';
import type { HomePage, SiteConfig } from '@/lib/content/schemas';
import { cx, pad2 } from '@/lib/format';
import { DayChart } from './DayChart';
import { TodayCard } from './TodayCard';

function Headline({ title, highlight }: { title: string; highlight: string | null }) {
  const at = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || at < 0) return title;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-brand-ink">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  );
}

/** Real news, as one quiet line: no pill, no badge colour. */
function Announcement({ announcement }: { announcement: NonNullable<SiteConfig['announcement']> }) {
  const body = (
    <>
      {announcement.badge ? <span className="font-medium text-ink">{announcement.badge}</span> : null}
      <span>{announcement.text}</span>
      {announcement.link ? (
        <span className="inline-flex items-center gap-1 font-medium text-ink">
          {announcement.link.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
  const className = 'inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-2';
  return announcement.link ? (
    <SmartLink href={announcement.link.href} className={cx(className, 'rounded-md transition-colors hover:text-ink')}>
      {body}
    </SmartLink>
  ) : (
    <p className={className}>{body}</p>
  );
}

export function Hero({ hero, announcement }: { hero: HomePage['hero']; announcement: SiteConfig['announcement'] }) {
  return (
    <section className="container-x grid grid-cols-1 items-center gap-16 pt-12 pb-20 sm:pt-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:py-16">
      <div className="max-w-xl">
        {announcement ? (
          <div className="enter mb-10 [--i:0]">
            <Announcement announcement={announcement} />
          </div>
        ) : null}
        {hero.eyebrow ? <p className="section-label enter mb-4 [--i:0]">{hero.eyebrow}</p> : null}
        <h1 className="enter text-[clamp(2.5rem,1.5rem+3.6vw,4.25rem)] leading-[1.04] tracking-[-0.03em] text-ink [--i:1]">
          <Headline title={hero.title} highlight={hero.highlight} />
        </h1>
        <p className="enter mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-2 sm:text-xl [--i:2]">{hero.subtitle}</p>
        <div className="enter mt-10 flex flex-wrap gap-3 [--i:3]">
          <SmartLink href={hero.primaryCta.href} className="btn btn-primary btn-lg">
            {hero.primaryCta.label}
          </SmartLink>
          {hero.secondaryCta ? (
            <SmartLink href={hero.secondaryCta.href} className="btn btn-secondary btn-lg">
              {hero.secondaryCta.label}
            </SmartLink>
          ) : null}
        </div>
      </div>
      <div className="enter [--i:2]">
        <TodayCard scene={hero.scene} />
      </div>
    </section>
  );
}

/** The figures, then the promises, between two hairlines. */
export function StatsStrip({ stats, trust }: { stats: HomePage['stats']; trust: HomePage['hero']['trust'] }) {
  if (stats.length === 0 && trust.length === 0) return null;
  return (
    <section className="border-y border-hairline">
      <div className="container-x">
        {stats.length > 0 ? (
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cx(
                  'flex flex-col py-8',
                  i % 2 === 1 ? 'border-l border-hairline pl-6' : 'pr-6',
                  i >= 2 && 'border-t border-hairline lg:border-t-0',
                  i === 2 && 'lg:border-l lg:pl-6',
                  i > 0 && 'lg:pl-6',
                )}
              >
                <dt className="order-2 mt-2 text-sm leading-snug text-ink-2">{stat.label}</dt>
                <dd className="order-1 text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {trust.length > 0 ? (
          <ul className="flex flex-wrap gap-x-8 gap-y-2 border-t border-hairline py-5 text-sm text-ink-2">
            {trust.map(item => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-ink-3" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function HowItWorks({ section }: { section: HomePage['howItWorks'] }) {
  return (
    <section id="how-it-works" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <ol className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {section.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col border-t border-hairline pt-6">
              <div className="flex items-center gap-3 text-ink-3">
                <span className="font-mono text-sm tabular-nums">{pad2(i + 1)}</span>
                <Icon name={step.icon} className="size-4.5" />
              </div>
              <h3 className="mt-6 text-xl leading-snug text-ink">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{step.body}</p>
              {step.status ? <DayLine className="mt-auto pt-6" parts={[]} status={step.status} /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Features({ section }: { section: HomePage['features'] }) {
  const [lead, ...rest] = section.items;
  return (
    <section id="features" className="section pt-0">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        {lead ? (
          <article className="card mt-16 grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-end lg:gap-12 lg:p-10">
            <div>
              <Icon name={lead.icon} className="size-6 text-ink-2" />
              <h3 className="mt-8 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight tracking-[-0.015em] text-ink">
                {lead.title}
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-ink-2">{lead.body}</p>
          </article>
        ) : null}
        {rest.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(feature => (
              <li key={feature.title} className="border-t border-hairline pt-6">
                <div className="flex items-center gap-3">
                  <Icon name={feature.icon} className="size-4.5 shrink-0 text-ink-3" />
                  <h3 className="text-[1.0625rem] text-ink">{feature.title}</h3>
                </div>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{feature.body}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

/** The prize board: challenges grouped by cadence, rewards in one right-aligned column. */
export function Challenges({ section }: { section: HomePage['challenges'] }) {
  const groups: { cadence: string; items: HomePage['challenges']['items'] }[] = [];
  for (const item of section.items) {
    const group = groups.find(g => g.cadence === item.cadence);
    if (group) group.items.push(item);
    else groups.push({ cadence: item.cadence, items: [item] });
  }

  return (
    <section id="challenges" className="section pt-0">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <div
          className={cx(
            'card mt-16 grid grid-cols-1 divide-y divide-hairline lg:divide-x lg:divide-y-0',
            groups.length === 2 && 'lg:grid-cols-2',
            groups.length >= 3 && 'lg:grid-cols-3',
          )}
        >
          {groups.map(group => (
            <section key={group.cadence} aria-label={group.cadence} className="min-w-0">
              <h3 className="flex items-baseline justify-between px-6 pt-6 pb-3 text-[0.9375rem] font-medium text-ink">
                {group.cadence}
                <span className="font-mono text-xs text-ink-3 tabular-nums">{group.items.length}</span>
              </h3>
              <ul>
                {group.items.map(item => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 border-t border-hairline px-6 py-4"
                  >
                    <Icon name={item.icon} className="mt-0.5 size-4.5 text-ink-3" />
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 text-sm text-ink-2">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="inline-flex items-center gap-1.5 font-mono text-[0.8125rem] text-ink tabular-nums">
                        <CoinMark className="size-4" />
                        {item.rewardLabel}
                      </p>
                      {item.badgeLabel ? <p className="mt-0.5 font-mono text-xs text-ink-3">{item.badgeLabel}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {section.note ? (
          <p className="prose-legal mt-6 max-w-2xl text-sm">
            <RichText text={section.note} />
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function FairPlay({ section }: { section: HomePage['fairPlay'] }) {
  return (
    <section id="fair-play" className="section pt-0">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
          <ol className="mt-10 border-b border-hairline">
            {section.layers.map((layer, i) => (
              <li key={layer.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-t border-hairline py-5">
                <span className="pt-0.5 font-mono text-sm text-ink-3 tabular-nums">{pad2(i + 1)}</span>
                <div>
                  <h3 className="text-[1.0625rem] text-ink">{layer.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">{layer.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {section.note ? (
            <p className="prose-legal mt-6 max-w-xl text-sm">
              <RichText text={section.note} />
            </p>
          ) : null}
        </div>
        {section.sample ? (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DayChart sample={section.sample} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function PrivacyPromise({ section }: { section: HomePage['privacy'] }) {
  return (
    <section id="privacy" className="section pt-0">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {section.points.map(point => (
            <li key={point.title} className="flex flex-col border-t border-hairline pt-6">
              <Icon name={point.icon} className="size-4.5 text-ink-3" />
              <h3 className="mt-5 text-[1.0625rem] text-ink">{point.title}</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">{point.body}</p>
              {point.link ? (
                <SmartLink
                  href={point.link.href}
                  className="group mt-5 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-medium text-ink"
                >
                  <span className="underline decoration-hairline underline-offset-4 transition-colors group-hover:decoration-current">
                    {point.link.label}
                  </span>
                  <ArrowRight className="size-4 text-ink-3" aria-hidden="true" />
                </SmartLink>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqTeaser({ section }: { section: HomePage['faq'] }) {
  return (
    <section id="faq" className="section pt-0">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
          <SmartLink href={section.cta.href} className="btn btn-secondary mt-8">
            {section.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </SmartLink>
        </div>
        <div className="card self-start">
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
    <section id="download" className="section pt-0">
      <div className="container-x">
        <div className="card grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:p-16">
          <div className="max-w-xl">
            {section.eyebrow ? <p className="section-label mb-3">{section.eyebrow}</p> : null}
            <h2 className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.06] tracking-[-0.025em] text-ink">
              {section.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{section.subtitle}</p>
            <StoreButtons stores={site.stores} className="mt-8" />
            {section.note ? <p className="mt-6 text-sm text-ink-3">{section.note}</p> : null}
          </div>
          <figure className="hidden flex-col items-center gap-3 lg:flex lg:pr-8">
            <LogoMark className="size-32 shadow-float [border-radius:22.6%]" />
            <figcaption className="text-sm text-ink-2">{site.brand.name}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
