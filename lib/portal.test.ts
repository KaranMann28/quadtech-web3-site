import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { handleApplication } from "@/lib/apply/process";
import { validateResume } from "@/lib/apply/files";
import { rateLimit, resetRateLimits } from "@/lib/apply/rate-limit";
import { jsonMailAllowed, sendApplicationEmail } from "@/lib/apply/deliver";
import { groupJobsByServiceLine, searchJobs } from "@/lib/jobs/search";
import { jobsDir, loadJobsFromDir, loadSeedJobs } from "@/lib/jobs/load";
import type { PublicJob } from "@/lib/jobs/schema";
import { jobPostingJsonLd } from "@/lib/jobs/jsonld";

const sample = (overrides: Partial<PublicJob> = {}): PublicJob => ({
  slug: "sample-role",
  jobId: "QT-JOB-2026-010",
  title: "Sample Field Role",
  serviceLine: "Drive & Walk Testing",
  industry: "wireless-carriers-oems",
  location: { city: "Mississauga", region: "ON", country: "CA", mode: "Field" },
  type: "Contract",
  postedDate: "2026-03-02",
  summary: "XCAL drive testing support for a carrier assignment in the GTA.",
  responsibilities: ["Collect XCAL data."],
  requirements: ["XCAL experience."],
  ...overrides,
});

function pdfFile(name = "resume.pdf"): File {
  return new File([Buffer.from("%PDF-1.4\n% sample resume\n")], name, {
    type: "application/pdf",
  });
}

function baseForm(kind: "job" | "talent-network"): FormData {
  const form = new FormData();
  form.set("kind", kind);
  form.set("firstName", "Amina");
  form.set("lastName", "Rahman");
  form.set("email", "amina@example.com");
  form.set("phone", "+1 416 200 0199");
  form.set("linkedin", "");
  form.set("company_website", "");
  form.set("resume", pdfFile());
  if (kind === "job") form.set("workAuthorization", "yes");
  return form;
}

test("published jobs exclude drafts and the template", () => {
  const jobs = loadSeedJobs();
  assert.equal(jobs.length, 6);
  const drafts = jobs.filter((job) => job.status === "draft");
  const published = jobs.filter((job) => job.status === "published");
  assert.equal(drafts.length, 2);
  assert.equal(published.length, 4);
  assert.deepEqual(
    published.map((job) => job.jobId).sort(),
    ["QT-JOB-2026-003", "QT-JOB-2026-004", "QT-JOB-2026-005", "QT-JOB-2026-006"],
  );
  assert.deepEqual(
    jobs.map((job) => job.jobId).sort(),
    [
      "QT-JOB-2026-001",
      "QT-JOB-2026-002",
      "QT-JOB-2026-003",
      "QT-JOB-2026-004",
      "QT-JOB-2026-005",
      "QT-JOB-2026-006",
    ],
  );
  const salesforce = published.filter((job) => job.title.includes("Salesforce"));
  assert.equal(salesforce.length, 3);
  for (const job of salesforce) {
    assert.equal(job.location.country, "CA");
    assert.equal(job.payRange, undefined);
    assert.ok(!JSON.stringify(job).toLowerCase().includes("karma"), "vendor rewards must not ship");
  }
  assert.equal(loadJobsFromDir(jobsDir()).length, 6);
});

test("loader rejects a public role that still has TODO [CONFIRM]", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qts-jobs-"));
  const job = {
    slug: "public-role",
    jobId: "QT-JOB-2026-050",
    title: "Public Role",
    serviceLine: "Field Services",
    industry: "data-centers",
    location: { city: "Calgary", region: "AB", country: "CA", mode: "Field" },
    type: "Full-Time",
    postedDate: "2026-04-01",
    summary: "Field services role. Pay is TODO [CONFIRM] and must not publish.",
    responsibilities: ["Perform site investigation."],
    requirements: ["Field experience."],
    draft: false,
  };
  fs.writeFileSync(path.join(dir, "public-role.json"), JSON.stringify(job));
  assert.throws(() => loadJobsFromDir(dir), /TODO \[CONFIRM\]/);
});

