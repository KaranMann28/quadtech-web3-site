"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { AdminError, redirectIfDenied, requireAdmin } from "@/lib/admin/guard";
import { APPLICATION_STATUSES, setApplicationStatus, type ApplicationStatus } from "@/lib/applications/store";
import { jobFormFromFormData } from "@/lib/jobs/form";
import { publishCheck, revalidateJobPaths } from "@/lib/jobs/store";
import {
  archiveJob,
  createJob,
  duplicateJob,
  getJobByJobId,
  setJobStatus,
  updateJob,
} from "@/lib/jobs/store";
import { jobSchema } from "@/lib/jobs/schema";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  savedAt?: number;
};

function failure(error: unknown): ActionState {
  unstable_rethrow(error);
  redirectIfDenied(error);
  if (error instanceof AdminError) return { ok: false, message: error.message };
  const message = error instanceof Error ? error.message : "The post could not be saved.";
  if (message.includes("TODO [CONFIRM]") || message.includes("placeholder posted date")) {
    return { ok: false, message };
  }
  return { ok: false, message };
}

export async function saveJob(_prev: ActionState, form: FormData): Promise<ActionState> {
  let actor = "";
  try {
    actor = await requireAdmin();
  } catch (error) {
    return failure(error);
  }

  const parsed = jobFormFromFormData(form);
  if (!parsed.data) return { ok: false, message: "Check the highlighted fields.", fieldErrors: parsed.fieldErrors };

  const intent = String(form.get("intent") ?? "save");
  const jobId = String(form.get("jobId") ?? "");

  try {
    if (!jobId) {
      if (intent === "publish") {
        const probe = jobSchema.parse({
          ...parsed.data,
          slug: parsed.data.slug || "pending",
          jobId: "QT-JOB-2000-001",
          status: "published",
        });
        const check = publishCheck(probe);
        if (check) return { ok: false, message: check };
      }
      const created = await createJob(parsed.data, actor);
      if (intent === "publish") {
        const published = await setJobStatus(created.jobId, "published", actor);
        await revalidateJobPaths(published.slug, published.previousSlugs);
      }
      redirect(`/admin/jobs/${created.jobId}`);
    }

    const current = await getJobByJobId(jobId);
    if (!current) return { ok: false, message: "Post not found." };
    const nextStatus =
      intent === "publish" ? "published" : intent === "close" ? "closed" : intent === "unpublish" ? "draft" : current.status;
    if (nextStatus === "published") {
      const draft = jobSchema.parse({ ...parsed.data, slug: current.slugLocked ? current.slug : parsed.data.slug || current.slug, jobId, status: "published" });
      const check = publishCheck(draft);
      if (check) return { ok: false, message: check };
    }
    const saved = await updateJob(jobId, parsed.data, actor, nextStatus);
    await revalidateJobPaths(saved.slug, saved.previousSlugs);
    const message = intent === "save" ? "Saved." : nextStatus === "published" ? "Published." : nextStatus === "closed" ? "Closed." : "Saved.";
    return { ok: true, message, savedAt: Date.now() };
  } catch (error) {
    unstable_rethrow(error);
    return failure(error);
  }
}

export async function lifecycleAction(form: FormData): Promise<void> {
  const actor = await requireAdmin().catch((error) => {
    redirectIfDenied(error);
    throw error;
  });
  const jobId = String(form.get("jobId") ?? "");
  const intent = String(form.get("intent") ?? "");
  const current = await getJobByJobId(jobId);
  if (!current) redirect("/admin/jobs");
  if (intent === "duplicate") {
    const copy = await duplicateJob(jobId, actor);
    redirect(`/admin/jobs/${copy.jobId}`);
  }
  if (intent === "archive") {
    await archiveJob(jobId, actor);
    await revalidateJobPaths(current.slug, current.previousSlugs);
    redirect("/admin/jobs");
  }
  if (intent === "publish") {
    const check = publishCheck({ ...current, status: "published" });
    if (check) redirect(`/admin/jobs/${jobId}?error=${encodeURIComponent(check)}`);
    const saved = await setJobStatus(jobId, "published", actor);
    await revalidateJobPaths(saved.slug, saved.previousSlugs);
  } else if (intent === "unpublish") {
    const saved = await setJobStatus(jobId, "draft", actor);
    await revalidateJobPaths(saved.slug, saved.previousSlugs);
  } else if (intent === "close") {
    const saved = await setJobStatus(jobId, "closed", actor);
    await revalidateJobPaths(saved.slug, saved.previousSlugs);
  }
  redirect("/admin/jobs");
}

export async function applicationStatusAction(form: FormData): Promise<void> {
  await requireAdmin().catch((error) => {
    redirectIfDenied(error);
    throw error;
  });
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!(APPLICATION_STATUSES as readonly string[]).includes(status)) {
    redirect(`/admin/applications/${id}`);
  }
  await setApplicationStatus(id, status as ApplicationStatus);
  redirect(`/admin/applications/${id}`);
}
