import type { MetadataRoute } from 'next';
import { getLegalIndex, getSiteConfig } from '@/lib/content';

/** Every public page; the legal ones carry their own last-updated dates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, legal] = await Promise.all([getSiteConfig(), getLegalIndex()]);
  const base = site.seo.siteUrl.replace(/\/+$/, '');

  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legal`, changeFrequency: 'monthly', priority: 0.4 },
  ];
  const seen = new Set(pages.map(page => page.url));
  for (const doc of legal.documents) {
    if (!doc.href.startsWith('/')) continue;
    const url = `${base}${doc.href}`;
    if (seen.has(url)) continue;
    seen.add(url);
    pages.push({ url, lastModified: doc.updatedAt, changeFrequency: 'monthly', priority: 0.5 });
  }
  return pages;
}
