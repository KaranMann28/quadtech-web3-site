const JOB_ID = /^QT-JOB-(\d{4})-(\d{3})$/;

export function nextJobId(existingIds: readonly string[], now = new Date()): string {
  const year = now.getUTCFullYear();
  let max = 0;
  for (const id of existingIds) {
    const match = JOB_ID.exec(id);
    if (!match) continue;
    if (Number(match[1]) !== year) continue;
    max = Math.max(max, Number(match[2]));
  }
  const next = max + 1;
  if (next > 999) {
    throw new Error(`Job ID sequence for ${year} is full (QT-JOB-${year}-999).`);
  }
  return `QT-JOB-${year}-${String(next).padStart(3, "0")}`;
}

export function slugifyTitle(title: string): string {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48)
    .replace(/-+$/g, "");
  return base || "role";
}

/** Title plus the job id suffix, for example field-test-engineer-2026-014. */
export function slugFromTitle(title: string, jobId: string): string {
  const suffix = jobId.replace(/^QT-JOB-/i, "").toLowerCase();
  return `${slugifyTitle(title)}-${suffix}`;
}
