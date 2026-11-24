import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/blocks';
import { getLicensesPage } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLicensesPage();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: '/licenses' } };
}

export default async function LicensesPage() {
  const page = await getLicensesPage();
  const tally = new Map<string, number>();
  for (const pkg of page.packages) tally.set(pkg.license, (tally.get(pkg.license) ?? 0) + 1);

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        {[...tally.entries()].map(([license, count]) => (
          <span key={license} className="chip">
            {license} · {count}
          </span>
        ))}
      </PageHero>
      <section className="container-x pb-16">
        <div className="card max-w-4xl overflow-hidden">
          <p className="border-b border-hairline px-6 py-4 text-sm text-ink-2 sm:px-8">{page.intro}</p>
          <ul>
            {page.packages.map(pkg => (
              <li key={`${pkg.name}@${pkg.version}`} className="border-b border-hairline last:border-b-0">
                <a
                  href={pkg.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-raised sm:px-8"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{pkg.name}</span>
                    <span className="font-mono text-xs text-ink-3">v{pkg.version}</span>
                  </span>
                  <span className="chip">{pkg.license}</span>
                  {pkg.url ? (
                    <ArrowUpRight className="size-4 text-ink-3 transition-colors group-hover:text-ink" aria-hidden="true" />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
