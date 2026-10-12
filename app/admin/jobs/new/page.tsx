import { JobEditor } from "@/components/admin/job-editor";
import { requireAdmin, redirectIfDenied } from "@/lib/admin/guard";

export default async function NewJobPage() {
  try {
    await requireAdmin();
  } catch (error) {
    redirectIfDenied(error);
    throw error;
  }
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Create post</h1>
      <JobEditor job={null} />
    </div>
  );
}
