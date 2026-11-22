import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { getLegalIndex, getSiteConfig } from '@/lib/content';
import { formatDate } from '@/lib/format';

export async function generateMetadata(): Promise<Metadata> {
  const index = await getLegalIndex();
  return { title: index.seo.title, description: index.seo.description, alternates: { canonical: '/legal' } };
}

const TONES = ['green', 'violet', 'gold', 'blue', 'cyan', 'brand', 'pink'] as const;

export default async function LegalHubPage() {
  const [index, site] = await Promise.all([getLegalIndex(), getSiteConfig()]);
  return (
    <>
      <PageHero eyebrow={index.hero.eyebrow} title={index.hero.title} subtitle={index.hero.subtitle} />
      <section className="container-x pb-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {index.documents.map((doc, i) => (
            <li key={doc.slug} className="flex">
              <SmartLink
                href={doc.href}
                className="glass lift reveal flex w-full flex-col p-6 sm:p-7"
                data-tone={TONES[i % TONES.length]}
                data-specular
                data-tilt
              >
                <div className="flex items-start justify-between">
                  <span className="icon-orb">
                    <Icon name={doc.icon} className="size-5" />
                  </span>
                  <ArrowUpRight className="size-5 text-ink-3" aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-display text-xl font-semibold text-ink">{doc.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{doc.summary}</p>
                <p className="mt-5 text-xs text-ink-3">
                  {site.labels.lastUpdated} {formatDate(doc.updatedAt)}
                </p>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
