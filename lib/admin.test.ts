import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { adminSignInResult, upnFromEntraProfile } from "@/lib/auth/allowlist";
import { safeAuthRedirect } from "@/lib/auth/redirect";
import { nextJobId } from "@/lib/jobs/ids";
import { loadSeedJobs } from "@/lib/jobs/load";
import { closedPostState } from "@/lib/jobs/visibility";

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), "qts-admin-"));
const dbFile = path.join(dbDir, "portal.db");
process.env.DATABASE_URL = `file:${dbFile}`;
process.env.ADMIN_UPNS = "allowed.admin@quadtechsolutions.com";
execSync("npx prisma migrate deploy", {
  cwd: process.cwd(),
  env: process.env,
  stdio: "pipe",
});

test("job ids advance within a year and restart at the year boundary", () => {
  assert.equal(nextJobId(["QT-JOB-2026-001", "QT-JOB-2026-002"], new Date("2026-08-01T00:00:00Z")), "QT-JOB-2026-003");
  assert.equal(nextJobId(["QT-JOB-2026-002", "QT-JOB-2025-014"], new Date("2027-01-01T00:00:00Z")), "QT-JOB-2027-001");
  assert.equal(nextJobId([], new Date("2026-01-01T00:00:00Z")), "QT-JOB-2026-001");
});