test("board search matches title and location, and groups follow the taxonomy order", () => {
  const jobs: PublicJob[] = [
    sample(),
    sample({
      slug: "remote-design",
      jobId: "QT-JOB-2026-011",
      title: "RF Design Engineer — iBwave / ATOLL",
      serviceLine: "RF Engineering",
      industry: "neutral-host-das",
      location: { city: "Remote", region: "United States and Canada", country: "US", mode: "Remote" },
      workCountries: ["US", "CA"],
      postedDate: "2026-05-01",
      summary: "Remote iBwave and ATOLL design support.",
    }),
    sample({
      slug: "newer-field-role",
      jobId: "QT-JOB-2026-012",
      title: "Newer Field Role",
      postedDate: "2026-06-01",
      summary: "Newer drive testing assignment in the GTA.",
    }),
  ];

  assert.deepEqual(searchJobs(jobs, "ibwave").map((job) => job.slug), ["remote-design"]);
  assert.deepEqual(
    searchJobs(jobs, "mississauga").map((job) => job.slug).sort(),
    ["newer-field-role", "sample-role"],
  );
  assert.equal(searchJobs(jobs, "  ").length, 3, "blank query returns everything");
  assert.equal(searchJobs(jobs, "no-match-here").length, 0);

  const groups = groupJobsByServiceLine(jobs);
  assert.deepEqual(
    groups.map((group) => group.serviceLine),
    ["RF Engineering", "Drive & Walk Testing"],
    "groups follow SERVICE_LINES order",
  );
  assert.deepEqual(
    groups[1]?.jobs.map((job) => job.slug),
    ["newer-field-role", "sample-role"],
    "newest postings first inside a group",
  );
});

test("résumé checks accept PDF and reject oversize or mismatched files", () => {
  const ok = validateResume({
    name: "Amina Rahman.pdf",
    type: "application/pdf",
    bytes: Buffer.from("%PDF-1.4\nresume"),
  });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.resume.filename, "Amina_Rahman.pdf");

  const big = validateResume({
    name: "resume.pdf",
    type: "application/pdf",
    bytes: Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(5 * 1024 * 1024)]),
  });
  assert.equal(big.ok, false);

  const fake = validateResume({
    name: "resume.pdf",
    type: "application/pdf",
    bytes: Buffer.from("not a pdf"),
  });
  assert.equal(fake.ok, false);
});

test("rate limit allows five hits per window", () => {
  resetRateLimits();
  for (let i = 0; i < 5; i += 1) assert.equal(rateLimit("apply:test", 5, 60_000, 1_000), true);
  assert.equal(rateLimit("apply:test", 5, 60_000, 1_000), false);
  assert.equal(rateLimit("apply:test", 5, 60_000, 70_000), true);
});

test("draft roles and invalid applications are rejected", async () => {
  const draftForm = baseForm("job");
  draftForm.set("jobSlug", "field-test-engineer-drive-walk-xcal");
  const draftResult = await handleApplication(draftForm);
  assert.equal(draftResult.ok, false);
  if (!draftResult.ok) assert.equal(draftResult.status, 404);

  const missing = baseForm("talent-network");
  missing.set("firstName", "");
  const invalid = await handleApplication(missing);
  assert.equal(invalid.ok, false);
  if (!invalid.ok) assert.equal(invalid.fieldErrors?.firstName !== undefined, true);

  const badPhone = baseForm("talent-network");
  badPhone.set("phone", "call me");
  const phoneResult = await handleApplication(badPhone);
  assert.equal(phoneResult.ok, false);
  if (!phoneResult.ok) assert.equal(phoneResult.fieldErrors?.phone !== undefined, true);

  const honeypot = baseForm("talent-network");
  honeypot.set("company_website", "https://spam.example");
  const ignored = await handleApplication(honeypot);
  assert.deepEqual(ignored, { ok: true });
});

test("a posted role requires the yes/no work authorization answer; talent network does not", async () => {
  process.env.APPLY_SMTP_HOST = "json";
  process.env.APPLY_SMTP_FROM = "careers-test@example.com";
  process.env.APPLY_TO_EMAIL = "careers@example.com";
  (process.env as { NODE_ENV?: string }).NODE_ENV = "test";

  const withoutAnswer = baseForm("job");
  withoutAnswer.set("jobSlug", "senior-salesforce-functional-lead");
  withoutAnswer.delete("workAuthorization");
  const rejected = await handleApplication(withoutAnswer);
  assert.equal(rejected.ok, false);
  if (!rejected.ok) {
    assert.equal(rejected.status, 400);
    assert.equal(rejected.fieldErrors?.workAuthorization, "Select yes or no.");
  }

  const applied = baseForm("job");
  applied.set("jobSlug", "senior-salesforce-functional-lead");
  applied.set("phone", "");
  applied.set("workAuthorization", "no");
  assert.deepEqual(await handleApplication(applied), { ok: true }, "a 'no' answer is still recorded");

  const network = baseForm("talent-network");
  network.set("phone", "");
  assert.deepEqual(await handleApplication(network), { ok: true }, "no work-auth question off a posting");

  delete process.env.APPLY_SMTP_HOST;
  delete process.env.APPLY_SMTP_FROM;
  delete process.env.APPLY_TO_EMAIL;
});

