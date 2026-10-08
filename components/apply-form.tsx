"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  applicationSchema,
  issuesToFieldErrors,
  validateScreeners,
  type FieldErrors,
} from "@/lib/apply/schema";
import { screenersForKey, type Screener } from "@/lib/jobs/screeners";
import type { PublicJob } from "@/lib/jobs/schema";
import {
  SERVICE_LINES,
  WORK_AUTH,
  WORK_AUTH_LABELS,
  countryName,
  serviceSlug,
  type CountryCode,
  type ServiceSlug,
} from "@/lib/taxonomy";

type Props =
  | { kind: "job"; job: PublicJob }
  | { kind: "talent-network" };

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-accent">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </Label>
      <div data-describedby={describedBy}>{children}</div>
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ApplyForm(props: Props) {
  const router = useRouter();
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [serviceKey, setServiceKey] = useState<ServiceSlug | "general">(
    props.kind === "job" ? serviceSlug(props.job.serviceLine) : "general",
  );
  const [country, setCountry] = useState<CountryCode>("US");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const screeners: Screener[] =
    props.kind === "job" ? screenersForKey(serviceSlug(props.job.serviceLine)) : screenersForKey(serviceKey);

  useEffect(() => {
    if (formError) summaryRef.current?.focus();
  }, [formError]);

  const title = props.kind === "job" ? props.job.title : "Talent network";

  function described(id: string) {
    return [errors[id] ? `${id}-error` : null, `${id}-hint`].filter(Boolean).join(" ") || undefined;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("consent", consent ? "true" : "false");
    const answers: Record<string, string> = {};
    for (const screener of screeners) {
      answers[screener.id] = String(data.get(`screener__${screener.id}`) ?? "");
    }
    const parsed = applicationSchema.safeParse({
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      cityRegion: String(data.get("cityRegion") ?? ""),
      country: String(data.get("country") ?? ""),
      workAuthorization: String(data.get("workAuthorization") ?? ""),
      linkedin: String(data.get("linkedin") ?? ""),
      referral: String(data.get("referral") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: consent === true,
    });
    const nextErrors: FieldErrors = {
      ...(parsed.success ? {} : issuesToFieldErrors(parsed.error)),
      ...validateScreeners(screeners, answers),
    };
    if (props.kind === "talent-network" && !serviceKey) {
      nextErrors.serviceLine = "Select a service line.";
    }
    const file = data.get("resume");
    if (!(file instanceof File) || file.size === 0) {
      nextErrors.resume = "Attach a résumé.";
    } else if (file.size > MAX_RESUME_BYTES) {
      nextErrors.resume = "Résumé must be 5 MB or smaller.";
    } else if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      nextErrors.resume = "Résumé must be a PDF, DOC, or DOCX file.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("Check the highlighted fields.");
      summaryRef.current?.focus();
      return;
    }
    setPending(true);
    setFormError(null);
    setErrors({});
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        body: data,
        headers: { accept: "application/json" },
      });
      const body = (await response.json()) as {
        ok: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };
      if (!response.ok || !body.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.message ?? "The application could not be sent.");
        summaryRef.current?.focus();
        setPending(false);
        return;
      }
      router.push(`/careers/thanks?for=${encodeURIComponent(title)}`);
    } catch {
      setFormError("The application could not be sent. Check your connection and try again.");
      summaryRef.current?.focus();
      setPending(false);
    }
  }

  return (
    <form id="apply" className="grid gap-5 rounded-xl border border-border bg-card p-5" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-xl font-semibold">Apply</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {props.kind === "job" ? props.job.title : "General application for future assignments."}{" "}
          Pay on a posting, when listed, is USD or CAD. Work authorization is for the country you select.
        </p>
      </div>
      {formError ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm"
        >
          <p>{formError}</p>
          {Object.keys(errors).length > 0 ? (
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>
                  <a href={`#${key}`} className="underline">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company website</label>
        <input id={`${formId}-company`} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="kind" value={props.kind} />
      {props.kind === "job" ? <input type="hidden" name="jobSlug" value={props.job.slug} /> : null}
      <input type="hidden" name="consent" value={consent ? "true" : "false"} />

      <Field id="fullName" label="Full name" required error={errors.fullName}>
        <Input id="fullName" name="fullName" autoComplete="name" required aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} className="h-11" />
      </Field>
      <Field id="email" label="Email" required error={errors.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="h-11" />
      </Field>
      <Field id="phone" label="Phone" required error={errors.phone}>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} className="h-11" />
      </Field>
      <Field id="cityRegion" label="City and region" required error={errors.cityRegion}>
        <Input id="cityRegion" name="cityRegion" autoComplete="address-level2" required aria-invalid={Boolean(errors.cityRegion)} aria-describedby={errors.cityRegion ? "cityRegion-error" : undefined} className="h-11" />
      </Field>
      <Field id="country" label="Country" required error={errors.country}>
        <NativeSelect
          id="country"
          name="country"
          value={country}
          required
          aria-invalid={Boolean(errors.country)}
          onChange={(event) => setCountry(event.target.value as CountryCode)}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </NativeSelect>
      </Field>
      <Field
        id="workAuthorization"
        label={`Work authorization for ${countryName(country)}`}
        required
        error={errors.workAuthorization}
      >
        <NativeSelect id="workAuthorization" name="workAuthorization" required defaultValue="" aria-invalid={Boolean(errors.workAuthorization)}>
          <option value="" disabled>
            Select one
          </option>
          {WORK_AUTH.map((value) => (
            <option key={value} value={value}>
              {WORK_AUTH_LABELS[value]}
            </option>
          ))}
        </NativeSelect>
      </Field>
      {props.kind === "talent-network" ? (
        <Field id="serviceLine" label="Service line" required error={errors.serviceLine} hint="Pick the closest line. Screening questions follow it.">
          <NativeSelect
            id="serviceLine"
            name="serviceLine"
            value={serviceKey}
            aria-invalid={Boolean(errors.serviceLine)}
            aria-describedby={described("serviceLine")}
            onChange={(event) => setServiceKey(event.target.value as ServiceSlug | "general")}
          >
            <option value="general">Multiple lines / not sure yet</option>
            {SERVICE_LINES.map((line) => (
              <option key={line} value={serviceSlug(line)}>
                {line}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}

      <fieldset className="grid gap-4 border-t border-border pt-4">
        <legend className="text-sm font-semibold">Role questions</legend>
        {screeners.map((screener) => {
          const id = `screener__${screener.id}`;
          return (
            <Field key={id} id={id} label={screener.label} required={screener.required} error={errors[id]}>
              {screener.type === "textarea" ? (
                <Textarea id={id} name={id} rows={3} aria-invalid={Boolean(errors[id])} aria-describedby={errors[id] ? `${id}-error` : undefined} />
              ) : (
                <Input
                  id={id}
                  name={id}
                  type={screener.type === "number" ? "number" : "text"}
                  inputMode={screener.type === "number" ? "decimal" : undefined}
                  min={screener.type === "number" ? 0 : undefined}
                  max={screener.type === "number" ? 60 : undefined}
                  step={screener.type === "number" ? "0.5" : undefined}
                  className="h-11"
                  aria-invalid={Boolean(errors[id])}
                  aria-describedby={errors[id] ? `${id}-error` : undefined}
                />
              )}
            </Field>
          );
        })}
      </fieldset>

      <Field
        id="resume"
        label="Résumé"
        required
        error={errors.resume}
        hint="PDF, DOC, or DOCX. 5 MB maximum."
      >
        {/* TODO [CONFIRM] virus-scanning provider. Type and size are checked; a malware scanner is not connected. */}
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
          className="h-11"
          aria-invalid={Boolean(errors.resume)}
          aria-describedby={errors.resume ? "resume-error resume-hint" : "resume-hint"}
        />
      </Field>
      <Field id="linkedin" label="LinkedIn" error={errors.linkedin} hint="Optional. Use a full https://linkedin.com profile URL.">
        <Input id="linkedin" name="linkedin" type="url" autoComplete="url" className="h-11" aria-invalid={Boolean(errors.linkedin)} aria-describedby="linkedin-hint" />
      </Field>
      <Field id="referral" label="How did you hear about Quad?" error={errors.referral}>
        <Input id="referral" name="referral" className="h-11" aria-invalid={Boolean(errors.referral)} />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <Textarea id="message" name="message" rows={4} aria-invalid={Boolean(errors.message)} />
      </Field>
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(value) => setConsent(value === true)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <div className="grid gap-1">
          <Label htmlFor="consent" className="items-start leading-snug">
            I agree that Quad Tech Solutions Inc. may use this information and my résumé for recruiting only.
            <span aria-hidden="true" className="text-accent">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </Label>
          {errors.consent ? (
            <p id="consent-error" className="text-sm text-destructive" role="alert">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>
      <Button type="submit" className="h-11" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
