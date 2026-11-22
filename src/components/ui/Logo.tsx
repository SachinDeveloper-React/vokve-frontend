import { useId } from 'react';
import { cx } from '@/lib/format';

/**
 * The app icon's V (from assets/app-icons, the RedField icon) on a lit tile,
 * so the site's mark is the one members see on their home screen.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 1024 1024" className={cx('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2a1a" />
          <stop offset="1" stopColor="#c80000" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="232" fill={`url(#${id}-fill)`} />
      <rect width="1024" height="1024" rx="232" fill={`url(#${id}-sheen)`} />
      <polygon points="235,239 398,239 448,614 636,239 809,239 540,785 306,785" fill="#fff" />
    </svg>
  );
}

/** A gold coin, drawn rather than an emoji so it matches across platforms. */
export function CoinMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={cx('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe28a" />
          <stop offset="0.55" stopColor="#f5b301" />
          <stop offset="1" stopColor="#c98200" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${id}-c)`} />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
      <polygon points="11,10 13.6,10 15.2,18.2 18.4,10 21,10 16.6,22 14.2,22" fill="#fff" fillOpacity="0.92" />
    </svg>
  );
}
