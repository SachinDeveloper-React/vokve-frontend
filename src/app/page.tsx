import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Challenges,
  Download,
  FairPlay,
  FaqTeaser,
  Features,
  Hero,
  HowItWorks,
  PrivacyPromise,
  StatsStrip,
} from '@/components/home/sections';
import { getHomePage, getSiteConfig } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const [page, site] = await Promise.all([getHomePage(), getSiteConfig()]);

  // The hero is always first; below it, the sections the panel shows, in its order.
  const sections: Record<string, () => ReactNode> = {
    stats: () => <StatsStrip key="stats" stats={page.stats} trust={page.hero.trust} />,
    howItWorks: () => <HowItWorks key="howItWorks" section={page.howItWorks} />,
    features: () => <Features key="features" section={page.features} />,
    challenges: () => <Challenges key="challenges" section={page.challenges} />,
    fairPlay: () => <FairPlay key="fairPlay" section={page.fairPlay} />,
    privacy: () => <PrivacyPromise key="privacy" section={page.privacy} />,
    faq: () => <FaqTeaser key="faq" section={page.faq} />,
    download: () => <Download key="download" section={page.download} site={site} />,
  };
  const shown = [...new Set(page.sections)].filter(id => id in sections);

  return (
    <>
      <Hero hero={page.hero} announcement={site.announcement} />
      <div className="home-flow">{shown.map(id => sections[id]!())}</div>
    </>
  );
}
