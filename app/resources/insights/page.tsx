import type { Metadata } from "next";
import { Unpublished } from "@/components/unpublished";

// TODO [CONFIRM] industry insights. None are published.

export const metadata: Metadata = {
  title: "Industry insights",
  description: "Quad Tech Solutions has not published industry insights.",
  robots: { index: false, follow: true },
};

export default function InsightsPage() {
  return <Unpublished title="Industry insights" description="No insights are published." />;
}
