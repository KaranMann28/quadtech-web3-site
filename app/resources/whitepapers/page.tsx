import type { Metadata } from "next";
import { Unpublished } from "@/components/unpublished";

// TODO [CONFIRM] whitepapers. None are published.

export const metadata: Metadata = {
  title: "Whitepapers",
  description: "Quad Tech Solutions has not published whitepapers.",
  robots: { index: false, follow: true },
};

export default function WhitepapersPage() {
  return <Unpublished title="Whitepapers" description="No whitepapers are published." />;
}
