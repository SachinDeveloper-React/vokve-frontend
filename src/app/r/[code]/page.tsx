import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CopyButton } from '@/components/client/CopyButton';
import { PageHero } from '@/components/ui/blocks';
import { CoinMark } from '@/components/ui/Logo';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { getInvitePage, getSiteConfig } from '@/lib/content';
import type { InvitePage as InviteContent, SiteConfig } from '@/lib/content/schemas';
import { pad2 } from '@/lib/format';

/**
 * Where the app's share links land: `SHARE_URL_BASE` (https://vokve.app/r)
 * + `/{code}`. The page itself is cached; only the code is read per request.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getInvitePage();
  return { title: page.seo.title, description: page.seo.description, robots: { index: false, follow: true } };
}

/** What a member types or a messaging app mangles: case, spaces, dashes. */
const normalise = (raw: string) => decodeURIComponent(raw).toUpperCase().replace(/[\s-]+/g, '');

async function InviteCode({
  params,
  page,
  labels,
}: {
  params: PageProps<'/r/[code]'>['params'];
  page: InviteContent;
  labels: SiteConfig['labels'];
}) {
  const { code: raw } = await params;
  let code = '';
  try {
    code = normalise(raw);
  } catch {
    code = '';
  }
  const valid = new RegExp(page.codePattern).test(code);

  if (!valid) {
    return (
      <div className="glass flex gap-4 p-6 sm:p-8" data-tone="gold">
        <span className="icon-orb [--size:2.75rem]">
          <TriangleAlert className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">{page.invalid.title}</h2>
          <p className="mt-1 leading-relaxed text-ink-2">{page.invalid.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass relative overflow-hidden p-6 text-center sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-[var(--brand)] opacity-20 blur-3xl" />
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-3">{page.codeLabel}</p>
      <p className="mt-4 font-mono text-[clamp(2.25rem,8vw,3.75rem)] font-bold tracking-[0.18em] text-ink">{code}</p>
      <div className="mt-6 flex justify-center">
        <CopyButton value={code} label={labels.copy} copiedLabel={labels.copied} />
      </div>
    </div>
  );
}

function CodeSkeleton() {
  return <div className="glass h-56 animate-pulse" aria-hidden="true" />;
}

export default async function InvitePage({ params }: PageProps<'/r/[code]'>) {
  const [page, site] = await Promise.all([getInvitePage(), getSiteConfig()]);
  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        <span className="glass-ornament inline-flex items-center gap-2.5 py-1.5 pr-4 pl-1.5">
          <CoinMark className="size-8" />
          <span className="text-left leading-tight">
            <span className="block font-bold text-ink">{page.reward.value}</span>
            <span className="block text-xs text-ink-2">{page.reward.label}</span>
          </span>
        </span>
      </PageHero>

      <section className="container-x max-w-3xl space-y-6 pb-16">
        <Suspense fallback={<CodeSkeleton />}>
          <InviteCode params={params} page={page} labels={site.labels} />
        </Suspense>

        <ol className="grid gap-3 sm:grid-cols-2">
          {page.steps.map((step, i) => (
            <li key={step.title} className="glass flex gap-4 p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-2),var(--brand))] font-mono text-sm font-bold text-white">
                {pad2(i + 1)}
              </span>
              <div>
                <h2 className="font-semibold text-ink">{step.title}</h2>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <StoreButtons stores={site.stores} className="justify-center" />
      </section>
    </>
  );
}
