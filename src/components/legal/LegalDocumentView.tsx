import { CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LegalToc } from '@/components/client/LegalToc';
import { PageHero, QuestionsCard } from '@/components/ui/blocks';
import { RichText } from '@/components/ui/RichText';
import { getLegalDocument, getSiteConfig } from '@/lib/content';
import type { LegalBlock } from '@/lib/content/schemas';
import { cx, formatDate, pad2 } from '@/lib/format';

/** Metadata for a policy page, from the document itself. */
export async function legalMetadata(slug: string, path: string): Promise<Metadata> {
  const doc = await getLegalDocument(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary, alternates: { canonical: path } };
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case 'list': {
      const ordered = block.style === 'number';
      const List = ordered ? 'ol' : 'ul';
      return (
        <List className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              {ordered ? (
                <span className="well mt-0.5 grid grid-cols-1 size-6 shrink-0 place-items-center rounded-full text-xs font-bold text-ink">
                  {i + 1}
                </span>
              ) : (
                <span className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--brand-2),var(--brand))]" />
              )}
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </List>
      );
    }
    case 'callout': {
      const Glyph = block.tone === 'warning' ? TriangleAlert : block.tone === 'success' ? CircleCheck : Info;
      const tone = block.tone === 'warning' ? 'gold' : block.tone === 'success' ? 'green' : 'blue';
      return (
        <div className="well flex gap-4 p-5" data-tone={tone}>
          <span className="icon-orb [--size:2.25rem]">
            <Glyph className="size-4" aria-hidden="true" />
          </span>
          <div>
            {block.title ? <p className="font-semibold text-ink">{block.title}</p> : null}
            <p className={cx(block.title && 'mt-1')}>
              <RichText text={block.text} />
            </p>
          </div>
        </div>
      );
    }
    case 'table':
      return (
        <div className="well overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr>
                {block.columns.map(column => (
                  <th key={column} scope="col" className="border-b border-hairline px-4 py-3 text-sm font-semibold text-ink">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="[&:not(:last-child)>td]:border-b [&>td]:border-hairline">
                  {row.map((cell, c) => (
                    <td key={c} className={cx('px-4 py-3 align-top leading-relaxed', c === 0 && 'font-medium text-ink')}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'definitions':
      return (
        <dl className="grid grid-cols-1 gap-3">
          {block.items.map(item => (
            <div key={item.term} className="well grid grid-cols-1 gap-1 p-4 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <dt className="font-semibold text-ink">{item.term}</dt>
              <dd>
                <RichText text={item.description} />
              </dd>
            </div>
          ))}
        </dl>
      );
  }
}

/** A policy, laid out as a document window with a floating table of contents. */
export async function LegalDocumentView({ slug }: { slug: string }) {
  const [doc, site] = await Promise.all([getLegalDocument(slug), getSiteConfig()]);
  if (!doc) notFound();
  const { labels } = site;
  const toc = doc.sections.map(section => ({ id: section.id, title: section.title }));

  return (
    <>
      <PageHero eyebrow={doc.eyebrow} title={doc.title} subtitle={doc.summary}>
        <span className="chip">
          {labels.lastUpdated} {formatDate(doc.updatedAt)}
        </span>
        <span className="chip">
          {labels.effectiveFrom} {formatDate(doc.effectiveAt)}
        </span>
        <span className="chip">
          {labels.version} {doc.version}
        </span>
      </PageHero>

      <div className="container-x grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
        <aside className="no-print hidden lg:block">
          <div className="glass sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto p-3">
            <LegalToc sections={toc} label={labels.onThisPage} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <details className="disclosure glass no-print lg:hidden">
            <summary className="flex items-center justify-between px-5 py-4 font-semibold text-ink">
              {labels.onThisPage}
              <span className="chip">{doc.sections.length}</span>
            </summary>
            <ol className="space-y-1 px-3 pb-4">
              {toc.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex gap-2.5 rounded-xl px-2 py-1.5 text-sm text-ink-2 hover:text-ink">
                    <span className="font-mono text-xs leading-5 text-ink-3">{pad2(i + 1)}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          {doc.highlights.length > 0 ? (
            <section className="glass relative overflow-hidden p-6 sm:p-8" data-tone="green">
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 -z-10 size-64 rounded-full bg-[var(--tone)] opacity-15 blur-3xl" />
              <h2 className="font-display text-xl font-semibold text-ink">{labels.shortVersion}</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {doc.highlights.map(item => (
                  <li key={item} className="well flex gap-3 p-4 text-[0.9375rem] leading-relaxed text-ink-2">
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-green" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <article className="glass prose-legal p-6 sm:p-10">
            {doc.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className={cx('scroll-mt-28', i > 0 && 'mt-10 border-t border-hairline pt-10')}
              >
                <h2 className="flex items-baseline gap-3 font-display text-2xl font-semibold text-ink">
                  <span className="font-mono text-sm font-medium text-ink-3">{pad2(i + 1)}</span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.blocks.map((block, b) => (
                    <Block key={b} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>

          <QuestionsCard site={site} />
        </div>
      </div>
    </>
  );
}
