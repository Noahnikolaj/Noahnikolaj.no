"use client";

import * as React from "react";

/*
 * A light you carry across the gallery wall.
 *
 * The grid wallpaper stays faint everywhere; inside this patch the same grid
 * is drawn again at full strength, masked down to nothing at the edges, so
 * the lines resolve around the pointer and dissolve away from it.
 *
 * Two things keep it cheap. The patch is a fixed square moved with a
 * transform rather than a full-viewport layer repainted every frame, and the
 * pointer position is written once per animation frame rather than once per
 * event. The grid inside is pinned to the viewport by offsetting
 * background-position against the same translation, so the lines stay put
 * while the light moves over them.
 *
 * Fine pointers only. There is no cursor to follow on a touch screen, and
 * rendering it there would be a repaint nobody ever sees.
 */
export function RoomTorch({ tint }: { tint: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let x = 0;
    let y = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      el.style.setProperty("--torch-x", `${x}px`);
      el.style.setProperty("--torch-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      el.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(paint);
    };

    // Taking the light off the wall when the cursor leaves the window, so it
    // does not sit frozen wherever it happened to stop.
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  /*
   * The tint is passed in rather than inherited: the wash and the torch are
   * siblings, so a custom property set on one never reaches the other.
   */
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="room-torch"
      style={{ ["--rom-tint" as string]: tint }}
    />
  );
}
