import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/content';

export default async function NotFound() {
  const site = await getSiteConfig();
  return (
    <section className="container-x grid min-h-[80dvh] place-items-center pt-28 pb-16">
      <div className="glass max-w-xl p-10 text-center sm:p-14">
        <p className="text-gradient-brand font-display text-7xl font-bold sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">{site.labels.notFoundTitle}</h1>
        <p className="mt-3 text-ink-2">{site.labels.notFoundBody}</p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {site.labels.backHome}
        </Link>
      </div>
    </section>
  );
}
