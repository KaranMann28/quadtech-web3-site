import { notFound } from "next/navigation";
import { JobEditor, type EditorJob } from "@/components/admin/job-editor";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";
import { getJobByJobId, type JobRecord } from "@/lib/jobs/store";

function toEditor(job: JobRecord): EditorJob {
  return {
    jobId: job.jobId,
    slug: job.slug,
    slugLocked: job.slugLocked,
    createdBy: job.createdBy,
    updatedBy: job.updatedBy,
    title: job.title,
    serviceLine: job.serviceLine,
    industry: job.industry,
    location: job.location,
    workCountries: job.workCountries,
    type: job.type,
    durationWeeks: job.durationWeeks,
    payRange: job.payRange,
    postedDate: job.postedDate,
    closingDate: job.closingDate,
    summary: job.summary,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    niceToHave: job.niceToHave,
    travel: job.travel,
    internalNote: job.internalNote,
  };
}

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }
  const { id } = await params;
  const query = await searchParams;
  const job = await getJobByJobId(id);
  if (!job) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit post</h1>
      <JobEditor job={toEditor(job)} serverError={query.error} />
    </div>
  );
}
