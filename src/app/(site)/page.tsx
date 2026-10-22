import Image from "next/image";

import { PixelButton } from "@/components/site/PixelButton";
import { ProjectTile } from "@/components/site/ProjectTile";
import { ScrollCompanions } from "@/components/pixel/ScrollCompanions";
import { featuredProjects } from "@/content/projects";

export default function HomePage() {
  return (
    <main id="hovedinnhold">
      {/*
        The hero opens with the most characteristic thing Noah makes: pixel art
        he wrote by hand in code. The sprites below are his own, lifted out of
        the Game Boy game and redrawn as SVG.
      */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 px-5 pb-0 pt-16 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-14 md:pt-24">
          <div>
          <p className="mb-3 text-lg font-medium text-muted-foreground">
            Hei, jeg er
          </p>
          {/* The name the site is actually known by, matching the domain. */}
          <h1 className="font-display text-[clamp(3rem,12vw,6.5rem)] leading-[0.92]">
            <span className="block">Noah</span>
            <span className="block">Nikolaj</span>
          </h1>

          <p className="mt-7 text-lg leading-relaxed sm:text-xl">
            Jeg designer og koder. For tiden masterstudent i Human Computer
            Interaction ved Høyskolen Kristiania, med en bachelor i informatikk
            fra UiO og praksis som fullstack-utvikler bak meg.
          </p>

          <div className="mt-9 flex flex-wrap gap-4 pb-14">
            <PixelButton href="/prosjekter" size="lg">
              Se prosjektene
            </PixelButton>
            <PixelButton href="/cv" variant="papir" size="lg">
              Les CV-en
            </PixelButton>
          </div>
          </div>

          {/*
            Noah himself, so the first thing on the page is a person rather
            than only type. He sits in a pink pixel cloud drawn from the same
            shapes as the ones drifting behind him, not a square frame.
          */}
          <div className="relative mx-auto w-full max-w-[18rem] mb-14 md:mb-0 md:mx-0 md:max-w-sm md:justify-self-end">
            <div
              aria-hidden="true"
              className="pixel-cloud-shadow absolute inset-x-0 bottom-[2%] top-[14%]"
            />
            <div
              aria-hidden="true"
              className="pixel-cloud absolute inset-x-0 bottom-[4%] top-[12%]"
            />
            <Image
              src="/Profpic.png"
              alt="Noah Nikolaj, portrett"
              width={515}
              height={512}
              priority
              sizes="(max-width: 768px) 62vw, 21rem"
              className="relative mx-auto w-[86%]"
            />
          </div>
        </div>

        {/* The ground. 1-bit dithering ramps the pink the way pixel art shades. */}
        <div id="bakken" className="relative z-10 h-28 w-full sm:h-32">
          <div aria-hidden="true" className="dither-25 absolute inset-x-0 top-0 h-1/4" />
          <div aria-hidden="true" className="dither-50 absolute inset-x-0 top-1/4 h-1/4" />
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1/2 bg-grunn" />

          {/* The one pair of characters live here until the band scrolls away. */}
          <ScrollCompanions />
        </div>
      </section>

      <section
        aria-labelledby="utvalgte"
        className="border-t-4 border-foreground bg-secondary"
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 md:py-20">
          <h2
            id="utvalgte"
            className="font-display text-3xl text-secondary-foreground sm:text-4xl"
          >
            Tre ting jeg har laget
          </h2>

          <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectTile
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </ul>

          <div className="mt-12">
            <PixelButton href="/prosjekter" size="lg">
              Alle fem prosjektene
            </PixelButton>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <Image
            src="/andreprofil.png"
            alt="Noah Klavestad-Christensen"
            width={488}
            height={512}
            className="w-32 border-4 border-foreground bg-secondary object-cover sm:w-40"
          />
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              Kort om meg
            </h2>
            <p className="mt-3 leading-relaxed">
              Jeg er mest interessert i det som skjer mellom folk og grensesnitt:
              VR og AR, kunstig intelligens, og hvordan slike systemer kan bli
              mer tilgjengelige. Jeg bygger også ting som ikke har noen god
              grunn til å finnes, som et fnaf mini games.
            </p>
            <div className="mt-6">
              <PixelButton href="mailto:noahnikolaj.c@gmail.com" variant="lys">
                Send meg en e-post
              </PixelButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
