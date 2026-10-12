import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const POSTGRES_URL_NAMES = [
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function isPostgresUrl(value: string): boolean {
  return value.startsWith("postgres://") || value.startsWith("postgresql://");
}

function firstPostgresUrl(): string {
  for (const name of POSTGRES_URL_NAMES) {
    const value = process.env[name]?.trim() || "";
    if (isPostgresUrl(value)) return value;
  }
  return "";
}

/**
 * Hosted Vercel always uses Neon/Postgres. A leftover `file:` DATABASE_URL
 * is ignored. Local development still uses SQLite when no postgres URL exists.
 */
export function databaseUrl(): string {
  const hosted = firstPostgresUrl();
  if (hosted) return hosted;
  if (process.env.VERCEL) {
    throw new Error(
      "This deployment requires a Postgres URL (Neon). DATABASE_URL must not be a SQLite file path.",
    );
  }
  const raw = process.env.DATABASE_URL?.trim() || "file:./data/portal.db";
  if (isPostgresUrl(raw)) return raw;
  if (!raw.startsWith("file:")) {
    throw new Error("DATABASE_URL must be a postgres URL or a SQLite file: path.");
  }
  return writableSqliteUrl(resolveSqliteUrl(raw));
}

function resolveSqliteUrl(raw: string): string {
  if (raw.startsWith("file:") && !raw.startsWith("file:/") && !raw.startsWith("file://")) {
    const relative = raw.slice("file:".length);
    return `file:${path.resolve(/*turbopackIgnore: true*/ process.cwd(), relative)}`;
  }
  return raw;
}

function writableSqliteUrl(url: string): string {
  if (!url.startsWith("file:")) return url;
  if (process.env.NEXT_PHASE === "phase-production-build") return url;
  if (process.env.QTS_PREPARE_DB === "1") return url;
  return url;
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl() } },
    });
  }
  return globalForPrisma.prisma;
}

export async function resetPrisma(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }
}
