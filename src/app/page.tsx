import type { Metadata } from 'next';
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
  return (
    <>
      <Hero hero={page.hero} announcement={site.announcement} />
      <StatsStrip stats={page.stats} trust={page.hero.trust} />
      <HowItWorks section={page.howItWorks} />
      <Features section={page.features} />
      <Challenges section={page.challenges} />
      <FairPlay section={page.fairPlay} />
      <PrivacyPromise section={page.privacy} />
      <FaqTeaser section={page.faq} />
      <Download section={page.download} site={site} />
    </>
  );
}
