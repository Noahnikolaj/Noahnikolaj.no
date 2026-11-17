"use client";

import * as React from "react";

import { titleActive } from "@/lib/titleScreen";

/*
 * The pause menu. An easter egg: Esc anywhere on the site pauses the game.
 *
 * Fortsett closes it, Innstillinger is greyed out with a sticker promising
 * it soon, and Avslutt goes dark and boots the site again from the title
 * screen, the same one a first visit gets.
 *
 * While it is open the page behind holds still: every CSS animation on the
 * page is paused (see html[data-paused] in globals.css) and the page cannot
 * scroll. Up and down move between the items, Enter picks, Esc resumes.
 *
 * Not a native <dialog>: that draws in the top layer, above the reticle
 * cursor, and the cursor would vanish exactly when there is a menu to aim at.
 */
type Phase = "closed" | "open" | "closing" | "exiting";

export function PauseMenu() {
  const [phase, setPhase] = React.useState<Phase>("closed");
  const resumeRef = React.useRef<HTMLButtonElement>(null);
  const exitRef = React.useRef<HTMLButtonElement>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);

  const close = React.useCallback(() => {
    setPhase((p) => (p === "open" ? "closing" : p));
  }, []);

  const exit = React.useCallback(() => {
    setPhase("exiting");
    try {
      sessionStorage.removeItem("startet");
    } catch {
      /* no storage: the title screen shows on every visit anyway */
    }
    // Let the screen go dark first, then boot from the top.
    window.setTimeout(() => window.location.assign("/"), 650);
  }, []);

  // Esc opens it, from anywhere, unless the title screen is still up.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.repeat) return;
      if (phase === "open") {
        event.preventDefault();
        close();
        return;
      }
      if (phase !== "closed" || titleActive()) return;
      event.preventDefault();
      returnFocus.current = document.activeElement as HTMLElement | null;
      setPhase("open");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // Hold the page still while paused.
  React.useEffect(() => {
    const html = document.documentElement;
    if (phase === "closed") return;
    html.setAttribute("data-paused", "");
    resumeRef.current?.focus({ preventScroll: true });
    return () => html.removeAttribute("data-paused");
  }, [phase === "closed"]); // eslint-disable-line react-hooks/exhaustive-deps

  // Closing plays out, then the menu is gone and focus goes back.
  React.useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      returnFocus.current?.focus?.({ preventScroll: true });
    }, 260);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "closed") return null;

  // Up and down move between the two live items; focus never leaves the menu.
  const onMenuKey = (event: React.KeyboardEvent) => {
    const keys = ["ArrowUp", "ArrowDown", "Tab"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const onResume = document.activeElement === resumeRef.current;
    (onResume ? exitRef : resumeRef).current?.focus();
  };

  return (
    <div
      className={`pause-menu is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      onKeyDown={onMenuKey}
    >
      {/* Clicking beside the menu resumes too. */}
      <div className="pause-scrim" aria-hidden="true" onClick={close} />
      <div className="pause-card">
        <h2 id="pause-title" className="pause-title">
          Pause
        </h2>
        <ul className="pause-list">
          <li>
            <button ref={resumeRef} type="button" className="pause-item" onClick={close}>
              Fortsett
            </button>
          </li>
          <li className="pause-row">
            <button
              type="button"
              className="pause-item"
              disabled
              aria-describedby="pause-soon"
            >
              Innstillinger
            </button>
            <span id="pause-soon" className="pause-soon">
              Kommer snart
            </span>
            <span className="pause-sticker" aria-hidden="true">
              <span className="pause-sticker-face">
                <span>Snart</span>
                <span>!</span>
              </span>
            </span>
          </li>
          <li>
            <button ref={exitRef} type="button" className="pause-item" onClick={exit}>
              Avslutt
            </button>
          </li>
        </ul>
        <p className="pause-hint" aria-hidden="true">
          Esc for å fortsette
        </p>
      </div>
      <div className="pause-fade" aria-hidden="true" />
    </div>
  );
}
