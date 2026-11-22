import { ImageResponse } from 'next/og';
import { getSiteConfig } from '@/lib/content';

export const alt = 'VOKVE — Walk. Earn. Redeem.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** The card shared links show: the V tile floating in the site's lit room. */
export default async function OpengraphImage() {
  const site = await getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: 80,
          background:
            'radial-gradient(circle at 15% 10%, rgba(255,64,5,0.45), transparent 45%), radial-gradient(circle at 90% 30%, rgba(229,0,0,0.4), transparent 45%), radial-gradient(circle at 50% 120%, rgba(99,102,241,0.4), transparent 50%), #05060b',
          color: '#f4f6fb',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 64,
            width: '100%',
            height: '100%',
            borderRadius: 48,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <svg width="120" height="120" viewBox="0 0 1024 1024">
              <rect width="1024" height="1024" rx="232" fill="#e50000" />
              <polygon points="235,239 398,239 448,614 636,239 809,239 540,785 306,785" fill="#fff" />
            </svg>
            <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3 }}>{site.brand.name}</div>
          </div>
          <div style={{ marginTop: 40, fontSize: 64, fontWeight: 700, letterSpacing: -2, color: '#ff6a2b' }}>
            {site.brand.tagline}
          </div>
          <div style={{ marginTop: 20, fontSize: 30, lineHeight: 1.4, color: 'rgba(226,232,255,0.78)', maxWidth: 900 }}>
            {site.brand.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
