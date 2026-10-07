import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-muted-foreground">That address is not on this site.</p>
      <Button asChild className="mt-8 h-11 px-4">
        <Link href="/">Back to home</Link>
      </Button>
    </article>
  );
}
