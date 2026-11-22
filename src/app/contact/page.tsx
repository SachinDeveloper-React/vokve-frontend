import { ArrowUpRight, Building2, Clock, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHero, PathChips } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { getContactPage, getSiteConfig } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: '/contact' } };
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([getContactPage(), getSiteConfig()]);
  const { company } = site;

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        {company.hours ? (
          <span className="chip">
            <Clock className="size-3.5" aria-hidden="true" />
            {company.hours}
          </span>
        ) : null}
        {company.responseTime ? <span className="chip">{company.responseTime}</span> : null}
      </PageHero>

      <section className="container-x pb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {page.channels.map(channel => {
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <span className="icon-orb">
                    <Icon name={channel.icon} className="size-5" />
                  </span>
                  {channel.href ? <ArrowUpRight className="size-5 text-ink-3" aria-hidden="true" /> : null}
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-ink-3">{channel.title}</p>
                <p className="mt-1 font-display text-xl font-semibold break-words text-ink">{channel.value}</p>
                {channel.note ? <p className="mt-2 text-sm leading-relaxed text-ink-2">{channel.note}</p> : null}
              </>
            );
            return channel.href ? (
              <SmartLink
                key={channel.title}
                href={channel.href}
                className="glass lift block p-6 sm:p-7"
                data-tone={channel.tone}
                data-specular
                data-tilt
              >
                {inner}
              </SmartLink>
            ) : (
              <div key={channel.title} className="glass p-6 sm:p-7" data-tone={channel.tone}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-x grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <article className="glass p-6 sm:p-9">
            <h2 className="font-display text-2xl font-semibold text-ink">{page.inApp.title}</h2>
            <p className="mt-3 leading-relaxed text-ink-2">{page.inApp.body}</p>
            <PathChips path={page.inApp.path} className="mt-6" />
          </article>

          <article className="glass p-6 sm:p-9">
            <div className="flex items-center gap-3" data-tone="violet">
              <span className="icon-orb [--size:2.5rem]">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink">{page.companyTitle}</h2>
            </div>
            <address className="mt-5 space-y-1 not-italic text-ink-2">
              <p className="font-semibold text-ink">{company.legalName}</p>
              {company.address
                .filter(line => line !== company.legalName)
                .map(line => (
                  <p key={line}>{line}</p>
                ))}
              <p>
                <a href={`mailto:${company.email}`} className="text-brand-ink hover:underline">
                  {company.email}
                </a>
              </p>
            </address>
            {company.grievanceOfficer ? (
              <div className="well mt-6 p-5">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <ShieldCheck className="size-4 text-green" aria-hidden="true" />
                  {company.grievanceOfficer.title}
                </p>
                {company.grievanceOfficer.name ? <p className="mt-1 text-ink-2">{company.grievanceOfficer.name}</p> : null}
                <a href={`mailto:${company.grievanceOfficer.email}`} className="mt-1 block text-brand-ink hover:underline">
                  {company.grievanceOfficer.email}
                </a>
                {page.grievanceNote ? <p className="mt-3 text-sm leading-relaxed text-ink-2">{page.grievanceNote}</p> : null}
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </>
  );
}
