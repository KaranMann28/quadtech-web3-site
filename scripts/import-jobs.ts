import { loadSeedJobs } from "@/lib/jobs/load";
import { importSeedJobs } from "@/lib/jobs/store";

async function main() {
  const jobs = loadSeedJobs();
  const result = await importSeedJobs(jobs);
  console.log(
    `Inserted ${result.inserted.length} (${result.inserted.join(", ") || "none"}). Skipped ${result.skipped.length} (${result.skipped.join(", ") || "none"}).`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Import failed.";
  console.error(message);
  process.exit(1);
});
