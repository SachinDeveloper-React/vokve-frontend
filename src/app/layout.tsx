import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { PointerLight } from '@/components/client/PointerLight';
import { Environment, SiteFooter, SiteHeader } from '@/components/layout/Chrome';
import { getSiteConfig } from '@/lib/content';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap', weight: ['500', '600', '700', '800'] });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(site.seo.siteUrl),
    title: { default: site.seo.defaultTitle, template: site.seo.titleTemplate },
    description: site.seo.description,
    keywords: site.seo.keywords,
    applicationName: site.brand.name,
    openGraph: {
      type: 'website',
      siteName: site.brand.name,
      title: site.seo.defaultTitle,
      description: site.seo.description,
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title: site.seo.defaultTitle, description: site.seo.description },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9ecf3' },
    { media: '(prefers-color-scheme: dark)', color: '#05060b' },
  ],
  colorScheme: 'light dark',
};

/** Applies a saved theme before the first paint, so there is no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const site = await getSiteConfig();
  return (
    <html lang="en-IN" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="glass-ornament fixed left-4 top-4 z-[60] -translate-y-24 px-5 py-3 font-semibold text-ink focus:translate-y-0"
        >
          {site.labels.skipToContent}
        </a>
        <Environment />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <PointerLight />
      </body>
    </html>
  );
}
