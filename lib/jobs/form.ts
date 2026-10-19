import { issuesToFieldErrors, type FieldErrors } from "@/lib/apply/schema";
import { jobFormSchema, type JobFormInput } from "@/lib/jobs/schema";
import { COUNTRIES, isCountryCode } from "@/lib/taxonomy";

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lines(form: FormData, key: string): string[] {
  return form
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

export function jobFormFromFormData(form: FormData): { data?: JobFormInput; fieldErrors?: FieldErrors } {
  const duration = text(form, "durationWeeks");
  const payListed = text(form, "payListed") === "yes";
  const closing = text(form, "closingDate");
  const travel = text(form, "travel");
  const note = text(form, "internalNote");
  const slug = text(form, "slug");
  const nice = lines(form, "niceToHave");
  const countries = form
    .getAll("workCountries")
    .map((value) => (typeof value === "string" ? value : ""))
    .filter((value) => (COUNTRIES as readonly string[]).includes(value));
  const workAuthorizationCountry = text(form, "workAuthorizationCountry");

  const raw = {
    title: text(form, "title"),
    serviceLine: text(form, "serviceLine"),
    industry: text(form, "industry"),
    location: {
      city: text(form, "city"),
      region: text(form, "region"),
      country: text(form, "country"),
      mode: text(form, "mode"),
    },
    workCountries: countries.length > 0 ? countries : undefined,
    workAuthorizationCountry: isCountryCode(workAuthorizationCountry)
      ? workAuthorizationCountry
      : undefined,
    type: text(form, "type"),
    durationWeeks: duration ? Number(duration) : undefined,
    payRange: payListed
      ? {
          min: Number(text(form, "payMin")),
          max: Number(text(form, "payMax")),
          currency: text(form, "payCurrency"),
          unit: text(form, "payUnit"),
        }
      : undefined,
    postedDate: text(form, "postedDate"),
    closingDate: closing || undefined,
    summary: text(form, "summary"),
    responsibilities: lines(form, "responsibilities"),
    requirements: lines(form, "requirements"),
    niceToHave: nice.length > 0 ? nice : undefined,
    travel: travel || undefined,
    internalNote: note || undefined,
    slug: slug || undefined,
  };

  const parsed = jobFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = issuesToFieldErrors(parsed.error);
    return { fieldErrors };
  }
  return { data: parsed.data };
}
