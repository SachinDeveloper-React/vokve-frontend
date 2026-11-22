import Link from 'next/link';
import { Suspense } from 'react';
import { ActiveNavLinks, MobileMenu, NavLinksView } from '@/components/client/Nav';
import { ThemeToggle } from '@/components/client/ThemeToggle';
import { LogoMark } from '@/components/ui/Logo';
import { SmartLink } from '@/components/ui/SmartLink';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { getSiteConfig } from '@/lib/content';

/** The room the page floats in: three slow lights, a fading grid and a little grain. */
export function Environment() {
  return (
    <div className="environment" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="orb orb-d" />
      <div className="environment-grid" />
      <div className="environment-noise" />
    </div>
  );
}

/** The navigation ornament, floating above every page. */
export async function SiteHeader() {
  const site = await getSiteConfig();
  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <div className="glass-ornament mx-auto flex h-14 max-w-6xl items-center gap-1 pl-2.5 pr-2">
        <Link href="/" className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1" aria-label={`${site.brand.name} — home`}>
          <LogoMark className="size-8 drop-shadow-[0_6px_12px_rgb(229_0_0/0.35)]" />
          <span className="font-display text-lg font-bold tracking-tight text-ink">{site.brand.name}</span>
        </Link>
        <div className="flex flex-1 justify-center">
          <Suspense fallback={<NavLinksView links={site.nav} pathname={null} />}>
            <ActiveNavLinks links={site.nav} />
          </Suspense>
        </div>
        <ThemeToggle label={site.labels.themeToggle} />
        <SmartLink href={site.headerCta.href} className="btn btn-primary btn-sm hidden sm:inline-flex">
          {site.headerCta.label}
        </SmartLink>
        <MobileMenu
          links={site.nav}
          cta={site.headerCta}
          labels={{ menu: site.labels.menu, close: site.labels.close }}
        />
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const site = await getSiteConfig();
  const { company, footer } = site;
  return (
    <footer className="no-print relative px-3 pb-6 pt-10">
      <div className="glass mx-auto max-w-6xl p-6 sm:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <LogoMark className="size-10" />
              <span className="font-display text-2xl font-bold tracking-tight text-ink">{site.brand.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-ink-2">{footer.blurb}</p>
            <StoreButtons stores={site.stores} className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footer.columns.map(column => (
              <div key={column.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map(link => (
                    <li key={link.href}>
                      <SmartLink href={link.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {site.social.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {site.social.map(item => (
              <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-sm">
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 text-sm text-ink-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p>{footer.copyright}</p>
            {footer.disclaimer ? <p className="max-w-xl">{footer.disclaimer}</p> : null}
          </div>
          <address className="not-italic md:text-right">
            {company.address.map(line => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href={`mailto:${company.email}`} className="block text-ink-2 hover:text-ink">
              {company.email}
            </a>
          </address>
        </div>
      </div>
    </footer>
  );
}
