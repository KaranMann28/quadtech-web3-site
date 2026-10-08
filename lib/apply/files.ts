export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export type ResumeFile = {
  filename: string;
  contentType: string;
  bytes: Buffer;
};

export function safeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "resume";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  return cleaned || "resume";
}

function extensionOf(filename: string): string {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? "";
}

function looksLikePdf(bytes: Buffer): boolean {
  return bytes.subarray(0, 5).toString("utf8") === "%PDF-";
}

function looksLikeOleDoc(bytes: Buffer): boolean {
  return (
    bytes.length > 8 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0
  );
}

function looksLikeDocx(bytes: Buffer): boolean {
  const isZip = bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) return false;
  const head = bytes.subarray(0, Math.min(bytes.length, 800_000)).toString("latin1");
  return head.includes("word/");
}

export function validateResume(
  file: { name: string; type: string; bytes: Buffer } | null,
): { ok: true; resume: ResumeFile } | { ok: false; message: string } {
  if (!file || file.bytes.length === 0) {
    return { ok: false, message: "Attach a résumé." };
  }
  if (file.bytes.length > MAX_RESUME_BYTES) {
    return { ok: false, message: "Résumé must be 5 MB or smaller." };
  }
  const filename = safeFilename(file.name);
  const extension = extensionOf(filename);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return { ok: false, message: "Résumé must be a PDF, DOC, or DOCX file." };
  }
  const matches =
    (extension === "pdf" && looksLikePdf(file.bytes)) ||
    (extension === "doc" && looksLikeOleDoc(file.bytes)) ||
    (extension === "docx" && looksLikeDocx(file.bytes));
  if (!matches) {
    return {
      ok: false,
      message: "That file does not match its extension. Upload a real PDF, DOC, or DOCX.",
    };
  }
  const contentType =
    extension === "pdf"
      ? "application/pdf"
      : extension === "doc"
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return { ok: true, resume: { filename, contentType, bytes: file.bytes } };
}
