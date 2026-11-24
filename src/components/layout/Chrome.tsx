import Link from 'next/link';
import { Suspense } from 'react';
import { ActiveNavLinks, MobileMenu, NavLinksView } from '@/components/client/Nav';
import { ThemeToggle } from '@/components/client/ThemeToggle';
import { LogoMark } from '@/components/ui/Logo';
import { SmartLink } from '@/components/ui/SmartLink';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { getSiteConfig } from '@/lib/content';

/** A plain bar: the mark, the links, the theme switch and one button. */
export async function SiteHeader() {
  const site = await getSiteConfig();
  return (
    <header className="no-print sticky top-0 z-50 border-b border-hairline bg-bg">
      <div className="container-x flex h-16 items-center gap-2">
        <Link href="/" className="mr-4 flex items-center gap-2.5 rounded-md" aria-label={`${site.brand.name} — home`}>
          <LogoMark className="size-7" />
          <span className="text-[1.0625rem] font-semibold tracking-[0.02em] text-ink">{site.brand.name}</span>
        </Link>
        <Suspense fallback={<NavLinksView links={site.nav} pathname={null} />}>
          <ActiveNavLinks links={site.nav} />
        </Suspense>
        <div className="ml-auto flex items-center gap-2">
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
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const site = await getSiteConfig();
  const { company, footer } = site;
  return (
    <footer className="no-print border-t border-hairline">
      <div className="container-x py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 rounded-md">
              <LogoMark className="size-8" />
              <span className="text-lg font-semibold tracking-[0.02em] text-ink">{site.brand.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">{footer.blurb}</p>
            <StoreButtons stores={site.stores} className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {footer.columns.map(column => (
              <div key={column.title}>
                <p className="text-sm font-medium text-ink">{column.title}</p>
                <ul className="mt-4 space-y-3">
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
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {site.social.map(item => (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 text-sm text-ink-3 md:flex-row md:items-start md:justify-between">
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
            <a href={`mailto:${company.email}`} className="block text-ink-2 transition-colors hover:text-ink">
              {company.email}
            </a>
          </address>
        </div>
      </div>
    </footer>
  );
}
