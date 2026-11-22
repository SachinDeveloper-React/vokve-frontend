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
    <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
      {links.map(link => {
        const active = isActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-[var(--well)] text-ink shadow-[inset_0_0_0_1px_var(--well-stroke)]'
                : 'text-ink-2 hover:bg-[var(--well)] hover:text-ink',
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
 * Below `md`: a button that drops a glass sheet under the ornament. The sheet
 * is portalled to <body> because the ornament's own backdrop-filter would
 * otherwise be the only thing the sheet could blur — leaving it see-through.
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
        className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-[var(--well)] md:hidden"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              className="glass fixed inset-x-3 top-[4.75rem] z-50 p-3 md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3.5 text-lg font-semibold text-ink transition hover:bg-[var(--well)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">
                {cta.label}
              </Link>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
