import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure static export — no serverless functions, deploys as files to any CDN.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
