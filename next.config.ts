import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module only used in local dev (see src/lib/prisma.ts);
  // keep it out of the serverless bundle instead of letting the bundler trace it.
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    serverActions: {
      // Default is 1MB. Listings allow up to 6 photos at 8MB each
      // (see MAX_IMAGES in src/app/admin/listings/actions.ts), so this
      // covers the worst case with headroom for multipart overhead.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
