import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { getIndustry, industries } from "@/lib/industries";
import { getService } from "@/lib/services";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry" };
  return {
    title: industry.name,
    description: industry.summary,
  };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  const tags = industry.serviceSlugs
    .map((serviceSlug) => getService(serviceSlug))
    .filter((service) => service !== undefined);

  return (
    <>
      <PageHero eyebrow="Industries" title={industry.name}>
        <p>{industry.summary}</p>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/industries" className="hover:text-accent">
                Industries
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{industry.name}</li>
          </ol>
        </nav>
        <div className="space-y-4 text-muted-foreground">
          {industry.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {/*
          TODO [CONFIRM] Case study slot.
          When a confirmed example exists, add site type, scope, and year here.
          Do not publish client names.
        */}
        <h2 className="mt-10 text-lg font-semibold text-foreground">Related services</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                className="inline-flex rounded-full border border-border px-3 py-1 text-sm hover:border-accent hover:text-accent"
              >
                {service.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 px-4">
            <Link href="/contact">Work with us</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-4">
            <Link href={`/careers?industry=${industry.slug}`}>Join projects in this space</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
