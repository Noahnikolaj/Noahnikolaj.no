"use client";

import * as React from "react";
import { useThree } from "@react-three/fiber";

/*
 * Decides when a scene draws.
 *
 * The canvases run on demand, and this asks for a frame. While something is
 * happening (the pointer moved, the camera is travelling, the portrait is
 * still turning) it asks every display frame. Otherwise it drops to a slow idle rate, which is enough for clouds and a
 * sliding grid and leaves the browser free. Every frame of the world also re-blurs every frosted panel
 * on top of it, so an idle world is what keeps scrolling smooth.
 *
 * Nothing draws while the tab is hidden or while `visible` says the canvas
 * is off screen.
 */
export function FrameDriver({
  busy,
  idleFps,
  visible,
}: {
  busy: () => boolean;
  idleFps: number;
  visible?: React.RefObject<boolean>;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const busyRef = React.useRef(busy);

  React.useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  React.useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (visible && visible.current === false) return;
      const gap = busyRef.current() ? 0 : 1000 / idleFps;
      if (t - last >= gap - 2) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, idleFps, visible]);

  return null;
}
