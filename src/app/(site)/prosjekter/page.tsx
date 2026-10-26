import type { Metadata } from "next";

import { ProjectIndex } from "@/components/site/ProjectIndex";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Prosjekter",
  description:
    "Prosjekter av Noah Klavestad-Christensen: integreringsapp, sosial plattform for barn, musikkdagbok, nettleserspill og backend-arbeid fra praksis.",
};

export default function ProsjekterPage() {
  return (
    <main id="hovedinnhold">
      {/* Sky over the title, then you come down to ground for the work. */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-16 sm:px-8 md:pt-20">
          <h1 className="font-display text-[clamp(2.25rem,8vw,4rem)] leading-[1]">
            Prosjekter
          </h1>
          <p className="mt-5 text-lg leading-relaxed">
            Fem ting, fra brukersentrert design og prototyping til backend i
            praksis. Trykk på et prosjekt for å lese hele historien.
          </p>
        </div>
        <div aria-hidden="true" className="dither-25 relative z-10 h-4 w-full" />
        <div aria-hidden="true" className="dither-50 relative z-10 h-3 w-full" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-14 sm:px-8">
        <ProjectIndex projects={projects} />
      </div>
    </main>
  );
}
