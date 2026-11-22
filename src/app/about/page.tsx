import { ArrowRight, Quote } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHero, SectionHeading } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { getAboutPage } from '@/lib/content';
import { cx } from '@/lib/format';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: '/about' } };
}

export default async function AboutPage() {
  const page = await getAboutPage();
  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle} />

      {/* Story + numbers */}
      <section className="container-x pb-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <article className="glass p-7 sm:p-10">
            <span className="eyebrow">{page.story.eyebrow}</span>
            <h2 className="text-gradient-ink mt-5 font-display text-3xl font-bold sm:text-4xl">{page.story.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-2">
              {page.story.paragraphs.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <div className="grid grid-cols-1 gap-5">
            {page.story.quote ? (
              <figure className="glass relative overflow-hidden p-7 sm:p-8" data-tone="brand">
                <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 -z-10 size-56 rounded-full bg-[var(--tone)] opacity-25 blur-3xl" />
                <Quote className="size-8 text-brand" aria-hidden="true" />
                <blockquote className="mt-4 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
                  {page.story.quote.text}
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink-3">— {page.story.quote.attribution}</figcaption>
              </figure>
            ) : null}
            <dl className="glass grid grid-cols-2">
              {page.numbers.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cx('p-6', i % 2 === 1 && 'border-l border-hairline', i >= 2 && 'border-t border-hairline')}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="text-gradient-brand block font-display text-2xl font-bold sm:text-3xl">{stat.value}</span>
                    <span className="mt-1 block text-sm text-ink-2">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow={page.values.eyebrow} title={page.values.title} subtitle={page.values.subtitle} />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.values.items.map(value => (
              <article key={value.title} className="glass lift reveal p-6" data-tone={value.tone} data-specular data-tilt>
                <span className="icon-orb">
                  <Icon name={value.icon} className="size-5" />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section pt-0">
        <div className="container-x">
          <SectionHeading eyebrow={page.milestones.eyebrow} title={page.milestones.title} subtitle={page.milestones.subtitle} />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div aria-hidden="true" className="absolute top-4 bottom-4 left-[1.375rem] w-px bg-[linear-gradient(var(--brand),var(--brand-2),transparent)] sm:left-[1.625rem]" />
            <ol className="space-y-5">
            {page.milestones.items.map(item => (
              <li key={item.title} className="relative flex gap-5 sm:gap-6">
                <span className="relative z-10 mt-5 grid grid-cols-1 size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-2),var(--brand))] shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand)_15%,transparent),0_10px_24px_-8px_var(--brand)] sm:size-13">
                  <span className="size-2.5 rounded-full bg-white" />
                </span>
                <div className="glass reveal flex-1 p-5 sm:p-6">
                  <span className="chip">{item.when}</span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-ink-2">{item.body}</p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Team (optional) */}
      {page.team && page.team.members.length > 0 ? (
        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading eyebrow={page.team.eyebrow} title={page.team.title} subtitle={page.team.subtitle} />
            <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.team.members.map(member => (
                <li key={member.name} className="glass lift p-6 text-center" data-specular data-tilt>
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- photos come from the backend's media host
                    <img src={member.photoUrl} alt="" className="mx-auto size-24 rounded-full object-cover" />
                  ) : (
                    <span className="icon-orb mx-auto [--size:6rem] text-2xl font-bold" data-tone="violet">
                      {member.name
                        .split(/\s+/)
                        .map(part => part[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                  )}
                  <p className="mt-4 font-semibold text-ink">{member.name}</p>
                  <p className="text-sm text-ink-2">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container-x pb-16">
        <div className="glass relative overflow-hidden p-8 text-center sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/2 -z-10 size-[26rem] -translate-x-1/2 rounded-full bg-[var(--brand)] opacity-25 blur-[100px]" />
          <h2 className="text-gradient-ink font-display text-[clamp(2rem,4vw,3rem)] font-bold">{page.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-ink-2">{page.cta.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SmartLink href={page.cta.primary.href} className="btn btn-primary">
              {page.cta.primary.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </SmartLink>
            {page.cta.secondary ? (
              <SmartLink href={page.cta.secondary.href} className="btn btn-glass">
                {page.cta.secondary.label}
              </SmartLink>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
