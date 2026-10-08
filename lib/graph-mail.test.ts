import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { handleContact } from "@/lib/apply/contact";
import { resetGraphTokenCache } from "@/lib/mail/graph";

const SECRET = "s3cr3t-value-must-never-be-logged";
const TENANT = "cd0377ea-7ff9-4c69-a5a2-b9184343811e";
const TOKEN_URL = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
const SEND_URL = "https://graph.microsoft.com/v1.0/users/info%40quadtechsolutions.com/sendMail";

const ENV_KEYS = [
  "GRAPH_MAIL_TENANT_ID",
  "GRAPH_MAIL_CLIENT_ID",
  "GRAPH_MAIL_CLIENT_SECRET",
  "GRAPH_MAIL_SENDER",
  "CONTACT_TO_EMAIL",
  "CONTACT_EMAIL",
  "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID",
  "RESEND_API_KEY",
  "APPLY_SMTP_HOST",
  "APPLY_TO_EMAIL",
] as const;

type Call = { url: string; init?: RequestInit };
type Reply = { status: number; body?: unknown; headers?: Record<string, string> };

let saved: Record<string, string | undefined> = {};
let calls: Call[] = [];
let logs: string[] = [];
const originalFetch = globalThis.fetch;
const originalError = console.error;

function json(reply: Reply): Response {
  return new Response(reply.body === undefined ? null : JSON.stringify(reply.body), {
    status: reply.status,
    headers: { "content-type": "application/json", ...(reply.headers ?? {}) },
  });
}

/** Mock Entra token endpoint + Graph sendMail. Each list is consumed in order; the last entry repeats. */
function mockGraph(tokenReplies: Reply[], sendReplies: Reply[]) {
  let t = 0;
  let s = 0;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push({ url, init });
    if (url === TOKEN_URL) return json(tokenReplies[Math.min(t++, tokenReplies.length - 1)]);
    if (url === SEND_URL) return json(sendReplies[Math.min(s++, sendReplies.length - 1)]);
    throw new Error(`Unexpected fetch to ${url}`);
  }) as typeof fetch;
}

const okToken: Reply = { status: 200, body: { access_token: "tok-1", expires_in: 3599, token_type: "Bearer" } };
const accepted: Reply = { status: 202 };

function form(): FormData {
  const f = new FormData();
  f.set("name", "Dana Visitor");
  f.set("email", "dana@example.com");
  f.set("phone", "+1 416 555 0100");
  f.set("message", "We need a DAS design for a 12-floor office tower.");
  f.set("company_website", "");
  return f;
}

const tokenCalls = () => calls.filter((c) => c.url === TOKEN_URL).length;
const sendCalls = () => calls.filter((c) => c.url === SEND_URL);

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
  process.env.GRAPH_MAIL_TENANT_ID = TENANT;
  process.env.GRAPH_MAIL_CLIENT_ID = "11111111-2222-3333-4444-555555555555";
  process.env.GRAPH_MAIL_CLIENT_SECRET = SECRET;
  process.env.GRAPH_MAIL_SENDER = "info@quadtechsolutions.com";
  process.env.CONTACT_TO_EMAIL = "info@quadtechsolutions.com";
  calls = [];
  logs = [];
  console.error = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  resetGraphTokenCache();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalError;
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function assertNoSecretLogged() {
  for (const line of logs) {
    assert.ok(!line.includes(SECRET), `secret leaked in log: ${line}`);
    assert.ok(!line.includes("tok-1"), `token leaked in log: ${line}`);
  }
}

test("graph: success sends from info@ with replyTo, saves to Sent Items, caches the token", async () => {
  mockGraph([okToken], [accepted]);
  assert.deepEqual(await handleContact(form()), { ok: true });
  assert.deepEqual(await handleContact(form()), { ok: true });
  assert.equal(tokenCalls(), 1, "token is cached between sends");
  assert.equal(sendCalls().length, 2);

  const tokenBody = new URLSearchParams(String(calls[0].init?.body));
  assert.equal(tokenBody.get("grant_type"), "client_credentials");
  assert.equal(tokenBody.get("scope"), "https://graph.microsoft.com/.default");
  assert.equal(tokenBody.get("client_secret"), SECRET);

  const send = sendCalls()[0];
  assert.equal((send.init?.headers as Record<string, string>).authorization, "Bearer tok-1");
  const payload = JSON.parse(String(send.init?.body));
  assert.equal(payload.saveToSentItems, true);
  assert.deepEqual(payload.message.toRecipients, [{ emailAddress: { address: "info@quadtechsolutions.com" } }]);
  assert.deepEqual(payload.message.replyTo, [{ emailAddress: { address: "dana@example.com", name: "Dana Visitor" } }]);
  assert.equal(payload.message.body.contentType, "HTML");
  assert.match(payload.message.subject, /Dana Visitor/);
  assert.equal(logs.length, 0);
});

