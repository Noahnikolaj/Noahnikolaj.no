"use client";

import * as React from "react";

import { setTitleActive } from "@/lib/titleScreen";

/*
 * The title screen.
 *
 * Only on the first page of a visit, and only when that page is home. The
 * page script in layout.tsx marks <html data-boot> before paint on the
 * first page, and the stylesheet only shows this while that mark is there,
 * so returning to home later never flashes it.
 *
 * Your name is not in here: it stands in the world behind, built out of
 * cubes (WorldCanvas), and only shows as text here if WebGL is missing.
 * Under it, what you do and the prompt.
 *
 * Any key, a click, a tap or a scroll starts. The world's camera dives to
 * the ground, this screen folds away, and the hero and the floor, held
 * still until now, come in. The page's own heading is in the hero below,
 * so nothing is lost to anyone who never sees this.
 */
const SKIP_KEYS = new Set(["Escape", "Tab", "Shift", "Alt", "Control", "Meta", "CapsLock"]);

export function TitleScreen() {
  const ref = React.useRef<HTMLElement>(null);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-boot")) return;
    setTitleActive(true);
    // A reload would otherwise put the page back where it was, under the title.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo({ top: 0 });

    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      window.scrollTo({ top: 0 });
      setStarted(true);
      setTitleActive(false);
      // Let the hero and floor play through, then the visit is "on".
      window.setTimeout(() => {
        html.removeAttribute("data-boot");
        try {
          sessionStorage.setItem("startet", "1");
        } catch {
          /* no storage: it will simply show again */
        }
      }, 2000);
    };

    const onKey = (event: KeyboardEvent) => {
      if (SKIP_KEYS.has(event.key) || event.metaKey || event.ctrlKey) return;
      if (event.key === " " || event.key === "Enter") event.preventDefault();
      start();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) start();
    };
    const onScroll = () => {
      if (window.scrollY > 8) start();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", start, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = ref.current;
    el?.addEventListener("pointerdown", start);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", start);
      window.removeEventListener("scroll", onScroll);
      el?.removeEventListener("pointerdown", start);
      setTitleActive(false);
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Tittelskjerm"
      className={`title-screen${started ? " is-started" : ""}`}
    >
      <div className="title-copy">
        <p aria-hidden="true" className="title-name-fallback">
          Noah Nikolaj
        </p>
        <p className="title-sub">Designer og utvikler</p>
        <button type="button" className="title-start">
          Trykk for å starte
        </button>
      </div>
    </section>
  );
}
