"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  applicationSchema,
  issuesToFieldErrors,
  type FieldErrors,
} from "@/lib/apply/schema";
import type { PublicJob } from "@/lib/jobs/schema";
import { countryName } from "@/lib/taxonomy";

type Props =
  | { kind: "job"; job: PublicJob }
  | { kind: "talent-network" };

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function resumeProblem(file: File | null): string | null {
  if (!file || file.size === 0) return "Attach a résumé.";
  if (file.size > MAX_RESUME_BYTES) return "Résumé must be 5 MB or smaller.";
  if (!/\.(pdf|doc|docx)$/i.test(file.name)) return "Résumé must be a PDF, DOC, or DOCX file.";
  return null;
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {label}
        {optional ? <span className="text-muted-foreground"> (optional)</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (formError) summaryRef.current?.focus();
  }, [formError]);

  const title = props.kind === "job" ? props.job.title : "Talent network";
  const authCountry = props.kind === "job" ? countryName(props.job.location.country) : null;

  function pickResume(file: File | null) {
    setResumeFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file && fileInputRef.current) {
      // Keep the real input in sync so FormData picks the dropped file up.
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;
    }
    pickResume(file);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = applicationSchema.safeParse({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      linkedin: String(data.get("linkedin") ?? ""),
    });
    const nextErrors: FieldErrors = parsed.success ? {} : issuesToFieldErrors(parsed.error);
    if (props.kind === "job") {
      const auth = String(data.get("workAuthorization") ?? "");
      if (auth !== "yes" && auth !== "no") nextErrors.workAuthorization = "Select yes or no.";
    }
    const resumeError = resumeProblem(resumeFile);
    if (resumeError) nextErrors.resume = resumeError;

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
    <form
      id="apply"
      className="grid gap-4 rounded-xl border border-border bg-card p-5"
      onSubmit={onSubmit}
      noValidate
    >
      <div>
        <h2 className="text-xl font-semibold">{props.kind === "job" ? "Apply for this job" : "Apply"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {props.kind === "job"
            ? "Takes under a minute. Name, email, and résumé are all that is required."
            : "A general application for future assignments. Name, email, and résumé are all that is required."}
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
                <li key={key}>{message}</li>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="h-11"
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="h-11"
          />
        </Field>
      </div>
      <Field id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11"
        />
      </Field>
      <Field id="phone" label="Phone" optional error={errors.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="h-11"
        />
      </Field>

      <div className="grid gap-1.5">
        <Label htmlFor="resume">
          Résumé<span className="sr-only"> (required)</span>
        </Label>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-lg border border-dashed p-4 text-center transition-colors ${
            dragging ? "border-accent bg-accent/10" : "border-input bg-background/40"
          } ${errors.resume ? "border-destructive" : ""}`}
        >
          <input
            ref={fileInputRef}
            id="resume"
            name="resume"
            type="file"
            accept={RESUME_ACCEPT}
            required
            className="sr-only"
            aria-invalid={Boolean(errors.resume)}
            aria-describedby={errors.resume ? "resume-error resume-hint" : "resume-hint"}
            onChange={(event) => pickResume(event.target.files?.[0] ?? null)}
          />
          {resumeFile ? (
            <div className="flex items-center justify-between gap-3 text-left">
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <FileText className="size-4 shrink-0 text-accent" aria-hidden />
                <span className="truncate">{resumeFile.name}</span>
                <span className="shrink-0 text-muted-foreground">{formatBytes(resumeFile.size)}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove the selected résumé"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  pickResume(null);
                }}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
          ) : (
            <div className="grid justify-items-center gap-2">
              <Upload className="size-5 text-muted-foreground" aria-hidden />
              <p className="text-sm">
                Drag your résumé here, or{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm text-accent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse files
                </Button>
              </p>
            </div>
          )}
        </div>
        <p id="resume-hint" className="text-xs text-muted-foreground">
          PDF, DOC, or DOCX, up to 5 MB.
        </p>
        {errors.resume ? (
          <p id="resume-error" className="text-sm text-destructive" role="alert">
            {errors.resume}
          </p>
        ) : null}
      </div>

      <Field id="linkedin" label="LinkedIn" optional error={errors.linkedin}>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          autoComplete="url"
          placeholder="https://linkedin.com/in/…"
          aria-invalid={Boolean(errors.linkedin)}
          aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
          className="h-11"
        />
      </Field>

      {props.kind === "job" ? (
        <fieldset
          className="grid gap-2"
          aria-invalid={Boolean(errors.workAuthorization)}
          aria-describedby={errors.workAuthorization ? "workAuthorization-error" : undefined}
        >
          <legend className="text-sm font-medium">
            Are you authorized to work in {authCountry}?
          </legend>
          <div className="flex gap-6" id="workAuthorization">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="workAuthorization" value="yes" required className="size-4 accent-accent" />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="workAuthorization" value="no" className="size-4 accent-accent" />
              No
            </label>
          </div>
          {errors.workAuthorization ? (
            <p id="workAuthorization-error" className="text-sm text-destructive" role="alert">
              {errors.workAuthorization}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <Button type="submit" className="h-11" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Submit application"}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting this application, you agree that Quad Tech Solutions Inc. may store this
        information and your résumé and contact you about roles. Nothing else is done with it.
      </p>
    </form>
  );
}
