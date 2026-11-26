import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';
import { getLegalIndex } from '@/lib/content';

/**
 * Every document at its own address (RULES P22): the shipped policies —
 * /privacy, /terms, /rewards-policy, /refund-policy, /shipping-policy — and
 * any page created on the panel's Documents page since, with no deploy. The
 * site's own pages (/about, /faq…) are their own routes and answer first.
 */

/** A document address, as the backend allows them. Anything else is a 404 without asking it. */
const SLUG = /^[a-z0-9][a-z0-9-]{1,60}$/;

/** Addresses that are pages of their own, even though the legal hub links them. */
const OWN_ROUTES = new Set(['about', 'contact', 'delete-account', 'faq', 'legal', 'licenses']);

/**
 * The whole page is made before it is served, never a shell first: a
 * document is static text, and an address with nothing behind it must answer
 * a real 404 rather than a 200 page that says "not found".
 */
export const ensureStatic = 'navigation';

/**
 * The listed documents are built ahead; one added later is made on its first
 * visit and kept. The Privacy Policy is always among them — it is never
 * hidden (the backend refuses it), and the route needs at least one.
 */
export async function generateStaticParams() {
  const index = await getLegalIndex();
  const slugs = new Set(['privacy']);
  for (const doc of index.documents) {
    const slug = doc.href.replace(/^\//, '');
    if (SLUG.test(slug) && !OWN_ROUTES.has(slug)) slugs.add(slug);
  }
  return [...slugs].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUG.test(slug)) return {};
  return legalMetadata(slug, `/${slug}`);
}

export default async function DocumentPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  if (!SLUG.test(slug)) notFound();
  return <LegalDocumentView slug={slug} />;
}
