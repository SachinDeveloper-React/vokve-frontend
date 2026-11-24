import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/content';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteConfig();
  return {
    name: site.seo.defaultTitle,
    short_name: site.brand.name,
    description: site.seo.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f7f4ee',
    theme_color: '#e50000',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  };
}
