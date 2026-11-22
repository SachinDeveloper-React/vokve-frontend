import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { isInternalHref, isSafeHref } from '@/lib/format';

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string; children: ReactNode };

/**
 * One link component for every href the backend can send: internal paths go
 * through `next/link`, the web opens in a new tab, mailto:/tel: stay as they
 * are, and anything else is rendered as plain text.
 */
export function SmartLink({ href, children, ...rest }: Props) {
  if (!isSafeHref(href)) return <span className={rest.className}>{children}</span>;
  if (isInternalHref(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}
