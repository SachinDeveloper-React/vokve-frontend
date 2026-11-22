import { Archive, Download, Mail, Trash2 } from 'lucide-react';
import type { Metadata } from 'next';
import { FaqDisclosure, PageHero, PathChips } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { getDeletionGuide, getSiteConfig } from '@/lib/content';
import { cx, formatDate, pad2 } from '@/lib/format';

export async function generateMetadata(): Promise<Metadata> {
  const guide = await getDeletionGuide();
  return { title: guide.seo.title, description: guide.seo.description, alternates: { canonical: '/delete-account' } };
}

const TIMELINE_TONES = ['brand', 'green', 'violet'] as const;

export default async function DeleteAccountPage() {
  const [guide, site] = await Promise.all([getDeletionGuide(), getSiteConfig()]);
  const mailto = `mailto:${guide.noAccess.email}?subject=${encodeURIComponent(guide.noAccess.subject)}&body=${encodeURIComponent(guide.noAccess.bodyTemplate)}`;

  return (
    <>
      <PageHero eyebrow={guide.hero.eyebrow} title={guide.hero.title} subtitle={guide.hero.subtitle}>
        <span className="chip">
          {site.labels.lastUpdated} {formatDate(guide.updatedAt)}
        </span>
      </PageHero>

      {/* Timeline: ask → change your mind → erased */}
      <section className="container-x pb-6" aria-label={guide.timeline.map(t => t.title).join(', ')}>
        <div className="relative">
          <div className="beam absolute inset-x-[14%] top-1/2 hidden h-px md:block" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
            {guide.timeline.map((stage, i) => (
              <li
                key={stage.label}
                className="glass lift p-6 text-center"
                data-tone={TIMELINE_TONES[i % TIMELINE_TONES.length]}
                data-specular
                data-tilt
              >
                <span className="inline-flex rounded-full bg-[var(--tone)] px-3 py-1 text-xs font-bold text-white shadow-[0_8px_20px_-8px_var(--tone)]">
                  {stage.label}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-ink">{stage.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-12">
        <div className="container-x grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* In the app */}
          <article className="glass p-6 sm:p-9">
            <div className="flex items-center gap-4" data-tone="brand">
              <span className="icon-orb">
                <Trash2 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">{guide.inApp.title}</h2>
                {guide.inApp.subtitle ? <p className="text-ink-2">{guide.inApp.subtitle}</p> : null}
              </div>
            </div>
            <PathChips path={guide.inApp.path} className="mt-6" />
            <ol className="mt-8 space-y-3">
              {guide.inApp.steps.map((step, i) => (
                <li key={step.title} className="well flex gap-4 p-4 sm:p-5">
                  <span className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-2),var(--brand))] font-mono text-sm font-bold text-white shadow-[0_8px_18px_-8px_var(--brand)]">
                    {pad2(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                    <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-ink-2">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <div className="grid grid-cols-1 content-start gap-6">
            {/* Confirmation */}
            <article className="glass p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-ink">{guide.confirmation.title}</h2>
              <ul className="mt-5 space-y-4">
                {guide.confirmation.items.map(item => (
                  <li key={item.title} className="flex gap-4" data-tone="violet">
                    <span className="icon-orb [--size:2.5rem]">
                      <Icon name={item.icon} className="size-4" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* Export first */}
            <article id="export" className="glass scroll-mt-28 p-6 sm:p-8" data-tone="blue">
              <div className="flex items-center gap-4">
                <span className="icon-orb [--size:2.5rem]">
                  <Download className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-xl font-semibold text-ink">{guide.export.title}</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-2">{guide.export.body}</p>
              <PathChips path={guide.export.path} className="mt-5" />
            </article>
          </div>
        </div>
      </section>

      {/* Erased vs kept */}
      <section className="container-x pb-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="glass p-6 sm:p-8" data-tone="brand">
            <div className="flex items-center gap-3">
              <span className="icon-orb [--size:2.5rem]">
                <Trash2 className="size-4" aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">{guide.erased.title}</h2>
            </div>
            <ul className="mt-6 space-y-3">
              {guide.erased.items.map(item => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--tone)]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="glass p-6 sm:p-8" data-tone="gold">
            <div className="flex items-center gap-3">
              <span className="icon-orb [--size:2.5rem]">
                <Archive className="size-4" aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">{guide.retained.title}</h2>
            </div>
            <ul className="mt-6 space-y-3">
              {guide.retained.items.map(item => (
                <li key={item.item} className="well p-4">
                  <p className="font-semibold text-ink">{item.item}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{item.reason}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* No app */}
      <section className="section pt-12">
        <div className="container-x">
          <div className="glass relative overflow-hidden p-8 sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-32 -z-10 size-[24rem] rounded-full bg-[var(--brand-2)] opacity-20 blur-[100px]" />
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-gradient-ink font-display text-3xl font-bold sm:text-4xl">{guide.noAccess.title}</h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-2">{guide.noAccess.body}</p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <a href={mailto} className="btn btn-primary h-13 px-7 text-base">
                  <Mail className="size-4" aria-hidden="true" />
                  {guide.noAccess.buttonLabel}
                </a>
                <a href={`mailto:${guide.noAccess.email}`} className="text-sm font-semibold text-ink-2 hover:text-ink">
                  {guide.noAccess.email}
                </a>
                {guide.noAccess.note ? <p className={cx('max-w-xs text-sm text-ink-3 lg:text-right')}>{guide.noAccess.note}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {guide.faqs.length > 0 ? (
        <section className="container-x pb-16">
          <h2 className="text-gradient-ink mb-6 text-center font-display text-3xl font-bold">{guide.faqTitle}</h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {guide.faqs.map(item => (
              <FaqDisclosure key={item.id} item={item} group="deletion-faq" />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
