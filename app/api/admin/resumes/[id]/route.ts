import { NextResponse } from "next/server";
import { AdminError, requireAdmin } from "@/lib/admin/guard";
import { applicationResume } from "@/lib/applications/store";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AdminError ? error.status : 401;
    return NextResponse.json({ ok: false, message: "Sign in required." }, { status });
  }
  const { id } = await context.params;
  const file = await applicationResume(id);
  if (!file) return NextResponse.json({ ok: false, message: "Résumé not found." }, { status: 404 });
  const filename = file.filename.replace(/[^\w.\- ]+/g, "_");
  return new NextResponse(new Uint8Array(file.bytes), {
    headers: {
      "content-type": file.contentType,
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
