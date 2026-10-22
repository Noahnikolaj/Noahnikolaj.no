import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/pixel/Reveal";

import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/*
 * A project as a place you can walk into, not a card in a grid.
 *
 * Each photo keeps its own proportions. Bosett's PNG has an alpha channel so
 * it sits straight on the pink with no frame; the others get a hard pixel
 * border. The whole tile is one link, so nothing interactive is nested.
 */
export function ProjectTile({
  project,
  size = "normal",
  index = 0,
  headingLevel = 3,
}: {
  project: Project;
  /** "wide" gives PixiWorld the full-bleed moment its 2969px art deserves. */
  size?: "normal" | "wide";
  /** Position in its group, used only to stagger the reveal. */
  index?: number;
  /**
   * Under a section heading (home) these are h3. On the projects index they
   * sit directly under the h1, so there they must be h2 or the level skips.
   */
  headingLevel?: 2 | 3;
}) {
  const { image } = project;
  const Heading = `h${headingLevel}` as "h2" | "h3";
  /*
   * The link wraps the whole tile, so its accessible name is everything
   * inside. The title block therefore comes FIRST in the DOM and is moved
   * below the art with CSS order: that way the name leads with the project
   * name instead of the "cannot be shown" sentence, while still containing
   * all the visible text (WCAG 2.5.3 Label in Name). An aria-labelledby
   * override would have failed that rule.
   */

  return (
    <Reveal
      as="li"
      delay={Math.min(index, 3) * 90}
      className={cn(size === "wide" && "sm:col-span-2")}
    >
      <Link
        href={`/prosjekter/${project.slug}`}
        className="group flex flex-col focus-visible:outline-4"
      >
        <div className="order-2">
          <Heading className="font-display text-xl leading-tight group-hover:underline group-hover:decoration-4 group-hover:underline-offset-4">
            {project.title}
          </Heading>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {project.role}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed">{project.tagline}</p>
        </div>

        <div
          className={cn(
            "relative order-1 mb-5 flex items-center justify-center overflow-hidden bg-secondary border-4 border-foreground",
            size === "wide" ? "aspect-[16/7]" : "aspect-[5/4]",
          )}
        >
          {image ? (
            <Image
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30rem"
              className={cn(
                "h-full w-full",
                image.transparent ? "object-contain p-4" : "object-cover",
              )}
            />
          ) : (
            /*
             * Nothing may be shown, so say that plainly instead of faking art.
             * The dither is deliberately faint: next to two real screenshots a
             * full-strength pattern shouted louder than the actual work.
             */
            <div className="relative flex h-full w-full items-center justify-center bg-background p-6">
              <div
                aria-hidden="true"
                className="dither-25 absolute inset-0 opacity-30"
              />
              <p className="relative max-w-[24ch] text-center text-sm font-medium leading-relaxed text-muted-foreground">
                Arbeidet eies av Welcome Workdays, så det kan ikke vises her.
              </p>
            </div>
          )}
        </div>

      </Link>
    </Reveal>
  );
}
