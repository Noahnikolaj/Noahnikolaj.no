import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered at build time and nothing revalidates, so the
// read-only cache from static assets is enough; no KV or R2 needed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
