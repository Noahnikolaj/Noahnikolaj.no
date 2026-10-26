"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { roomFor } from "@/lib/rooms";
import {
  flipTo,
  setFlipDuration,
  setFlipOrigin,
  warmFlip,
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
    /*
     * The same anchor test for both listeners below: is this a plain left
     * click on an internal link that actually goes somewhere else?
     */
    const destination = (target: EventTarget | null) => {
      const anchor = (target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return null;
      if (anchor.target && anchor.target !== "_self") return null;
      if (anchor.hasAttribute("download")) return null;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return null;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return null;
      // A hash on the current page is a scroll, not a navigation.
      if (url.pathname === window.location.pathname && url.hash) return null;
      if (
        url.pathname + url.search ===
        window.location.pathname + window.location.search
      ) {
        return null;
      }
      return url;
    };

    /*
     * A finger rests on a link for a moment before the tap registers. Start
     * fetching the route then, so the first navigation of a visit is not the
     * one that waits on the network.
     */
    const asked = new Set<string>();
    const onPointerDown = (event: PointerEvent) => {
      const url = destination(event.target);
      if (!url) return;
      const path = url.pathname + url.search;
      if (asked.has(path)) return;
      asked.add(path);
      router.prefetch(path);
    };

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

      const url = destination(event.target);
      if (!url) return;

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
    document.addEventListener("pointerdown", onPointerDown, true);

    /*
     * Take the first flip's setup cost out of the way so no tap has to pay
     * it. Held back past the entrance animations first: a warmup is still a
     * view transition, and one of those freezes rendering for a frame, which
     * would show as a stutter if it landed while the page was arriving.
     */
    let idle = 0;
    const settled = window.setTimeout(() => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => warmFlip(), { timeout: 2000 })
        : window.setTimeout(warmFlip, 0);
    }, 1200);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.clearTimeout(settled);
      if (!idle) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [router]);

  return null;
}
