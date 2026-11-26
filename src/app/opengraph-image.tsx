import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getSiteConfig } from '@/lib/content';

export const alt = 'VOKVE — Walk. Earn. Redeem.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** The card shared links show: the flat app icon, the name and the tagline on the site's paper. */
export default async function OpengraphImage() {
  const site = await getSiteConfig();
  // The app icon the header shows, read from disk as Next's own examples do.
  const icon = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/icon-192.png'))).toString('base64')}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 88,
          background: '#f7f4ee',
          color: '#1f1b16',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src={icon} width={88} height={88} alt="" />
          <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: 1 }}>{site.brand.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 500, letterSpacing: -2, lineHeight: 1.05 }}>{site.brand.tagline}</div>
          <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.4, color: '#5e554a', maxWidth: 920 }}>
            {site.brand.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
