import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // The remaining PNGs are unoptimized originals; serve modern formats.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

// Makes Cloudflare bindings available during `next dev`.
initOpenNextCloudflareForDev();
