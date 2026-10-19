"use client";

import { Button } from "@/components/ui/button";

export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <Button type="button" className="h-11 px-4 print:hidden" onClick={() => window.print()}>
      {children}
    </Button>
  );
}
