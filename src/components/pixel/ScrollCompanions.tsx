"use client";

import * as React from "react";

import { Sprite } from "@/components/pixel/Sprite";
import {
  DENJI,
  NOAH,
  NOAH_RUN_LEFT,
  NOAH_RUN_RIGHT,
} from "@/components/pixel/sprites";

/*
 * Noah and the cat, exactly one pair of them.
 *
 * They stand on the hero's ground band until it scrolls out of view. At that
 * moment they jump, swap to their walking frames, and keep pace along the
 * floor of the screen. The handover is driven by watching the band itself
 * rather than a guessed scroll offset, which is what stops a second copy
 * appearing while the first is still on screen.
 *
 * Decorative, so aria-hidden throughout, and never rendered at all under
 * prefers-reduced-motion.
 */
const STEP_MS = 120;
const IDLE_AFTER = 150;

export function ScrollCompanions({
  groundId = "bakken",
}: {
  /** The hero element they stand on. */
  groundId?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const lastRect = React.useRef<DOMRect | null>(null);
  const [allowed, setAllowed] = React.useState(false);
  const [onTheMove, setOnTheMove] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [atFooter, setAtFooter] = React.useState(false);
  const [facingRight, setFacingRight] = React.useState(true);
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAllowed(true);

    const ground = document.getElementById(groundId);
    if (!ground) return;

    // They set off only once the ground they were standing on has gone.
    const observer = new IntersectionObserver(
      ([entry]) => setOnTheMove(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(ground);

    let lastY = window.scrollY;
    let stopTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        setFacingRight(y > lastY);
        setRunning(true);
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => setRunning(false), IDLE_AFTER);
      }
      lastY = y;

      /*
       * At the end of the page they climb onto the footer and ride its top
       * edge rather than floating over it. Their height is driven straight
       * from the footer's position so they stay planted on it as it scrolls.
       */
      const footer = document.querySelector("footer");
      const el = rootRef.current;
      if (footer && el) {
        // Captured before any state change, so the leap measures from where
        // they actually were rather than a stale position.
        lastRect.current = el.getBoundingClientRect();

        const f = footer.getBoundingClientRect();
        const standing = f.top < window.innerHeight - 8;
        if (standing) {
          el.style.setProperty(
            "--companion-bottom",
            `${Math.round(window.innerHeight - f.top)}px`,
          );
        } else {
          el.style.removeProperty("--companion-bottom");
        }
        setAtFooter(standing);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stopTimer);
    };
  }, [groundId]);

  /*
   * The leap.
   *
   * Measure where they were before the switch and where they end up after it,
   * then play the jump from that real offset: a crouch, an arc up and across,
   * and a squash on landing. Guessing a fixed offset would have them take off
   * from the wrong place.
   */
  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const landed = el.getBoundingClientRect();
    const launched = lastRect.current;

    // Fires on every move: down onto the floor, up onto the footer, and back.
    if (launched && (launched.top !== landed.top || launched.left !== landed.left)) {
      el.style.setProperty("--leap-dx", `${launched.left - landed.left}px`);
      el.style.setProperty("--leap-dy", `${launched.top - landed.top}px`);
      el.classList.remove("leaping");
      // Force a reflow so the animation restarts rather than being ignored.
      void el.offsetWidth;
      el.classList.add("leaping");
    }

    lastRect.current = landed;
    // `allowed` matters too: the element does not exist until it flips, so
    // without it the take-off position is never recorded.
  }, [onTheMove, atFooter, allowed]);

  // Legs only move while the page does.
  React.useEffect(() => {
    if (!running || !onTheMove) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % 2), STEP_MS);
    return () => clearInterval(id);
  }, [running, onTheMove]);

  if (!allowed) return null;

  const walking = facingRight ? NOAH_RUN_RIGHT : NOAH_RUN_LEFT;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-moving={onTheMove ? "" : undefined}
      data-footer={atFooter ? "" : undefined}
      className="companions"
    >
      <div className="companion" data-running={running ? "" : undefined}>
        <Sprite
          sprite={onTheMove ? walking[running ? frame : 0] : NOAH}
          scale={8}
          decorative
        />
      </div>
      <div
        className="companion companion--cat"
        data-running={running ? "" : undefined}
      >
        <Sprite sprite={DENJI} scale={7} decorative />
      </div>
    </div>
  );
}
