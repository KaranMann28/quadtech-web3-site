import type { NextConfig } from "next";

const sqliteTrace = ["./data/portal.db"];

const nextConfig: NextConfig = {
  // The dev server is opened at http://127.0.0.1, which Next treats as a
  // cross-origin host unless it is listed here. Required for hydration.
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  // The build writes data/portal.db. Serverless functions need that file
  // so public pages can read published jobs. Writes still go to /tmp.
  outputFileTracingIncludes: {
    "/**": sqliteTrace,
    "/*": sqliteTrace,
    "/": sqliteTrace,
  },
};

export default nextConfig;