test("email sends and a failed webhook does not fail the application", async () => {
  const previous = {
    host: process.env.APPLY_SMTP_HOST,
    from: process.env.APPLY_SMTP_FROM,
    to: process.env.APPLY_TO_EMAIL,
    hook: process.env.ZAPIER_HOOK_URL,
    nodeEnv: process.env.NODE_ENV,
  };
  process.env.APPLY_SMTP_HOST = "json";
  process.env.APPLY_SMTP_FROM = "careers-test@example.com";
  process.env.APPLY_TO_EMAIL = "careers@example.com";
  (process.env as { NODE_ENV?: string }).NODE_ENV = "test";
  delete process.env.ZAPIER_HOOK_URL;

  const form = baseForm("talent-network");

  const sent = await sendApplicationEmail(
    {
      subject: "Talent network application — Amina Rahman",
      text: "Name: Amina Rahman",
      applicantName: "Amina Rahman",
      applicantEmail: "amina@example.com",
    },
    {
      filename: "resume.pdf",
      contentType: "application/pdf",
      bytes: Buffer.from("%PDF-1.4\nresume"),
    },
  );
  assert.match(sent.message ?? "", /careers@example.com/);
  assert.match(sent.message ?? "", /resume\.pdf/);

  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    throw new Error("webhook down");
  }) as typeof fetch;

  const withoutHook = await handleApplication(form);
  assert.deepEqual(withoutHook, { ok: true });
  assert.equal(calls, 0);

  process.env.ZAPIER_HOOK_URL = "https://hooks.zapier.example/catch";
  const withHook = await handleApplication(form);
  assert.deepEqual(withHook, { ok: true });
  assert.equal(calls, 1);

  globalThis.fetch = originalFetch;
  process.env.APPLY_SMTP_HOST = previous.host;
  process.env.APPLY_SMTP_FROM = previous.from;
  process.env.APPLY_TO_EMAIL = previous.to;
  if (previous.hook === undefined) delete process.env.ZAPIER_HOOK_URL;
  else process.env.ZAPIER_HOOK_URL = previous.hook;
  (process.env as { NODE_ENV?: string }).NODE_ENV = previous.nodeEnv;
});

test("json mail is allowed on loopback and refused for a public origin", () => {
  const previous = {
    host: process.env.APPLY_SMTP_HOST,
    nodeEnv: process.env.NODE_ENV,
    url: process.env.AUTH_URL,
  };
  process.env.APPLY_SMTP_HOST = "json";
  (process.env as { NODE_ENV?: string }).NODE_ENV = "production";
  process.env.AUTH_URL = "https://quadtechsolutions.io";
  assert.equal(jsonMailAllowed(), false);
  process.env.AUTH_URL = "http://127.0.0.1:43124";
  assert.equal(jsonMailAllowed(), true);
  (process.env as { NODE_ENV?: string }).NODE_ENV = "test";
  process.env.AUTH_URL = "https://quadtechsolutions.io";
  assert.equal(jsonMailAllowed(), true);
  if (previous.host === undefined) delete process.env.APPLY_SMTP_HOST;
  else process.env.APPLY_SMTP_HOST = previous.host;
  if (previous.url === undefined) delete process.env.AUTH_URL;
  else process.env.AUTH_URL = previous.url;
  (process.env as { NODE_ENV?: string }).NODE_ENV = previous.nodeEnv;
});

test("job posting structured data includes pay currency when present", () => {
  const data = jobPostingJsonLd(
    sample({
      payRange: { min: 40, max: 55, currency: "CAD", unit: "hour" },
    }),
  );
  assert.equal(data["@type"], "JobPosting");
  assert.equal(data.identifier.value, "QT-JOB-2026-010");
  assert.equal(data.baseSalary.currency, "CAD");
  assert.equal(data.baseSalary.value.unitText, "HOUR");
});
