import type { Metadata } from "next";
import Image from "next/image";

import { PixelButton } from "@/components/site/PixelButton";
import { bio, education, experience } from "@/content/cv";
import { SkillsSection } from "./_components/SkillsSection";
import { TimelineEntry } from "./_components/TimelineEntry";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV for Noah Klavestad-Christensen: erfaring, utdanning og verktøy. Masterstudent i Human Computer Interaction ved Høyskolen Kristiania.",
};

export default function CvPage() {
  return (
    <main id="hovedinnhold">
      <div className="mx-auto my-10 w-full max-w-3xl border-4 border-foreground bg-background px-5 py-14 sm:my-14 sm:px-10">
        <header className="flex flex-col gap-7 sm:flex-row sm:items-end">
          <Image
            src="/andreprofil.png"
            alt="Noah Klavestad-Christensen"
            width={488}
            height={512}
            priority
            className="w-32 shrink-0 border-4 border-foreground bg-secondary object-cover"
          />
          <div>
            <h1 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05]">
              {bio.name}
            </h1>
            <p className="mt-2 text-lg font-bold text-accent">{bio.title}</p>
          </div>
        </header>

        <p className="mt-7 text-lg leading-relaxed">{bio.intro}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <PixelButton href="/prosjekter">Se prosjektene</PixelButton>
          <PixelButton href="mailto:noahnikolaj.c@gmail.com" variant="papir">
            Kontakt meg
          </PixelButton>
        </div>

        <div className="mt-16 space-y-16">
          <section aria-labelledby="erfaring">
            <h2 id="erfaring" className="font-display text-2xl sm:text-3xl">
              Erfaring
            </h2>
            <ul className="mt-8">
              {experience.map((entry, index) => (
                <TimelineEntry
                  key={`${entry.organisation}-${entry.period}`}
                  index={index}
                  heading={entry.organisation}
                  subheading={entry.role}
                  period={entry.period}
                  description={entry.summary}
                  bullets={entry.bullets}
                />
              ))}
            </ul>
          </section>

          <section aria-labelledby="utdanning">
            <h2 id="utdanning" className="font-display text-2xl sm:text-3xl">
              Utdanning
            </h2>
            <ul className="mt-8">
              {education.map((entry, index) => (
                <TimelineEntry
                  key={entry.institution}
                  index={index}
                  heading={entry.institution}
                  subheading={entry.degree}
                  period={entry.period}
                  description={entry.description}
                />
              ))}
            </ul>
          </section>

          <SkillsSection />
        </div>
      </div>
    </main>
  );
}
