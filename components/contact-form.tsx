"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FieldErrors = Record<string, string>;

export function ContactForm() {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (formError) summaryRef.current?.focus();
  }, [formError]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setFormError(null);
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
        headers: { accept: "application/json" },
      });
      const body = (await response.json()) as {
        ok: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };
      if (!response.ok || !body.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.message ?? "The message could not be sent.");
        summaryRef.current?.focus();
        setPending(false);
        return;
      }
      setDone(true);
      form.reset();
    } catch {
      setFormError("The message could not be sent. Check your connection and try again.");
      summaryRef.current?.focus();
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="rounded-xl border border-border bg-card p-5">
        Message received. If a reply is needed, Quad will use the email you entered.
      </p>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {formError ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/50 p-3 text-sm text-destructive">
          {formError}
        </div>
      ) : null}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company website</label>
        <input id="contact-company" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">
          Name <span className="sr-only">(required)</span>
        </Label>
        <Input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} className="h-11" />
        {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-email">
          Email <span className="sr-only">(required)</span>
        </Label>
        <Input id="contact-email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} className="h-11" />
        {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-phone">Phone</Label>
        <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" className="h-11" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-message">
          Message <span className="sr-only">(required)</span>
        </Label>
        <Textarea id="contact-message" name="message" required rows={5} aria-invalid={Boolean(errors.message)} />
        {errors.message ? <p className="text-sm text-destructive">{errors.message}</p> : null}
      </div>
      <Button type="submit" className="h-11 w-fit px-4" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
