'use client';

import { useEffect } from 'react';

/**
 * The one screen that cannot ask the backend for its words — it shows when
 * something (often the content API) has failed — so its copy lives here.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x grid min-h-[80dvh] place-items-center pt-28 pb-16">
      <div className="glass max-w-xl p-10 text-center sm:p-14">
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Something went wrong</h1>
        <p className="mt-3 text-ink-2">This page could not load. Please try again in a moment.</p>
        <button type="button" onClick={() => retry()} className="btn btn-primary mt-8">
          Try again
        </button>
      </div>
    </section>
  );
}
