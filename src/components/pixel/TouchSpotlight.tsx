"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/*
 * What hover means on a touch screen.
 *
 * Every animation on this site hangs off :hover or :focus-visible, which on a
 * phone means none of them ever run. Tapping is not the answer either: a tap
 * on any of these elements is a navigation, so the animation would play for
 * the instant before the page changed.
 *
 * The honest equivalent of pointing at something with a mouse is scrolling it
 * into the middle of the screen. So that is the trigger: whatever is crossing
 * the centre band of the viewport gets `data-near`, and the stylesheet treats
 * that exactly like a hover.
 *
 * Only on coarse pointers. On a desktop this would start animations as the
 * page scrolled past, which is noise, and hover already works there.
 */
export function TouchSpotlight() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll("[data-spotlight]");
    if (!targets.length) return;

    /*
     * The negative margins crush the root down to a band across the middle,
     * so "intersecting" means "is roughly what you are looking at" rather
     * than "is anywhere on screen". Without that, everything on a short page
     * would animate at once.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.setAttribute("data-near", "");
          else entry.target.removeAttribute("data-near");
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // Re-collected per route: the elements are different on every page.
  }, [pathname]);

  return null;
}
