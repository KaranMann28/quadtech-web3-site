import type { Metadata } from "next";
import { Unpublished } from "@/components/unpublished";

// TODO [CONFIRM] service brochure file. None is published.

export const metadata: Metadata = {
  title: "Service brochure",
  description: "Quad Tech Solutions has not published a service brochure.",
  robots: { index: false, follow: true },
};

export default function BrochurePage() {
  return <Unpublished title="Service brochure" description="No brochure is published." />;
}
