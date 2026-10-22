import { FlipWorklet } from "@/components/pixel/FlipWorklet";
import { FlipLinks } from "@/components/site/FlipLinks";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";
import { WorldStrip } from "@/components/site/WorldStrip";

/*
 * Chrome for every public page. Deliberately not in the root layout: the
 * /halloween route nests under that layout and must stay exactly as it is.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <FlipWorklet />
      <FlipLinks />
      {/* Above the room wash and the sky, which are fixed at z-0. */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/*
         * Bottom room so the document can always scroll clear of the sticky
         * signpost. Mid-scroll it does float over content, the same tradeoff
         * every bottom nav makes; always-reachable nav is worth more here
         * than the few lines it passes over.
         */}
        <div className="flex-1">{children}</div>
        <Footer />
        <WorldStrip />
      </div>
    </div>
  );
}
