import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Posts" },
  { href: "/admin/applications", label: "Applications" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" aria-label="Quad admin home">
            <Logo />
          </Link>
          <nav aria-label="Admin" className="flex flex-wrap gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </Link>
            ))}
            <Link href="/careers" className="hover:text-accent">
              View careers
            </Link>
          </nav>
          <form
            className="sm:ml-auto"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/signin" });
            }}
          >
            <button type="submit" className="text-sm hover:text-accent">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
