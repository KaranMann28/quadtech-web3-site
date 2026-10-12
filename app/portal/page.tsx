import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor portal",
  description: "A signed-in contractor area is not available yet.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-sm font-medium tracking-wider text-accent uppercase">Coming soon</p>
      <h1 className="mt-3 text-3xl font-bold">Contractor portal</h1>
      <p className="mt-4 text-muted-foreground">
        Onboarding documents, timesheets, and assignment status are not available yet. There is no
        sign-in on this site. The next phase still has to choose between Microsoft Entra ID and
        email magic links.
      </p>
      <p className="mt-4">
        <Link href="/careers" className="text-accent">
          Browse open roles
        </Link>
      </p>
    </article>
  );
}
