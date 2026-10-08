"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { JobArticle } from "@/components/job-article";
import { LineList } from "@/components/admin/line-list";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveJob, type ActionState } from "@/lib/admin/actions";
import { industries } from "@/lib/industries";
import { jobFormSchema, type JobFormInput } from "@/lib/jobs/schema";
import { slugFromTitle } from "@/lib/jobs/ids";
import { SITE_URL } from "@/lib/site";
import {
  COUNTRIES,
  ENGAGEMENT_TYPES,
  LOCATION_MODES,
  SERVICE_LINES,
  countryName,
} from "@/lib/taxonomy";

const empty: ActionState = { ok: false };

export type EditorJob = JobFormInput & {
  jobId: string;
  slug: string;
  slugLocked: boolean;
  createdBy: string;
  updatedBy: string;
};

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );
}

export function JobEditor({
  job,
  serverError,
}: {
  job: EditorJob | null;
  serverError?: string;
}) {
  const [state, action, pending] = useActionState(saveJob, empty);
  const [title, setTitle] = useState(job?.title ?? "");
  const [serviceLine, setServiceLine] = useState(job?.serviceLine ?? "");
  const [industry, setIndustry] = useState(job?.industry ?? "");
  const [city, setCity] = useState(job?.location.city ?? "");
  const [region, setRegion] = useState(job?.location.region ?? "");
  const [country, setCountry] = useState(job?.location.country ?? "");
  const [mode, setMode] = useState(job?.location.mode ?? "");
  const [workCountries, setWorkCountries] = useState<string[]>(job?.workCountries ?? []);
  const [type, setType] = useState(job?.type ?? "");
  const [durationWeeks, setDurationWeeks] = useState(job?.durationWeeks ? String(job.durationWeeks) : "");
  const [payListed, setPayListed] = useState(Boolean(job?.payRange));
  const [payMin, setPayMin] = useState(job?.payRange ? String(job.payRange.min) : "");
  const [payMax, setPayMax] = useState(job?.payRange ? String(job.payRange.max) : "");
  const [payCurrency, setPayCurrency] = useState(job?.payRange?.currency ?? "USD");
  const [payUnit, setPayUnit] = useState(job?.payRange?.unit ?? "hour");
  const [postedDate, setPostedDate] = useState(job?.postedDate ?? new Date().toISOString().slice(0, 10));
  const [closingDate, setClosingDate] = useState(job?.closingDate ?? "");
  const [summary, setSummary] = useState(job?.summary ?? "");
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities ?? [""]);
  const [requirements, setRequirements] = useState(job?.requirements ?? [""]);
  const [niceToHave, setNiceToHave] = useState(job?.niceToHave ?? []);
  const [travel, setTravel] = useState(job?.travel ?? "");
  const [internalNote, setInternalNote] = useState(job?.internalNote ?? "");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [confirming, setConfirming] = useState(false);
  const errors = state.fieldErrors ?? {};
  const publicSlug = job?.slugLocked ? job.slug : slug.trim() || (job ? slugFromTitle(title || "role", job.jobId) : "published-slug");
  const publicUrl = `${SITE_URL}/careers/${publicSlug}`;

  const snapshot = useMemo(
    () =>
      JSON.stringify({
        title,
        serviceLine,
        industry,
        city,
        region,
        country,
        mode,
        workCountries,
        type,
        durationWeeks,
        payListed,
        payMin,
        payMax,
        payCurrency,
        payUnit,
        postedDate,
        closingDate,
        summary,
        responsibilities,
        requirements,
        niceToHave,
        travel,
        internalNote,
        slug,
      }),
    [
      title,
      serviceLine,
      industry,
      city,
      region,
      country,
      mode,
      workCountries,
      type,
      durationWeeks,
      payListed,
      payMin,
      payMax,
      payCurrency,
      payUnit,
      postedDate,
      closingDate,
      summary,
      responsibilities,
      requirements,
      niceToHave,
      travel,
      internalNote,
      slug,
    ],
  );
  const [baseline, setBaseline] = useState(snapshot);
  const [appliedSave, setAppliedSave] = useState(0);
  if (state.ok && state.savedAt && state.savedAt !== appliedSave) {
    setAppliedSave(state.savedAt);
    setBaseline(snapshot);
  }
  const dirty = snapshot !== baseline;

  useEffect(() => {
    function onLeave(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const preview = jobFormSchema.safeParse({
    title,
    serviceLine,
    industry,
    location: { city, region, country, mode },
    workCountries: workCountries.length ? workCountries : undefined,
    type,
    durationWeeks: durationWeeks ? Number(durationWeeks) : undefined,
    payRange: payListed
      ? { min: Number(payMin), max: Number(payMax), currency: payCurrency, unit: payUnit }
      : undefined,
    postedDate,
    closingDate: closingDate || undefined,
    summary,
    responsibilities: responsibilities.map((item) => item.trim()).filter(Boolean),
    requirements: requirements.map((item) => item.trim()).filter(Boolean),
    niceToHave: niceToHave.map((item) => item.trim()).filter(Boolean),
    travel: travel.trim() || undefined,
    internalNote: internalNote.trim() || undefined,
    slug: slug || undefined,
  });

  function toggleCountry(code: string) {
    setWorkCountries((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  }

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
      <form action={action} className="grid gap-4">
        {job ? <input type="hidden" name="jobId" value={job.jobId} /> : null}
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required className="h-11" />
          <FieldError error={errors.title} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="serviceLine">Service line *</Label>
            <NativeSelect id="serviceLine" name="serviceLine" value={serviceLine} onChange={(event) => setServiceLine(event.target.value)} required>
              <option value="">Select a service line</option>
              {SERVICE_LINES.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </NativeSelect>
            <FieldError error={errors.serviceLine} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="industry">Industry *</Label>
            <NativeSelect id="industry" name="industry" value={industry} onChange={(event) => setIndustry(event.target.value)} required>
              <option value="">Select an industry</option>
              {industries.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
            <FieldError error={errors.industry} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" name="city" value={city} onChange={(event) => setCity(event.target.value)} required className="h-11" />
            <FieldError error={errors["location.city"]} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region *</Label>
            <Input id="region" name="region" value={region} onChange={(event) => setRegion(event.target.value)} required className="h-11" />
            <FieldError error={errors["location.region"]} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country *</Label>
            <NativeSelect id="country" name="country" value={country} onChange={(event) => setCountry(event.target.value)} required>
              <option value="">Select a country</option>
              {COUNTRIES.map((code) => (
                <option key={code} value={code}>
                  {countryName(code)}
                </option>
              ))}
            </NativeSelect>
            <FieldError error={errors["location.country"]} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mode">Location mode *</Label>
            <NativeSelect id="mode" name="mode" value={mode} onChange={(event) => setMode(event.target.value)} required>
              <option value="">Select a mode</option>
              {LOCATION_MODES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </NativeSelect>
            <FieldError error={errors["location.mode"]} />
          </div>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium">Also open in</legend>
          {COUNTRIES.map((code) => (
            <label key={code} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="workCountries"
                value={code}
                checked={workCountries.includes(code)}
                onChange={() => toggleCountry(code)}
              />
              {countryName(code)}
            </label>
          ))}
        </fieldset>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="type">Type *</Label>
            <NativeSelect id="type" name="type" value={type} onChange={(event) => setType(event.target.value)} required>
              <option value="">Select a type</option>
              {ENGAGEMENT_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </NativeSelect>
            <FieldError error={errors.type} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="durationWeeks">Duration (weeks)</Label>
            <Input id="durationWeeks" name="durationWeeks" inputMode="numeric" value={durationWeeks} onChange={(event) => setDurationWeeks(event.target.value)} className="h-11" />
            <FieldError error={errors.durationWeeks} />
          </div>
        </div>
        <fieldset className="grid gap-2 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium">Pay</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="payListed" value="yes" checked={payListed} onChange={(event) => setPayListed(event.target.checked)} />
            List a pay range
          </label>
          {payListed ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="payMin">Minimum</Label>
                <Input id="payMin" name="payMin" inputMode="decimal" value={payMin} onChange={(event) => setPayMin(event.target.value)} className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payMax">Maximum</Label>
                <Input id="payMax" name="payMax" inputMode="decimal" value={payMax} onChange={(event) => setPayMax(event.target.value)} className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payCurrency">Currency</Label>
                <NativeSelect id="payCurrency" name="payCurrency" value={payCurrency} onChange={(event) => setPayCurrency(event.target.value as "USD" | "CAD")}>
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payUnit">Unit</Label>
                <NativeSelect id="payUnit" name="payUnit" value={payUnit} onChange={(event) => setPayUnit(event.target.value as "hour" | "day")}>
                  <option value="hour">Per hour</option>
                  <option value="day">Per day</option>
                </NativeSelect>
              </div>
            </div>
          ) : null}
          <FieldError error={errors.payRange} />
        </fieldset>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="postedDate">Posted date *</Label>
            <Input id="postedDate" name="postedDate" type="date" value={postedDate} onChange={(event) => setPostedDate(event.target.value)} required className="h-11" />
            <FieldError error={errors.postedDate} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="closingDate">Closing date</Label>
            <Input id="closingDate" name="closingDate" type="date" value={closingDate} onChange={(event) => setClosingDate(event.target.value)} className="h-11" />
            <FieldError error={errors.closingDate} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="summary">Summary *</Label>
          <Textarea id="summary" name="summary" value={summary} onChange={(event) => setSummary(event.target.value)} required rows={4} />
          <FieldError error={errors.summary} />
        </div>
        <LineList name="responsibilities" label="Responsibilities" required values={responsibilities} onChange={setResponsibilities} error={errors.responsibilities} />
        <LineList name="requirements" label="Requirements" required values={requirements} onChange={setRequirements} error={errors.requirements} />
        <LineList name="niceToHave" label="Nice to have" values={niceToHave} onChange={setNiceToHave} error={errors.niceToHave} />
        <div className="grid gap-2">
          <Label htmlFor="travel">Travel</Label>
          <Textarea id="travel" name="travel" value={travel} onChange={(event) => setTravel(event.target.value)} rows={3} />
          <FieldError error={errors.travel} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="internalNote">Internal note</Label>
          <Textarea id="internalNote" name="internalNote" value={internalNote} onChange={(event) => setInternalNote(event.target.value)} rows={3} />
          <p className="text-sm text-muted-foreground">Not shown on the public page.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" value={job?.slugLocked ? job.slug : slug} onChange={(event) => setSlug(event.target.value)} disabled={job?.slugLocked} className="h-11" />
          <p className="text-sm text-muted-foreground">
            {job?.slugLocked
              ? "Slug is fixed because this post has been published."
              : "Leave blank to build it from the title and job ID. Changing it before publish keeps a redirect from the old slug."}
          </p>
          <FieldError error={errors.slug} />
        </div>
        {job ? (
          <p className="text-sm text-muted-foreground">
            {job.jobId}. Created by {job.createdBy}. Last edited by {job.updatedBy}.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">A job ID is assigned when you save. It is never reused.</p>
        )}
        {dirty ? (
          <p className="text-sm" role="status">
            Unsaved changes.
          </p>
        ) : null}
        {state.message || serverError ? (
          <p className={state.ok ? "text-sm" : "text-sm text-destructive"} role="status">
            {state.message || serverError}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" name="intent" value="save" className="h-11 px-4" disabled={pending}>
            Save draft
          </Button>
          <Button type="button" className="h-11 px-4" onClick={() => setConfirming(true)}>
            Publish
          </Button>
        </div>
        {confirming ? (
          <div className="grid gap-3 rounded-lg border border-border bg-card p-4" role="dialog" aria-labelledby="publish-title">
            <h2 id="publish-title" className="text-lg font-semibold">
              Publish this post?
            </h2>
            <p className="text-sm text-muted-foreground">
              It will be public at <span className="break-all text-foreground">{publicUrl}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" name="intent" value="publish" className="h-11 px-4" disabled={pending}>
                Publish
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </form>
      <div className="min-w-0 rounded-xl border border-border">
        {preview.success ? (
          <JobArticle
            job={{
              ...preview.data,
              slug: publicSlug,
              jobId: job?.jobId ?? "QT-JOB-YYYY-NNN",
              niceToHave: preview.data.niceToHave,
            }}
            mode="preview"
          />
        ) : (
          <p className="p-4 text-sm text-muted-foreground">Preview updates when the required fields are valid.</p>
        )}
      </div>
    </div>
  );
}
