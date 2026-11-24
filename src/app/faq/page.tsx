import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { FaqExplorer } from '@/components/client/FaqExplorer';
import { PageHero } from '@/components/ui/blocks';
import { Icon } from '@/components/ui/Icon';
import { RichText } from '@/components/ui/RichText';
import { SmartLink } from '@/components/ui/SmartLink';
import { getFaqPage, getSiteConfig } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFaqPage();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: '/faq' } };
}

export default async function FaqPage() {
  const [page, site] = await Promise.all([getFaqPage(), getSiteConfig()]);
  const categories = page.categories.map(category => ({
    id: category.id,
    title: category.title,
    icon: <Icon name={category.icon} />,
  }));
  const answers = Object.fromEntries(page.items.map(item => [item.id, <RichText key={item.id} text={item.answer} />]));

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle} />
      <section className="container-x pb-12">
        <div className="max-w-4xl">
        <FaqExplorer
          categories={categories}
          items={page.items}
          answers={answers}
          labels={{
            searchPlaceholder: site.labels.searchPlaceholder,
            allCategories: site.labels.allCategories,
            noResults: site.labels.noResults,
          }}
        />
        </div>
      </section>
      <section className="container-x pb-16">
        <div className="card flex max-w-4xl flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:p-9">
          <div className="flex-1">
            <h2 className="text-2xl text-ink">{page.contact.title}</h2>
            <p className="mt-1 text-ink-2">{page.contact.body}</p>
          </div>
          <SmartLink href={page.contact.link.href} className="btn btn-primary">
            {page.contact.link.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </SmartLink>
        </div>
      </section>
    </>
  );
}
