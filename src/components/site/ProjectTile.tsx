import Image from "next/image";
import Link from "next/link";

import { DeviceFrame } from "@/components/site/DeviceFrame";
import { Reveal } from "@/components/pixel/Reveal";

import type { Project } from "@/content/projects";

/*
 * A project as a place you can walk into, not a card in a grid.
 *
 * The art sits inside its own drawn device (see DeviceFrame) on a pink
 * shelf, so a screenshot reads as a thing rather than as evidence. Height is
 * what gets capped, not width: that is what makes a tall phone shot and a
 * wide browser shot the same visual size without cropping either.
 *
 * Only used on the home page now. /prosjekter is a list, see ProjectIndex.
 * The whole tile is one link, so nothing interactive is nested.
 */
export function ProjectTile({
  project,
  index = 0,
  headingLevel = 3,
}: {
  project: Project;
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
    <Reveal as="li" delay={Math.min(index, 3) * 90}>
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

        <div className="order-1 mb-5 flex items-center justify-center bg-secondary p-5">
          {image ? (
            <DeviceFrame device={image.device ?? "none"} className="max-w-full">
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 80vw, 24rem"
                className="block h-auto w-auto max-h-56 max-w-full"
              />
            </DeviceFrame>
          ) : (
            /*
             * Nothing may be shown, so say that plainly instead of faking art.
             * The dither is deliberately faint: next to two real screenshots a
             * full-strength pattern shouted louder than the actual work.
             */
            <div className="relative flex min-h-48 w-full items-center justify-center border-4 border-foreground bg-background p-6 shadow-[8px_8px_0_0_rgb(var(--blokk))]">
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
