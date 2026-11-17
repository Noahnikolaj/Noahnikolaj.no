import type { NextConfig } from "next";

import sizes from "./src/lib/image-sizes.json";

const nextConfig: NextConfig = {
  // Every page is built ahead of time and served by Cloudflare as plain
  // files, so no server code runs per request (and no Worker CPU is spent).
  output: "export",
  images: {
    // No image server: the sizes are made at build time, see imageLoader.ts.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: sizes.deviceSizes,
    imageSizes: sizes.imageSizes,
  },
};

export default nextConfig;
