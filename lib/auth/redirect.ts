const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

function preferredOrigin(baseUrl: string): URL {
  // Production sets AUTH_URL. Preview leaves it unset so Auth.js trustHost
  // and this helper follow the request host.
  const configured = process.env.AUTH_URL?.trim();
  if (!configured) return new URL(baseUrl);
  return new URL(configured);
}

function loopbackPair(left: URL, right: URL): boolean {
  return LOOPBACK.has(left.hostname) && LOOPBACK.has(right.hostname) && left.port === right.port;
}

/**
 * Auth.js compares the callback URL to the server bind address. `next start`
 * on 0.0.0.0 reports that address, while the browser uses 127.0.0.1 or localhost.
 * Treat those loopback hosts as one site and send the browser back to AUTH_URL.
 */
export function safeAuthRedirect(url: string, baseUrl: string): string {
  const preferred = preferredOrigin(baseUrl);
  const base = new URL(baseUrl);
  let target: URL;
  try {
    target = url.startsWith("/") ? new URL(url, preferred) : new URL(url);
  } catch {
    return preferred.origin;
  }
  const allowed =
    target.origin === base.origin || target.origin === preferred.origin || loopbackPair(target, preferred);
  if (!allowed) return preferred.origin;
  return new URL(`${target.pathname}${target.search}${target.hash}`, preferred.origin).toString();
}
