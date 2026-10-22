import Link from "next/link";
import { Button } from "@/components/ui/button";
import { quoteHref, type QuoteTopic } from "@/lib/quote-topics";

export function QuoteCta({
  topic,
  variant = "default",
}: {
  topic: QuoteTopic;
  variant?: "default" | "outline";
}) {
  return (
    <Button asChild variant={variant} className="h-11 px-4">
      <Link href={quoteHref(topic)}>Request a quote</Link>
    </Button>
  );
}
