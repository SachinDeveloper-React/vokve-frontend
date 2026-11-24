'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ContentLink } from '@/lib/content/schemas';
import { cx } from '@/lib/format';

const isActive = (href: string, pathname: string | null) =>
  pathname !== null && !href.includes('#') && (href === '/' ? pathname === '/' : pathname.startsWith(href));

/** The desktop links. Rendered without a pathname as the Suspense fallback. */
export function NavLinksView({ links, pathname }: { links: ContentLink[]; pathname: string | null }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
      {links.map(link => {
        const active = isActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'rounded-lg px-3 py-2 text-sm transition-colors',
              active ? 'bg-raised text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ActiveNavLinks({ links }: { links: ContentLink[] }) {
  return <NavLinksView links={links} pathname={usePathname()} />;
}

/**
 * Below `md`: a button that opens a sheet under the header. The sheet is
 * portalled to <body> so it stacks above the page, not inside the bar.
 */
export function MobileMenu({
  links,
  cta,
  labels,
}: {
  links: ContentLink[];
  cta: ContentLink;
  labels: { menu: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.menu}
        onClick={() => setOpen(value => !value)}
        className="grid size-9 place-items-center rounded-lg text-ink transition-colors hover:bg-raised md:hidden"
      >
        {open ? <X className="size-4.5" aria-hidden="true" /> : <Menu className="size-4.5" aria-hidden="true" />}
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              className="fixed inset-x-0 top-16 z-50 border-b border-hairline bg-bg px-4 pt-2 pb-6 shadow-float md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center rounded-lg px-3 text-base font-medium text-ink transition-colors hover:bg-raised"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary btn-lg mt-4 w-full">
                {cta.label}
              </Link>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
