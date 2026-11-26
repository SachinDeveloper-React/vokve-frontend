import Image from 'next/image';
import { useId } from 'react';
import { cx } from '@/lib/format';

/**
 * The app icon — the arrow and the walker — exactly as a phone shows it: the
 * PNGs the app's `npm run icons:app` writes into `public/` from the default
 * launcher icon, corners already rounded. `large` for anything drawn bigger
 * than about 90 px, so a sharp screen gets enough pixels.
 */
export function LogoMark({ className, large = false }: { className?: string; large?: boolean }) {
  const size = large ? 512 : 192;
  return (
    <Image
      src={`/icon-${size}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      unoptimized
      // The header's is on screen at once; the big one sits far down the page.
      loading={large ? 'lazy' : 'eager'}
      draggable={false}
      className={cx('shrink-0', className)}
    />
  );
}

/** The V's points, so the coin can strike the same mark into its face. */
const V_POINTS = '235,239 398,239 448,614 636,239 809,239 540,785 306,785';

/**
 * A VOKVE coin: a brass disc with a reeded rim and the V struck into its
 * face. It is the one object on the site, so it is drawn as a thing with
 * weight and light rather than as a flat icon.
 */
export function CoinMark({ className }: { className?: string }) {
  const id = useId();
  const rim = `${id}-rim`;
  const bevel = `${id}-bevel`;
  const face = `${id}-face`;
  const strike = `${id}-strike`;
  // Fit the 574 × 546 V into the coin's face, centred on (60, 61).
  const fit = 'translate(19.97 21.73) scale(0.0767)';
  return (
    <svg viewBox="0 0 120 120" className={cx('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={rim} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#f7dc86" />
          <stop offset="0.45" stopColor="#d39a2a" />
          <stop offset="1" stopColor="#8a5a0c" />
        </linearGradient>
        <linearGradient id={bevel} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0" stopColor="#9c6610" />
          <stop offset="1" stopColor="#f0cf72" />
        </linearGradient>
        <radialGradient id={face} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#f6d77a" />
          <stop offset="0.55" stopColor="#dca536" />
          <stop offset="1" stopColor="#b47813" />
        </radialGradient>
        <linearGradient id={strike} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#edc35a" />
          <stop offset="1" stopColor="#c08419" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#${rim})`} />
      <circle cx="60" cy="60" r="55" fill="none" stroke="#a8730f" strokeOpacity="0.55" strokeWidth="2.4" strokeDasharray="1.1 1.9" />
      <circle cx="60" cy="60" r="49" fill={`url(#${bevel})`} />
      <circle cx="60" cy="60" r="46" fill={`url(#${face})`} />
      <g transform={fit}>
        <polygon points={V_POINTS} fill="#7a4d08" fillOpacity="0.55" transform="translate(16 18)" />
        <polygon points={V_POINTS} fill="#fff6d2" fillOpacity="0.75" transform="translate(-12 -12)" />
        <polygon points={V_POINTS} fill={`url(#${strike})`} />
      </g>
      <ellipse cx="44" cy="30" rx="20" ry="9" fill="#fff" fillOpacity="0.22" transform="rotate(-28 44 30)" />
    </svg>
  );
}
