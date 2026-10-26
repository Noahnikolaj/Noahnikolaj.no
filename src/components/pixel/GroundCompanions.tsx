import { Sprite } from "@/components/pixel/Sprite";
import { DENJI, NOAH } from "@/components/pixel/sprites";

/*
 * Noah and the cat, standing on the hero's ground band.
 *
 * This used to follow you: the pair detached when the band scrolled out of
 * view, paced along the floor of the screen for the rest of the page, and
 * climbed onto the footer at the end. It needed an IntersectionObserver, a
 * scroll listener, a measured leap and four pieces of state, and the effect
 * was company you had not asked for.
 *
 * A designer's note was to let the characters turn up in places instead. So
 * they stand here, and their other appearances answer to something you did
 * rather than to the scroll position: see the `companion` prop on
 * PixelButton.
 *
 * With nothing left to track this is a server component, and the idle
 * breathing is suppressed under prefers-reduced-motion by the site-wide rule
 * rather than by a JS check, so nothing has to run on the client at all.
 */
export function GroundCompanions() {
  return (
    <div aria-hidden="true" className="companions">
      <Sprite sprite={NOAH} scale={8} decorative className="sprite-idle" />
      <Sprite
        sprite={DENJI}
        scale={7}
        decorative
        className="sprite-idle sprite-idle--late"
      />
    </div>
  );
}
