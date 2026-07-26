import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryHero } from "@/components/category/CategoryHero";
import { ValueProps } from "@/components/category/ValueProps";
import { CoverageGrid } from "@/components/category/CoverageGrid";
import { StoriesMarquee } from "@/components/category/StoriesMarquee";
import { PlansPricing } from "@/components/category/PlansPricing";
import { CategoryFAQ } from "@/components/category/CategoryFAQ";
import { CategoryCTA } from "@/components/category/CategoryCTA";
import { getCategory, getAllCategorySlugs } from "@/lib/category-data";

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <SiteHeader showLogin />
      <main className="flex-1">
        <CategoryHero category={category} />
        <ValueProps items={category.valueProps} />
        <CoverageGrid items={category.coverage} label={category.label} />
        <StoriesMarquee stories={category.stories} />
        <PlansPricing plans={category.plans} heroPrompt={category.heroPrompt} />
        <CategoryFAQ faqs={category.faqs} />
        <CategoryCTA label={category.label} prompt={category.heroPrompt} />
      </main>
    </>
  );
}
