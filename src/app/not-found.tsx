import { PixelButton } from "@/components/site/PixelButton";
import { SiteShell } from "@/components/site/SiteShell";
import { Sprite } from "@/components/pixel/Sprite";
import { NOAH } from "@/components/pixel/sprites";

/*
 * Root-level by Next's convention, so it wraps itself in SiteShell: the
 * (site) route group layout does not apply here.
 *
 * Served for every missing path, so it also carries the one redirect the
 * site has: /Halloween, as printed on the invitations, to /halloween. Paths
 * are case-sensitive and the site is static files with no server to
 * redirect, so the page does it before it paints.
 */
const HALLOWEEN = `if(location.pathname==="/Halloween")location.replace("/halloween"+location.search+location.hash)`;

export default function NotFound() {
  return (
    <SiteShell>
      <script dangerouslySetInnerHTML={{ __html: HALLOWEEN }} />
      <main
        id="hovedinnhold"
        className="room-enter mx-auto my-16 flex w-[calc(100%-1.5rem)] max-w-3xl flex-col items-start px-5 py-14 ps-panel sm:px-10"
      >
        <Sprite sprite={NOAH} scale={10} decorative />

        <h1 className="mt-8 font-display text-[clamp(2rem,8vw,3.5rem)] leading-[1.05]">
          Denne siden finnes ikke
        </h1>
        <p className="mt-4 text-lg leading-relaxed">
          Lenken peker et sted det ikke er noe. Prøv prosjektene i stedet, eller
          gå tilbake til forsiden.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <PixelButton href="/prosjekter">Se prosjektene</PixelButton>
          <PixelButton href="/" variant="papir">
            Til forsiden
          </PixelButton>
        </div>
      </main>
    </SiteShell>
  );
}
