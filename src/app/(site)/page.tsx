import Image from "next/image";
import Link from "next/link";

import { HeroPortrait } from "@/components/site/HeroPortrait";
import { PixelButton } from "@/components/site/PixelButton";
import { TitleScreen } from "@/components/site/TitleScreen";
import { Cartridge } from "@/components/site/Cartridge";
import { projects } from "@/content/projects";

/*
 * Four on the home page, so they line up: four across on a desktop, two by
 * two on a phone. Finding Denji sits out here, since it is a game you play
 * on its own page rather than a project you read about.
 */
const HOME_CARTS = projects.filter((project) => project.slug !== "denji").slice(0, 4);

export default function HomePage() {
  return (
    <main id="hovedinnhold">
      <TitleScreen />
      {/*
        The hero opens with the most characteristic thing Noah makes: pixel art
        he wrote by hand in code. The sprites below are his own, lifted out of
        the Game Boy game and redrawn as SVG.
      */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-4 px-5 pb-0 pt-8 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-14 md:pt-24">
          {/*
            The power-on order, top to bottom: each piece lands one beat after
            the one above it. See the slam rules in globals.css.
          */}
          <div>
          <p
            className="slam mb-3 text-lg font-medium text-muted-foreground"
            style={{ ["--slam" as string]: 0 }}
          >
            Hei, jeg er
          </p>
          {/* The name the site is actually known by, matching the domain. */}
          <h1
            className="slam font-display text-[clamp(2.4rem,10vw,5.25rem)] leading-[0.92]"
            style={{ ["--slam" as string]: 1 }}
          >
            <span className="block">Noah</span>
            <span className="block">Nikolaj</span>
          </h1>

          <p
            className="slam mt-7 text-lg leading-relaxed sm:text-xl"
            style={{ ["--slam" as string]: 2 }}
          >
            Jeg designer og koder. For tiden masterstudent i Human Computer
            Interaction ved Høyskolen Kristiania, med en bachelor i informatikk
            fra UiO og praksis som fullstack-utvikler bak meg.
          </p>

          <div
            className="slam mt-9 flex flex-wrap gap-4 pb-14"
            style={{ ["--slam" as string]: 3 }}
          >
            <PixelButton href="/prosjekter" size="lg" companion="noah">
              Se prosjektene
            </PixelButton>
            <PixelButton href="/cv" variant="papir" size="lg" companion="denji">
              Les CV-en
            </PixelButton>
          </div>
          </div>

          {/*
            Noah himself, so the first thing on the page is a person rather
            than only type. He stands out of the world in depth, turning to
            follow the pointer.
          */}
          <div
            className="slam relative order-first mx-auto w-full max-w-[12.5rem] md:order-none md:mx-0 md:max-w-sm md:justify-self-end"
            style={{ ["--slam" as string]: 4 }}
          >
            <HeroPortrait />
          </div>
        </div>

        {/*
          No ground band here any more: the floor at the foot of the screen
          is the ground now, and Noah stands on it. See WorldFloor.tsx.
        */}
      </section>

      <section
        aria-labelledby="utvalgte"
        className="mx-auto w-full max-w-5xl px-3 sm:px-5"
      >
        <div className="ps-panel px-5 py-14 sm:px-8 md:py-16">
          <h2
            id="utvalgte"
            className="font-display text-3xl text-secondary-foreground sm:text-4xl"
          >
            Fire ting jeg har laget
          </h2>

          {/*
            Each cartridge goes straight into the machine on Prosjekter: the
            link carries ?velg, and the page loads that one.
          */}
          <ul className="home-carts mt-10">
            {HOME_CARTS.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/prosjekter?velg=${project.slug}`}
                  className="home-cart"
                >
                  <span className="home-cart-shell">
                    <Cartridge project={project} />
                  </span>
                  <span className="home-cart-title">{project.title}</span>
                  <span className="home-cart-role">{project.role}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <PixelButton href="/prosjekter" size="lg" companion="denji">
              Alle fem prosjektene
            </PixelButton>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-5xl px-3 sm:px-5">
        <div className="ps-panel flex flex-col items-start gap-8 px-5 py-12 sm:flex-row sm:items-center sm:px-8">
          <Image
            src="/andreprofil.png"
            alt="Noah Klavestad-Christensen"
            width={488}
            height={512}
            className="ps-frame w-32 object-cover sm:w-40"
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
