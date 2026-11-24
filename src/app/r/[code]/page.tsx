import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CopyButton } from '@/components/client/CopyButton';
import { PageHero } from '@/components/ui/blocks';
import { DayLine } from '@/components/ui/DayLine';
import { CoinMark } from '@/components/ui/Logo';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { getInvitePage, getSiteConfig } from '@/lib/content';
import type { InvitePage as InviteContent, SiteConfig } from '@/lib/content/schemas';
import { pad2 } from '@/lib/format';

/**
 * Where the app's share links land: ⚙ `support.inviteUrlBase`
 * (https://vokve.com/r, edited on the CRM's Contact & links page) + `/{code}`. The page itself is cached; only the code is read per request.
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
      <div className="card flex gap-4 p-6 sm:p-8">
        <span className="icon-box [--size:2.75rem]">
          <TriangleAlert className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-medium text-ink">{page.invalid.title}</h2>
          <p className="mt-1 leading-relaxed text-ink-2">{page.invalid.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 text-center sm:p-10">
      <p className="section-label">{page.codeLabel}</p>
      <p className="mt-4 font-mono text-[clamp(2.25rem,8vw,3.75rem)] font-medium tracking-[0.18em] text-ink">{code}</p>
      <div className="mt-6 flex justify-center">
        <CopyButton value={code} label={labels.copy} copiedLabel={labels.copied} />
      </div>
    </div>
  );
}

function CodeSkeleton() {
  return <div className="card h-56 animate-pulse" aria-hidden="true" />;
}

export default async function InvitePage({ params }: PageProps<'/r/[code]'>) {
  const [page, site] = await Promise.all([getInvitePage(), getSiteConfig()]);
  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        <span className="inline-flex items-center gap-3">
          <CoinMark className="size-7" />
          <DayLine parts={[page.reward.value, page.reward.label]} />
        </span>
      </PageHero>

      <section className="container-x pb-16">
        <div className="max-w-3xl space-y-6">
        <Suspense fallback={<CodeSkeleton />}>
          <InviteCode params={params} page={page} labels={site.labels} />
        </Suspense>

        <ol className="grid gap-3 sm:grid-cols-2">
          {page.steps.map((step, i) => (
            <li key={step.title} className="card flex gap-4 p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-raised font-mono text-xs text-ink-2">
                {pad2(i + 1)}
              </span>
              <div>
                <h2 className="font-medium text-ink">{step.title}</h2>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <StoreButtons stores={site.stores} />
        </div>
      </section>
    </>
  );
}
