import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Instrument_Sans } from 'next/font/google';
import { SiteFooter, SiteHeader } from '@/components/layout/Chrome';
import { getSiteConfig } from '@/lib/content';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import './globals.css';

/** The interface face, at 400 and 500 (600 only for the wordmark). */
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
/** Figures, dates, counts and the day line. */
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

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
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#161513' },
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
    <html lang="en-IN" className={`${instrument.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="btn btn-secondary fixed top-3 left-3 z-[60] -translate-y-20 focus:translate-y-0"
        >
          {site.labels.skipToContent}
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
