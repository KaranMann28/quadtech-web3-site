import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Application received",
  description: "Quad Tech Solutions received your application.",
  robots: { index: false, follow: false },
};

export default async function ThanksPage({ searchParams }: PageProps<"/careers/thanks">) {
  const params = await searchParams;
  const raw = typeof params.for === "string" ? params.for : "";
  const label = raw.replace(/[<>]/g, "").slice(0, 140);

  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold">Application received</h1>
      <p className="mt-4 text-muted-foreground">
        {label
          ? `Quad Tech Solutions has your application for ${label}.`
          : "Quad Tech Solutions has your application."}{" "}
        If a hiring manager wants to continue, they will use the email address you submitted.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 px-4">
          <Link href="/careers">Back to roles</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-4">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </article>
  );
}
