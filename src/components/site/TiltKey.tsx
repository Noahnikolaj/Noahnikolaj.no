"use client";

import * as React from "react";

import {
  onTiltState,
  startTilt,
  stopTilt,
  tiltAvailable,
  tiltNeedsPermission,
  tiltRunning,
} from "@/lib/tilt";

/*
 * Tilt, on a phone.
 *
 * Where the browser hands out orientation freely it simply starts. On an
 * iPhone it has to be asked for from a tap, so this key is the tap: one
 * press and the portrait and the world follow how you hold the phone. A
 * second press stops it. Nothing shows on a desktop.
 */
export function TiltKey() {
  const [show, setShow] = React.useState(false);
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches || !tiltAvailable()) return;
    const off = onTiltState(() => setOn(tiltRunning()));
    if (tiltNeedsPermission()) setShow(true);
    else void startTilt();
    return off;
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => (on ? stopTilt() : void startTilt())}
      className="tilt-key"
    >
      <svg viewBox="0 0 12 12" width={14} height={14} aria-hidden="true" shapeRendering="crispEdges">
        <g fill="currentColor">
          <rect x="3" y="0" width="6" height="1" />
          <rect x="2" y="1" width="1" height="10" />
          <rect x="9" y="1" width="1" height="10" />
          <rect x="3" y="11" width="6" height="1" />
          <rect x="5" y="9" width="2" height="1" />
        </g>
      </svg>
      {on ? "Vipp på" : "Vipp"}
    </button>
  );
}
