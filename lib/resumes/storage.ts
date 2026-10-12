import fs from "node:fs";
import path from "node:path";
import { getPrisma } from "@/lib/db";

const LOCAL_ROOT = path.join(process.cwd(), "data", "resumes");

export type StoredResume = {
  key: string;
  filename: string;
  contentType: string;
  bytes: Buffer;
};

function localPath(id: string): string {
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(id)) {
    throw new Error("Invalid résumé id.");
  }
  return path.join(LOCAL_ROOT, id);
}

export function useDatabaseResumeStore(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return false;
  return Boolean(process.env.VERCEL) || process.env.QTS_RESUME_IN_DB === "1";
}

/**
 * Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
 * On Vercel without Blob, bytes are stored on the Application row in Postgres.
 * Local development writes to data/resumes/ unless QTS_RESUME_IN_DB=1.
 */
export async function storeResume(id: string, bytes: Buffer, contentType: string): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (token) {
    const { put } = await import("@vercel/blob");
    const pathname = `resumes/${id}`;
    await put(pathname, bytes, {
      access: "private",
      token,
      contentType,
      addRandomSuffix: false,
    });
    return `blob:${pathname}`;
  }
  if (useDatabaseResumeStore()) {
    return `db:${id}`;
  }
  fs.mkdirSync(LOCAL_ROOT, { recursive: true });
  fs.writeFileSync(localPath(id), bytes);
  return `local:${id}`;
}

export async function readResume(key: string, bytesFromRow?: Uint8Array | null): Promise<Buffer> {
  if (key.startsWith("blob:")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (!token) throw new Error("Blob storage is not configured.");
    const { get } = await import("@vercel/blob");
    const result = await get(key.slice("blob:".length), { access: "private", token });
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error("Résumé file was not found.");
    }
    const reader = result.stream.getReader();
    const chunks: Buffer[] = [];
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      chunks.push(Buffer.from(next.value));
    }
    return Buffer.concat(chunks);
  }
  if (key.startsWith("db:")) {
    if (bytesFromRow && bytesFromRow.length > 0) return Buffer.from(bytesFromRow);
    const id = key.slice("db:".length);
    const row = await getPrisma().application.findUnique({
      where: { id },
      select: { resumeBytes: true },
    });
    if (!row?.resumeBytes) throw new Error("Résumé file was not found.");
    return Buffer.from(row.resumeBytes);
  }
  if (!key.startsWith("local:")) throw new Error("Unknown résumé storage key.");
  const file = localPath(key.slice("local:".length));
  if (!file.startsWith(LOCAL_ROOT)) throw new Error("Invalid résumé path.");
  return fs.readFileSync(file);
}

export function resumeRoot(): string {
  return LOCAL_ROOT;
}
