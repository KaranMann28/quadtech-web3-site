"use client";

import { usePathname } from "next/navigation";
import { AIChatbot } from "@/components/ai-chatbot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 pt-16">
        {children}
      </main>
      <SiteFooter />
      <AIChatbot />
    </>
  );
}
