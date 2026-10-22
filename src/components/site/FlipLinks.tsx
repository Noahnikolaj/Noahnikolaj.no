"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { roomFor } from "@/lib/rooms";
import {
  flipTo,
  setFlipDuration,
  setFlipOrigin,
} from "@/lib/viewTransition";

/*
 * Makes every internal link flip, not just the ones in the nav.
 *
 * One delegated listener rather than an onClick on each link, so project
 * tiles, buttons and back links all behave the same without having to
 * remember to wire each one.
 */
export function FlipLinks() {
  const router = useRouter();

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // A hash on the current page is a scroll, not a navigation.
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.pathname + url.search === window.location.pathname + window.location.search) {
        return;
      }

      /*
       * Capture phase, so this runs before Next's own Link handler. In the
       * bubble phase Link has already called preventDefault, and the guard
       * above would send every click down the default path with no flip.
       * Stopping propagation keeps Link from navigating a second time.
       */
      event.preventDefault();
      event.stopPropagation();
      setFlipOrigin(event.clientX, event.clientY);
      // Each room decides how long its arrival takes.
      setFlipDuration(roomFor(url.pathname).duration);
      flipTo(() => router.push(url.pathname + url.search));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
