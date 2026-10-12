import { DeliveryError } from "@/lib/apply/deliver";

/**
 * Microsoft Graph sendMail with an app-only (client credentials) token.
 * The Entra app is limited to one mailbox by Exchange Online RBAC for Applications
 * (role "Application Mail.Send" scoped to GRAPH_MAIL_SENDER). See docs/graph-mail-setup.md.
 */

export type GraphMailConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  sender: string;
};

export type GraphMail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: { address: string; name?: string };
};

type FetchLike = typeof fetch;

const TOKEN_SKEW_MS = 5 * 60 * 1000;
const MAX_RETRY_AFTER_MS = 3000;

let cachedToken: { key: string; value: string; expiresAt: number } | null = null;

export function graphMailConfig(): GraphMailConfig | null {
  const tenantId =
    process.env.GRAPH_MAIL_TENANT_ID?.trim() || process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.trim() || "";
  const clientId = process.env.GRAPH_MAIL_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GRAPH_MAIL_CLIENT_SECRET?.trim() ?? "";
  const sender = process.env.GRAPH_MAIL_SENDER?.trim() ?? "";
  if (!tenantId || !clientId || !clientSecret || !sender.includes("@")) return null;
  return { tenantId, clientId, clientSecret, sender };
}

export function isGraphMailConfigured(): boolean {
  return graphMailConfig() !== null;
}

/** Test hook. */
export function resetGraphTokenCache(): void {
  cachedToken = null;
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function getToken(cfg: GraphMailConfig, fetchImpl: FetchLike): Promise<string> {
  const key = `${cfg.tenantId}:${cfg.clientId}`;
  if (cachedToken && cachedToken.key === key && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }
  const response = await fetchImpl(
    `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        scope: "https://graph.microsoft.com/.default",
      }),
    },
  );
  const body = await readJson(response);
  const token = typeof body.access_token === "string" ? body.access_token : "";
  if (!response.ok || !token) {
    // Never log the secret or the response body as-is. error + AADSTS codes only.
    const error = typeof body.error === "string" ? body.error : "unknown";
    const codes = Array.isArray(body.error_codes) ? body.error_codes.join(",") : "none";
    const correlation = typeof body.correlation_id === "string" ? body.correlation_id : "none";
    console.error(
      `Graph mail token request failed: status=${response.status} error=${error} aadsts=${codes} correlation=${correlation}`,
    );
    throw new DeliveryError("Graph token request failed.", "send-failed");
  }
  const expiresIn = Number(body.expires_in) || 3600;
  cachedToken = { key, value: token, expiresAt: Date.now() + expiresIn * 1000 - TOKEN_SKEW_MS };
  return token;
}

function retryAfterMs(response: Response): number {
  const raw = Number(response.headers.get("retry-after"));
  return Number.isFinite(raw) && raw > 0 ? raw * 1000 : 1000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendGraphMail(
  mail: GraphMail,
  options: { config?: GraphMailConfig | null; fetchImpl?: FetchLike } = {},
): Promise<void> {
  const cfg = options.config === undefined ? graphMailConfig() : options.config;
  const fetchImpl = options.fetchImpl ?? fetch;
  if (!cfg || !mail.to) {
    throw new DeliveryError("Graph mail is not configured.", "not-configured");
  }
  const payload = JSON.stringify({
    message: {
      subject: mail.subject,
      body: mail.html ? { contentType: "HTML", content: mail.html } : { contentType: "Text", content: mail.text },
      toRecipients: [{ emailAddress: { address: mail.to } }],
      ...(mail.replyTo ? { replyTo: [{ emailAddress: mail.replyTo }] } : {}),
    },
    saveToSentItems: true,
  });
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.sender)}/sendMail`;

  // One retry: after a 401 with a fresh token, or after a short throttle (429/503/504).
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const token = await getToken(cfg, fetchImpl);
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: payload,
    });
    if (response.status === 202 || response.ok) return;

    const body = await readJson(response);
    const error = (body.error ?? {}) as { code?: unknown };
    const code = typeof error.code === "string" ? error.code : "unknown";
    const requestId = response.headers.get("request-id") ?? response.headers.get("client-request-id") ?? "none";
    console.error(
      `Graph sendMail failed: status=${response.status} code=${code} request-id=${requestId} attempt=${attempt}`,
    );

    if (attempt === 1 && response.status === 401) {
      resetGraphTokenCache();
      continue;
    }
    if (attempt === 1 && [429, 503, 504].includes(response.status)) {
      const wait = retryAfterMs(response);
      if (wait <= MAX_RETRY_AFTER_MS) {
        await sleep(wait);
        continue;
      }
    }
    throw new DeliveryError(`Graph sendMail failed (${response.status} ${code}).`, "send-failed");
  }
  throw new DeliveryError("Graph sendMail failed after retry.", "send-failed");
}
