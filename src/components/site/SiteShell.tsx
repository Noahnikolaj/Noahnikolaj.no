import { TouchSpotlight } from "@/components/pixel/TouchSpotlight";
import { Footer } from "@/components/site/Footer";
import { PixelCursor } from "@/components/site/PixelCursor";
import { PowerOn } from "@/components/site/PowerOn";
import { SkipLink } from "@/components/site/SkipLink";
import { TiltKey } from "@/components/site/TiltKey";
import { WorldBackdrop } from "@/components/site/WorldBackdrop";
import { WorldFloor } from "@/components/site/WorldFloor";

/*
 * Chrome for every public page. Deliberately not in the root layout: the
 * /halloween route nests under that layout and must stay exactly as it is.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <WorldBackdrop />
      <PowerOn />
      <PixelCursor />
      <TiltKey />
      <TouchSpotlight />
      {/* Above the world, which is fixed at z-0. */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/*
         * Bottom room so the document can always scroll clear of the sticky
         * signpost. Mid-scroll it does float over content, the same tradeoff
         * every bottom nav makes; always-reachable nav is worth more here
         * than the few lines it passes over.
         */}
        <div className="flex-1">{children}</div>
        <Footer />
        <WorldFloor />
      </div>
    </div>
  );
}
