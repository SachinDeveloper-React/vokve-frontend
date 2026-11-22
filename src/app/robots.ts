import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();
  const base = site.seo.siteUrl.replace(/\/+$/, '');
  return {
    // Invite links are personal; the API is not a page.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/r/'] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
