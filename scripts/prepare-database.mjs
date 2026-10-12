import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function firstPostgresUrl(names) {
  for (const name of names) {
    const value = process.env[name]?.trim() ?? "";
    if (value.startsWith("postgres://") || value.startsWith("postgresql://")) return value;
  }
  return "";
}

const migrateUrl = firstPostgresUrl([
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
]);
const hosted = migrateUrl;

if (process.env.VERCEL && !hosted) {
  console.error(
    "Vercel builds require a Neon/Postgres URL. A SQLite file: DATABASE_URL is not allowed in production.",
  );
  process.exit(1);
}

const sqlitePath = path.join(root, "data", "portal.db");
const schema = hosted ? "prisma/postgres/schema.prisma" : "prisma/schema.prisma";
const env = {
  ...process.env,
  DATABASE_URL: hosted || `file:${sqlitePath}`,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING?.trim() || hosted,
  QTS_PREPARE_DB: "1",
};

if (!hosted) {
  fs.mkdirSync(path.join(root, "data"), { recursive: true });
}

function run(args, input) {
  const result = spawnSync("npx", args, {
    cwd: root,
    env,
    input,
    stdio: input ? ["pipe", "inherit", "inherit"] : "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(["prisma", "generate", "--schema", schema]);
run(["prisma", "migrate", "deploy", "--schema", schema]);
run(["tsx", "scripts/import-jobs.ts"]);
if (!hosted) {
  run(
    ["prisma", "db", "execute", "--stdin", "--schema", schema],
    "PRAGMA wal_checkpoint(TRUNCATE);",
  );
}
