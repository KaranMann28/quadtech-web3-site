import Link from "next/link";
import { QuoteCta } from "@/components/quote-cta";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyerService } from "@/content/buyer-services";

export function BuyerServiceCard({ service }: { service: BuyerService }) {
  return (
    <Card className="h-full text-base">
      <CardContent className="grid h-full gap-3">
        <h3 className="text-xl font-semibold">
          {service.links[0] ? (
            <Link href={service.links[0].href} className="hover:text-accent">
              {service.name}
            </Link>
          ) : (
            service.name
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{service.summary}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Who it is for. </span>
          {service.audience}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">What we deliver. </span>
          {service.deliverables}
        </p>
        {service.links.length > 0 ? (
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {service.links.map((link) => (
              <Link key={link.href} href={link.href} className="text-accent">
                {link.label}
              </Link>
            ))}
          </p>
        ) : null}
        <div className="mt-auto pt-2">
          <QuoteCta topic={service.topic} />
        </div>
      </CardContent>
    </Card>
  );
}
