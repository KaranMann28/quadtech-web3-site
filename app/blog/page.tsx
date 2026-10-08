import type { Metadata } from "next";
import { Unpublished } from "@/components/unpublished";

// TODO [CONFIRM] whether a blog should stay on the site. No posts exist.

export const metadata: Metadata = {
  title: "Blog",
  description: "Quad Tech Solutions has not published blog posts.",
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <Unpublished
      title="Blog"
      description="No posts are published."
    />
  );
}
