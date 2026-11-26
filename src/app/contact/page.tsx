import { ArrowUpRight, Building2, Clock, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/client/ContactForm';
import { PageHero, PathChips } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { RichText } from '@/components/ui/RichText';
import { SmartLink } from '@/components/ui/SmartLink';
import { cx } from '@/lib/format';
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
        <div className={page.channels.length === 4 ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid grid-cols-1 gap-4 md:grid-cols-3'}>
          {page.channels.map(channel => {
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <Icon name={channel.icon} className="size-4.5" />
                  </span>
                  {channel.href ? <ArrowUpRight className="size-4.5 text-ink-3" aria-hidden="true" /> : null}
                </div>
                <p className="mt-6 text-sm font-medium text-ink-3">{channel.title}</p>
                <p className="mt-1 text-xl font-medium break-words text-ink">{channel.value}</p>
                {channel.note ? <p className="mt-2 text-sm leading-relaxed text-ink-2">{channel.note}</p> : null}
              </>
            );
            return channel.href ? (
              <SmartLink
                key={channel.title}
                href={channel.href}
                className="card block p-6 transition-colors hover:bg-raised sm:p-7"
              >
                {inner}
              </SmartLink>
            ) : (
              <div key={channel.title} className="card p-6 sm:p-7">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section pt-10">
        <div className={cx('container-x grid grid-cols-1 items-start gap-6', page.form ? 'lg:grid-cols-[1.35fr_1fr]' : 'lg:grid-cols-2')}>
          {page.form ? <ContactFormCard form={page.form} /> : null}

          <div className={cx('grid gap-6', !page.form && 'contents')}>
          <article className="card p-6 sm:p-9">
            <h2 className="text-2xl font-medium text-ink">{page.inApp.title}</h2>
            <p className="mt-3 leading-relaxed text-ink-2">{page.inApp.body}</p>
            <PathChips path={page.inApp.path} className="mt-6" />
          </article>

          <article className="card p-6 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="icon-box [--size:2.5rem]">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-medium text-ink">{page.companyTitle}</h2>
            </div>
            <address className="mt-5 space-y-1 not-italic text-ink-2">
              <p className="font-medium text-ink">{company.legalName}</p>
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
                <p className="flex items-center gap-2 font-medium text-ink">
                  <ShieldCheck className="size-4 text-ink-3" aria-hidden="true" />
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
        </div>
      </section>
    </>
  );
}

/** The form's card: its words from the backend, the linkable ones rendered here. */
function ContactFormCard({ form }: { form: NonNullable<Awaited<ReturnType<typeof getContactPage>>['form']> }) {
  const { consent, successBody, errorBody, rateLimitedBody, ...copy } = form;
  return (
    <article id="message" className="card scroll-mt-24 p-6 sm:p-9">
      <h2 className="text-2xl font-medium text-ink">{form.title}</h2>
      {form.subtitle ? <p className="mt-3 leading-relaxed text-ink-2">{form.subtitle}</p> : null}
      <div className="mt-8">
        <ContactForm
          copy={copy}
          consent={consent ? <RichText text={consent} /> : null}
          success={<RichText text={successBody} />}
          failure={<RichText text={errorBody} />}
          limited={<RichText text={rateLimitedBody} />}
        />
      </div>
    </article>
  );
}