test("graph: tenant falls back to AUTH_MICROSOFT_ENTRA_ID_TENANT_ID and recipient to the sender", async () => {
  delete process.env.GRAPH_MAIL_TENANT_ID;
  delete process.env.CONTACT_TO_EMAIL;
  process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID = TENANT;
  process.env.APPLY_TO_EMAIL = "hr@quadtechsolutions.com";
  mockGraph([okToken], [accepted]);
  assert.deepEqual(await handleContact(form()), { ok: true });
  const payload = JSON.parse(String(sendCalls()[0].init?.body));
  assert.equal(payload.message.toRecipients[0].emailAddress.address, "info@quadtechsolutions.com");
});

test("graph: preferred over Resend when both are configured", async () => {
  process.env.RESEND_API_KEY = "re_test_key";
  mockGraph([okToken], [accepted]);
  assert.deepEqual(await handleContact(form()), { ok: true });
  assert.ok(calls.every((c) => c.url === TOKEN_URL || c.url === SEND_URL), "no Resend call");
});

test("graph: 401 refreshes the token once and succeeds", async () => {
  mockGraph(
    [okToken, { status: 200, body: { access_token: "tok-2", expires_in: 3599 } }],
    [{ status: 401, body: { error: { code: "InvalidAuthenticationToken" } } }, accepted],
  );
  assert.deepEqual(await handleContact(form()), { ok: true });
  assert.equal(tokenCalls(), 2);
  assert.equal((sendCalls()[1].init?.headers as Record<string, string>).authorization, "Bearer tok-2");
  assert.match(logs[0], /status=401 code=InvalidAuthenticationToken/);
  assertNoSecretLogged();
});

test("graph: repeated 401 returns 502 and logs status and code only", async () => {
  mockGraph([okToken], [{ status: 401, body: { error: { code: "InvalidAuthenticationToken" } } }]);
  const result = await handleContact(form());
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.status, 502);
  assert.equal(sendCalls().length, 2);
  assert.ok(logs.some((l) => /Graph sendMail failed: status=401 code=InvalidAuthenticationToken/.test(l)));
  assertNoSecretLogged();
});

test("graph: 403 ErrorAccessDenied (mailbox outside the RBAC scope) is not retried", async () => {
  mockGraph(
    [okToken],
    [{ status: 403, body: { error: { code: "ErrorAccessDenied", message: "Access is denied." } }, headers: { "request-id": "req-403" } }],
  );
  const result = await handleContact(form());
  assert.equal(!result.ok && result.status, 502);
  assert.equal(sendCalls().length, 1);
  assert.ok(logs.some((l) => l.includes("status=403 code=ErrorAccessDenied request-id=req-403")));
  assertNoSecretLogged();
});

test("graph: 429 with a short Retry-After is retried once", async () => {
  mockGraph(
    [okToken],
    [{ status: 429, body: { error: { code: "ApplicationThrottled" } }, headers: { "retry-after": "1" } }, accepted],
  );
  assert.deepEqual(await handleContact(form()), { ok: true });
  assert.equal(sendCalls().length, 2);
  assert.ok(logs.some((l) => l.includes("status=429 code=ApplicationThrottled")));
});

test("graph: 429 with a long Retry-After fails fast with 502", async () => {
  mockGraph(
    [okToken],
    [{ status: 429, body: { error: { code: "ApplicationThrottled" } }, headers: { "retry-after": "120" } }],
  );
  const started = Date.now();
  const result = await handleContact(form());
  assert.equal(!result.ok && result.status, 502);
  assert.equal(sendCalls().length, 1);
  assert.ok(Date.now() - started < 2000);
});

test("graph: token endpoint 401 invalid_client logs AADSTS code, never the secret", async () => {
  mockGraph(
    [{ status: 401, body: { error: "invalid_client", error_codes: [7000215], error_description: `Invalid client secret ${SECRET}`, correlation_id: "corr-1" } }],
    [accepted],
  );
  const result = await handleContact(form());
  assert.equal(!result.ok && result.status, 502);
  assert.equal(sendCalls().length, 0);
  assert.ok(logs.some((l) => l.includes("status=401 error=invalid_client aadsts=7000215 correlation=corr-1")));
  assertNoSecretLogged();
});

test("not configured: 503 without TODO text", async () => {
  for (const k of ENV_KEYS) delete process.env[k];
  mockGraph([okToken], [accepted]);
  const result = await handleContact(form());
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.status, 503);
  assert.equal(!result.ok && result.message, "This inbox is not configured, so the message was not sent.");
  assert.equal(calls.length, 0);
});
