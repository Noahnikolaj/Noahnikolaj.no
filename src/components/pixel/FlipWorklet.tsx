"use client";

import * as React from "react";

/*
 * Registers the paint worklet that masks the incoming view.
 *
 * Where paint worklets are unavailable (Safari, Firefox today) the document is
 * marked so the stylesheet falls back to a short fade instead. Nothing breaks,
 * the transition is just plainer.
 */
export function FlipWorklet() {
  React.useEffect(() => {
    const paintWorklet = (
      CSS as typeof CSS & { paintWorklet?: { addModule: (u: string) => Promise<void> } }
    ).paintWorklet;

    if (!paintWorklet) {
      document.documentElement.classList.add("no-pixel-flip");
      return;
    }

    paintWorklet
      .addModule("/pixel-flip-worklet.js")
      .then(() => document.documentElement.classList.add("pixel-flip-ready"))
      .catch(() => document.documentElement.classList.add("no-pixel-flip"));
  }, []);

  return null;
}
