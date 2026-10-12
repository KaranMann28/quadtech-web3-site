import type { Metadata } from "next";
import { Unpublished } from "@/components/unpublished";

// TODO [CONFIRM] case studies. Do not publish client names. None are published.

export const metadata: Metadata = {
  title: "Case studies",
  description: "Quad Tech Solutions has not published case studies.",
  robots: { index: false, follow: true },
};

export default function CaseStudiesPage() {
  return <Unpublished title="Case studies" description="No case studies are published." />;
}
