"use client";

import * as React from "react";

/*
 * The power-on sequence plays once per visit.
 *
 * layout.tsx marks <html data-boot> before first paint when this session has
 * not started yet, and the stylesheet stages the entrance off that
 * attribute. This only takes the mark away once the sequence has run and
 * notes that it ran, so the next page in the same tab opens switched on.
 */
const BOOT_MS = 1900;

export function PowerOn() {
  React.useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-boot")) return;
    // On home the title screen holds the mark until you press start.
    if (document.querySelector(".title-screen")) return;
    const done = window.setTimeout(() => {
      html.removeAttribute("data-boot");
      try {
        sessionStorage.setItem("startet", "1");
      } catch {
        /* nothing to remember in; it will simply play again */
      }
    }, BOOT_MS);
    return () => window.clearTimeout(done);
  }, []);

  return null;
}