test("closed posts stay public for 30 days, then go away", () => {
  const closedAt = new Date("2026-01-01T00:00:00Z");
  const within = new Date(closedAt.getTime() + 29 * 24 * 60 * 60 * 1000);
  const boundary = new Date(closedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  assert.equal(closedPostState(closedAt, within, false), "closed");
  assert.equal(closedPostState(closedAt, boundary, false), "gone");
  assert.equal(closedPostState(closedAt, within, true), "hidden");
});

test("entra and email sign-in use the same allowlist", () => {
  const upn = upnFromEntraProfile(
    { preferred_username: "Allowed.Admin@quadtechsolutions.com", email: "other@example.com" },
    "fallback@example.com",
  );
  assert.equal(upn, "allowed.admin@quadtechsolutions.com");
  assert.equal(adminSignInResult(upn), true);
  assert.equal(adminSignInResult("someone.else@quadtechsolutions.com"), "/admin/not-authorized");
  assert.equal(adminSignInResult(""), "/admin/not-authorized");
});

test("loopback auth redirects stay on AUTH_URL", () => {
  const previous = process.env.AUTH_URL;
  process.env.AUTH_URL = "http://127.0.0.1:43124";
  assert.equal(
    safeAuthRedirect("http://127.0.0.1:43124/admin", "http://0.0.0.0:43124"),
    "http://127.0.0.1:43124/admin",
  );
  assert.equal(safeAuthRedirect("/admin/jobs", "http://localhost:43124"), "http://127.0.0.1:43124/admin/jobs");
  assert.equal(safeAuthRedirect("https://evil.example/admin", "http://127.0.0.1:43124"), "http://127.0.0.1:43124");
  if (previous === undefined) delete process.env.AUTH_URL;
  else process.env.AUTH_URL = previous;
});

test("preview without AUTH_URL follows the request host", () => {
  const previous = process.env.AUTH_URL;
  delete process.env.AUTH_URL;
  assert.equal(
    safeAuthRedirect("/admin", "https://quadtech-web3-site-kams-projects-e9588e2f.vercel.app"),
    "https://quadtech-web3-site-kams-projects-e9588e2f.vercel.app/admin",
  );
  if (previous === undefined) delete process.env.AUTH_URL;
  else process.env.AUTH_URL = previous;
});

test("postgres URLs win over a leftover SQLite DATABASE_URL", async () => {
  const previous = {
    database: process.env.DATABASE_URL,
    postgres: process.env.POSTGRES_URL,
    prisma: process.env.POSTGRES_PRISMA_URL,
    vercel: process.env.VERCEL,
  };
  process.env.DATABASE_URL = "file:./data/portal.db";
  process.env.POSTGRES_URL = "postgres://neon.example/portal";
  delete process.env.POSTGRES_PRISMA_URL;
  const { databaseUrl, isPostgresUrl } = await import("@/lib/db");
  assert.equal(isPostgresUrl("file:./data/portal.db"), false);
  assert.equal(databaseUrl(), "postgres://neon.example/portal");
  delete process.env.POSTGRES_URL;
  process.env.VERCEL = "1";
  assert.throws(() => databaseUrl(), /requires a Postgres URL/);
  process.env.DATABASE_URL = previous.database;
  if (previous.postgres === undefined) delete process.env.POSTGRES_URL;
  else process.env.POSTGRES_URL = previous.postgres;
  if (previous.prisma === undefined) delete process.env.POSTGRES_PRISMA_URL;
  else process.env.POSTGRES_PRISMA_URL = previous.prisma;
  if (previous.vercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = previous.vercel;
});

test("applications persist when SMTP is not configured", async () => {
  const previous = {
    host: process.env.APPLY_SMTP_HOST,
    from: process.env.APPLY_SMTP_FROM,
    to: process.env.APPLY_TO_EMAIL,
    user: process.env.APPLY_SMTP_USER,
    pass: process.env.APPLY_SMTP_PASS,
    resend: process.env.RESEND_API_KEY,
  };
  delete process.env.APPLY_SMTP_HOST;
  delete process.env.APPLY_SMTP_FROM;
  delete process.env.APPLY_SMTP_USER;
  delete process.env.APPLY_SMTP_PASS;
  delete process.env.RESEND_API_KEY;
  process.env.APPLY_TO_EMAIL = "HR@quadtechsolutions.com";

  const { handleApplication } = await import("@/lib/apply/process");
  const { listApplications } = await import("@/lib/applications/store");
  const form = new FormData();
  form.set("kind", "talent-network");
  form.set("serviceLine", "general");
  form.set("fullName", "Persist Check");
  form.set("email", "persist.check@example.com");
  form.set("phone", "+1 416 555 0100");
  form.set("cityRegion", "Mississauga, ON");
  form.set("country", "CA");
  form.set("workAuthorization", "citizen-pr");
  form.set("linkedin", "");
  form.set("referral", "");
  form.set("message", "");
  form.set("consent", "true");
  form.set("company_website", "");
  form.set("screener__general_years", "6");
  form.set("screener__general_tools", "XCAL");
  form.set("screener__travel_radius", "GTA");
  form.set(
    "resume",
    new File([Buffer.from("%PDF-1.4\npersist\n")], "persist.pdf", { type: "application/pdf" }),
  );
  const result = await handleApplication(form);
  assert.deepEqual(result, { ok: true });
  const rows = await listApplications({});
  assert.equal(rows.some((row) => row.email === "persist.check@example.com"), true);

  if (previous.host === undefined) delete process.env.APPLY_SMTP_HOST;
  else process.env.APPLY_SMTP_HOST = previous.host;
  if (previous.from === undefined) delete process.env.APPLY_SMTP_FROM;
  else process.env.APPLY_SMTP_FROM = previous.from;
  if (previous.to === undefined) delete process.env.APPLY_TO_EMAIL;
  else process.env.APPLY_TO_EMAIL = previous.to;
  if (previous.user === undefined) delete process.env.APPLY_SMTP_USER;
  else process.env.APPLY_SMTP_USER = previous.user;
  if (previous.pass === undefined) delete process.env.APPLY_SMTP_PASS;
  else process.env.APPLY_SMTP_PASS = previous.pass;
  if (previous.resend === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previous.resend;
});

test("import is idempotent and drafts stay off the public board", async () => {
  const { resetPrisma } = await import("@/lib/db");
  await resetPrisma();
  const store = await import("@/lib/jobs/store");
  const seeds = loadSeedJobs();
  const first = await store.importSeedJobs(seeds);
  const second = await store.importSeedJobs(seeds);
  assert.deepEqual(first.inserted.sort(), ["QT-JOB-2026-001", "QT-JOB-2026-002", "QT-JOB-2026-003"]);
  assert.deepEqual(second.skipped.sort(), ["QT-JOB-2026-001", "QT-JOB-2026-002", "QT-JOB-2026-003"]);
  assert.equal(second.inserted.length, 0);
  const published = await store.getPublishedJobs();
  assert.equal(published.length, 1);
  assert.equal(published[0]?.jobId, "QT-JOB-2026-003");
  assert.equal(await store.getPublishedJob("field-test-engineer-drive-walk-xcal"), undefined);
  const hidden = await store.resolvePublicSlug("field-test-engineer-drive-walk-xcal");
  assert.equal(hidden.kind, "missing");
  const live = await store.resolvePublicSlug("project-administrator-contractor-2026-003");
  assert.equal(live.kind, "published");
});

test("duplicate assigns a new id and a closed post leaves the public list", async () => {
  const store = await import("@/lib/jobs/store");
  const { getPrisma } = await import("@/lib/db");
  const created = await store.createJob(
    {
      title: "CW Test Technician",
      serviceLine: "CW Testing",
      industry: "data-centers",
      location: { city: "Calgary", region: "AB", country: "CA", mode: "Field" },
      type: "Contract",
      postedDate: "2026-06-01",
      summary: "CW testing support for a data center coaxial plant in Calgary.",
      responsibilities: ["Run CW tests and record the results."],
      requirements: ["CW test experience and a valid driver license."],
      slug: "",
    },
    "allowed.admin@quadtechsolutions.com",
    new Date("2026-06-15T12:00:00Z"),
  );
  assert.equal(created.jobId, "QT-JOB-2026-004");
  const published = await store.setJobStatus(created.jobId, "published", "allowed.admin@quadtechsolutions.com");
  assert.equal(published.status, "published");
  assert.equal(published.slugLocked, true);
  assert.equal((await store.getPublishedJobs()).some((job) => job.jobId === created.jobId), true);

  const copy = await store.duplicateJob(created.jobId, "allowed.admin@quadtechsolutions.com", new Date("2026-07-01T00:00:00Z"));
  assert.equal(copy.jobId, "QT-JOB-2026-005");
  assert.equal(copy.status, "draft");
  assert.notEqual(copy.slug, published.slug);

  const nextYear = await store.createJob(
    {
      title: "Fiber Test Technician",
      serviceLine: "Fiber Testing",
      industry: "data-centers",
      location: { city: "Montreal", region: "QC", country: "CA", mode: "Field" },
      type: "Contract",
      postedDate: "2027-02-01",
      summary: "Fiber testing support for a data center build in Montreal.",
      responsibilities: ["Test fiber runs and record the results."],
      requirements: ["Fiber test experience."],
      slug: "",
    },
    "allowed.admin@quadtechsolutions.com",
    new Date("2027-02-02T00:00:00Z"),
  );
  assert.equal(nextYear.jobId, "QT-JOB-2027-001");

  await store.setJobStatus(created.jobId, "closed", "allowed.admin@quadtechsolutions.com");
  assert.equal((await store.getPublishedJobs()).some((job) => job.jobId === created.jobId), false);
  const visible = await store.resolvePublicSlug(published.slug);
  assert.equal(visible.kind, "closed");
  await getPrisma().job.update({
    where: { jobId: created.jobId },
    data: { closedAt: new Date("2020-01-01T00:00:00Z") },
  });
  assert.equal((await store.resolvePublicSlug(published.slug, new Date("2026-06-01T00:00:00Z"))).kind, "gone");

  const source = fs.readFileSync(path.join(process.cwd(), "lib/jobs/store.ts"), "utf8");
  assert.equal(source.includes(".delete("), false);
});
