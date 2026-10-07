import Link from "next/link";

export function Unpublished({ title, description }: { title: string; description: string }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">{description}</p>
      <p className="mt-6">
        <Link href="/" className="text-accent">
          Back to home
        </Link>
      </p>
    </article>
  );
}
