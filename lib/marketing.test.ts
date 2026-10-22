import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buyerServices } from "@/content/buyer-services";
import { caseStudies } from "@/content/case-studies";
import {
  dailyTestReportFields,
  engagementSteps,
  kpiSummaryFields,
} from "@/content/how-we-work";
import { MARKETING_PATHS } from "@/lib/marketing-paths";
import {
  isQuoteTopic,
  messageForTopic,
  quoteHref,
  QUOTE_TOPICS,
} from "@/lib/quote-topics";
import { serviceHref } from "@/lib/services";
import { serviceJsonLd } from "@/lib/service-schema";

test("published case studies stay empty until a consented write-up exists", () => {
  assert.equal(caseStudies.length, 0);
  const source = fs.readFileSync(path.join(process.cwd(), "content/case-studies.ts"), "utf8");
  assert.match(source, /EXAMPLE — not rendered in production/);
  assert.doesNotMatch(source, /export const exampleCaseStudy/);
});

test("buyer hub covers the six quote lines and dedicated pages", () => {
  assert.equal(buyerServices.length, 6);
  const slugs = buyerServices.map((service) => service.slug);
  assert.deepEqual(slugs, [
    "rf-design",
    "field-testing",
    "in-building",
    "sweep-pim-fiber",
    "project-management",
    "staffing",
  ]);
  assert.ok(buyerServices.some((service) => service.links.some((link) => link.href === "/services/das")));
  assert.ok(
    buyerServices.some((service) =>
      service.links.some((link) => link.href === "/services/public-safety-radio"),
    ),
  );
  assert.ok(
    buyerServices.some((service) => service.links.some((link) => link.href === "/services/field-testing")),
  );
});

test("quote topics prefills are client-side contact hrefs only", () => {
  for (const topic of QUOTE_TOPICS) {
    assert.equal(quoteHref(topic), `/contact?topic=${topic}`);
    assert.ok(messageForTopic(topic).length > 0);
  }
  assert.equal(isQuoteTopic("public-safety"), true);
  assert.equal(isQuoteTopic("bell"), false);
  assert.equal(messageForTopic("unknown"), "");
  assert.equal(messageForTopic(null), "");
});

test("marketing sitemap paths include the new public pages", () => {
  assert.deepEqual([...MARKETING_PATHS], [
    "/services",
    "/services/public-safety-radio",
    "/services/das",
    "/services/field-testing",
    "/work",
    "/capabilities",
  ]);
});

test("catalog slugs map to dedicated buyer pages where they exist", () => {
  assert.equal(serviceHref("das-public-safety"), "/services/das");
  assert.equal(serviceHref("drive-walk-testing"), "/services/field-testing");
  assert.equal(serviceHref("cw-testing"), "/services/field-testing");
  assert.equal(serviceHref("rf-engineering"), "/services#rf-engineering");
});

test("service JSON-LD is a Service with no invented offers", () => {
  const data = serviceJsonLd({
    name: "In-building DAS",
    description: "Design and commissioning.",
    path: "/services/das",
  });
  assert.equal(data["@type"], "Service");
  assert.equal(data.url, "https://quadtechsolutions.io/services/das");
  assert.ok(!("review" in data));
  assert.ok(!("aggregateRating" in data));
});

test("work copy is field lists, not fabricated results", () => {
  assert.equal(engagementSteps.length, 5);
  assert.ok(dailyTestReportFields.length >= 6);
  assert.ok(kpiSummaryFields.some((field) => /criteria/i.test(field)));
  const joined = [...dailyTestReportFields, ...kpiSummaryFields].join(" ");
  assert.doesNotMatch(joined, /\d+(\.\d+)?\s*%/);
});
