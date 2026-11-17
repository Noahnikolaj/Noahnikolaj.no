import type { Metadata } from "next";
import Image from "next/image";

import { PixelButton } from "@/components/site/PixelButton";
import { bio, education, experience } from "@/content/cv";
import { LevelMap, type Level } from "./_components/LevelMap";
import { PrintCv } from "./_components/PrintCv";
import { SkillsSection } from "./_components/SkillsSection";
import { TimelineEntry } from "./_components/TimelineEntry";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV for Noah Klavestad-Christensen: erfaring, utdanning og verktøy. Masterstudent i Human Computer Interaction ved Høyskolen Kristiania.",
};

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, mai: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, des: 11,
};

/** "aug. 2025 – jun. 2027" -> the two dates it runs between. */
function dateOf(part: string) {
  const [mon, year] = part.trim().replace(".", "").split(/\s+/);
  return new Date(Number(year), MONTHS[mon?.toLowerCase()] ?? 0, 28);
}
const startOf = (period: string) => dateOf(period.split("–")[0] ?? "");
const endOf = (period: string) => dateOf(period.split("–").pop() ?? "");

const anchor = (name: string) =>
  "niva-" +
  name
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* Short names and landmarks for the map; full names are in the entries. */
const MAP: Record<string, { name: string; place: Level["place"] }> = {
  "Universitetet i Oslo (UiO)": { name: "UiO", place: "uio" },
  "Høyskolen Kristiania": { name: "Kristiania", place: "kristiania" },
  "Korea University": { name: "Korea", place: "korea" },
  "Welcome Workdays": { name: "Welcome", place: "kontor" },
};

/*
 * Every entry as a level, in the order they started. Built from the CV
 * content at build time, so the map can never disagree with the entries.
 * The one still running is where Noah stands.
 */
function levelsFrom(today: Date): Level[] {
  const all = [
    ...experience.map((e) => ({ name: e.organisation, period: e.period })),
    ...education.map((e) => ({ name: e.institution, period: e.period })),
  ].map((e) => ({ ...e, start: startOf(e.period), end: endOf(e.period) }));
  all.sort((a, b) => a.start.getTime() - b.start.getTime());
  return all.map((e) => ({
    id: anchor(e.name),
    name: MAP[e.name]?.name ?? e.name,
    place: MAP[e.name]?.place ?? "kontor",
    current: e.end > today,
  }));
}

export default function CvPage() {
  const levels = levelsFrom(new Date());

  return (
    <main id="hovedinnhold">
      <div className="mx-auto my-10 w-[calc(100%-1.5rem)] max-w-3xl px-2 py-10 sm:my-14 sm:px-4">
        <header className="flex flex-col gap-7 sm:flex-row sm:items-end">
          <Image
            src="/andreprofil.png"
            alt="Noah Klavestad-Christensen"
            width={488}
            height={512}
            priority
            className="ps-frame w-32 shrink-0 object-cover"
          />
          <div>
            <h1 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05]">
              {bio.name}
            </h1>
            <p className="mt-2 text-lg font-bold">{bio.title}</p>
          </div>
        </header>

        <p className="bracket-text mt-7 text-lg leading-relaxed">{bio.intro}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PixelButton href="/prosjekter">Se prosjektene</PixelButton>
          <PixelButton href="mailto:noahnikolaj.c@gmail.com" variant="papir">
            Kontakt meg
          </PixelButton>
          <PrintCv />
        </div>

        <LevelMap levels={levels} />

        <div className="mt-14 space-y-16">
          <section aria-labelledby="erfaring">
            <h2 id="erfaring" className="tag-title font-display text-2xl sm:text-3xl">
              Erfaring
            </h2>
            <div aria-hidden="true" className="hatch-rule" />
            <ul className="mt-2">
              {experience.map((entry, index) => (
                <TimelineEntry
                  key={`${entry.organisation}-${entry.period}`}
                  index={index}
                  heading={entry.organisation}
                  subheading={entry.role}
                  period={entry.period}
                  description={entry.summary}
                  bullets={entry.bullets}
                  id={anchor(entry.organisation)}
                />
              ))}
            </ul>
          </section>

          <section aria-labelledby="utdanning">
            <h2 id="utdanning" className="tag-title font-display text-2xl sm:text-3xl">
              Utdanning
            </h2>
            <div aria-hidden="true" className="hatch-rule" />
            <ul className="mt-2">
              {education.map((entry, index) => (
                <TimelineEntry
                  key={entry.institution}
                  index={index}
                  heading={entry.institution}
                  subheading={entry.degree}
                  period={entry.period}
                  description={entry.description}
                  id={anchor(entry.institution)}
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
