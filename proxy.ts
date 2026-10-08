import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAllowlistedUpn } from "@/lib/auth/allowlist";
import { resolvePublicSlug } from "@/lib/jobs/store";

const PUBLIC_ADMIN = new Set(["/admin/signin", "/admin/not-authorized"]);

/**
 * Auth.js names the session cookie `__Secure-authjs.session-token` whenever its
 * base URL is https (AUTH_URL in production, the request URL on preview), and
 * `authjs.session-token` on plain http. `getToken()` does not work this out on
 * its own: it defaults to the http name, so on https it never finds the cookie.
 * Mirror Auth.js here so the proxy and `auth()` read the same cookie.
 */
function wantsSecureCookie(request: NextRequest): boolean {
  const base = process.env.AUTH_URL?.trim() || request.url;
  return base.startsWith("https://");
}

function gone() {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Role closed · Quad Tech Solutions</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; font-family: sans-serif; background: #0a0a0f; color: #fff; }
    main { max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; }
    a { color: #00d4ff; }
  </style>
</head>
<body>
  <main>
    <h1>This role is no longer available</h1>
    <p>The posting has been closed for more than 30 days.</p>
    <p><a href="/careers">Back to open roles</a></p>
  </main>
</body>
</html>`;
  return new NextResponse(html, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/careers/")) {
    const slug = pathname.split("/")[2] ?? "";
    if (slug && slug !== "talent-network" && slug !== "thanks") {
      try {
        const hit = await resolvePublicSlug(decodeURIComponent(slug));
        if (hit.kind === "gone") return gone();
        if (hit.kind === "redirect") {
          return NextResponse.redirect(new URL(`/careers/${hit.slug}`, request.url), 301);
        }
      } catch (error) {
        console.error("Career slug check failed.", error);
      }
    }
  }

  const adminPage = pathname.startsWith("/admin");
  const adminApi = pathname.startsWith("/api/admin");
  if (!adminPage && !adminApi) return NextResponse.next();
  if (PUBLIC_ADMIN.has(pathname)) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: wantsSecureCookie(request),
  });
  const email = typeof token?.email === "string" ? token.email : "";
  if (!email || !isAllowlistedUpn(email)) {
    if (adminApi) {
      return NextResponse.json(
        { ok: false, message: email ? "Not an admin." : "Sign in required." },
        { status: email ? 403 : 401 },
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = email ? "/admin/not-authorized" : "/admin/signin";
    url.search = email ? "" : `?callbackUrl=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/careers/:slug"],
};
