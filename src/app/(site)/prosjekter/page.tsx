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
      <header className="mx-auto w-full max-w-6xl px-5 pb-6 pt-14 sm:px-8 md:pt-16">
        <h1 className="font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1]">
          Prosjekter
        </h1>
        <p className="mt-3 font-system text-base">
          fem ting, fra brukersentrert design til backend i praksis
        </p>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <ProjectIndex projects={projects} />
      </div>
    </main>
  );
}
