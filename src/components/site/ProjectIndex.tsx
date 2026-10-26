"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { DeviceFrame } from "@/components/site/DeviceFrame";
import { Reveal } from "@/components/pixel/Reveal";
import { Sprite } from "@/components/pixel/Sprite";
import { DENJI } from "@/components/pixel/sprites";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/*
 * The projects index, as an index.
 *
 * It used to be a grid of picture cards, which made five projects look like
 * five adverts. A list reads as a body of work: you take in all five titles
 * at once, and the art answers to whichever one you are pointing at.
 *
 * No 01/02/03 down the side. These are not a sequence and numbering them
 * would be a decoration pretending to be structure. The period is the
 * metadata that actually tells you something.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState(0);
  const shown = projects[active];

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:items-start md:gap-14">
      <ol className="flex flex-col border-t-4 border-foreground">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={Math.min(index, 3) * 70}>
            <Link
              href={`/prosjekter/${project.slug}`}
              /*
               * Focus as well as hover, not hover alone: a keyboard reader
               * tabbing the list has to drive the preview too, or the pane
               * is furniture they can never operate.
               */
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={cn(
                "group block border-b-4 border-foreground px-3 py-5 transition-colors duration-100",
                "hover:bg-secondary focus-visible:bg-secondary",
                index === active && "md:bg-secondary",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-display text-2xl leading-tight group-hover:underline group-hover:decoration-4 group-hover:underline-offset-4 sm:text-3xl">
                  {project.title}
                </h2>
                <p className="text-sm font-bold text-muted-foreground">
                  {project.period}
                </p>
              </div>
              <p className="mt-1 text-sm font-bold text-accent">
                {project.role}
              </p>
              <p className="mt-2 max-w-[48ch] text-[0.95rem] leading-relaxed">
                {project.tagline}
              </p>

              {/*
               * No hover on a phone, so the art comes inline under its own
               * row rather than into a pane nobody can reach.
               */}
              <div className="mt-5 flex justify-center md:hidden">
                <ProjectArt project={project} maxHeight="15rem" />
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>

      {/*
       * Decorative: every word in here is already in the row that drove it.
       * Sticky so it stays beside the list while the list scrolls past.
       */}
      <div aria-hidden="true" className="hidden md:block">
        <div className="sticky top-12 flex min-h-[22rem] flex-col items-center justify-center bg-secondary p-8">
          <div key={shown.slug} className="preview-swap flex justify-center">
            <ProjectArt project={shown} maxHeight="20rem" />
          </div>
          {/* The cat came to look at the work too. */}
          <div className="mt-6 self-start">
            <Sprite sprite={DENJI} scale={5} decorative className="sprite-idle" />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * One project's art, inside whichever device it belongs in. The height cap
 * rather than a width cap is what keeps a tall phone screenshot and a wide
 * browser screenshot the same visual size.
 */
function ProjectArt({
  project,
  maxHeight,
}: {
  project: Project;
  maxHeight: string;
}) {
  const { image } = project;

  if (!image) {
    return (
      <div className="relative flex max-w-[22rem] items-center justify-center border-4 border-foreground bg-background p-6 shadow-[8px_8px_0_0_rgb(var(--blokk))]">
        <div aria-hidden="true" className="dither-25 absolute inset-0 opacity-30" />
        <p className="relative max-w-[24ch] text-center text-sm font-medium leading-relaxed text-muted-foreground">
          Arbeidet eies av Welcome Workdays, så det kan ikke vises her.
        </p>
      </div>
    );
  }

  return (
    <DeviceFrame device={image.device ?? "none"} className="max-w-full">
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        sizes="(max-width: 768px) 80vw, 24rem"
        style={{ maxHeight }}
        className="block h-auto w-auto max-w-full"
      />
    </DeviceFrame>
  );
}
