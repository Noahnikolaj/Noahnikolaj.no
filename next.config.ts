import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The remaining PNGs are unoptimized originals; serve modern formats.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
