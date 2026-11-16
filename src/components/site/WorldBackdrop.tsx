"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { Quietly } from "@/components/site/Quietly";
import { roomFor } from "@/lib/rooms";
import { osloPhase, skyFor, type Phase } from "@/lib/sky";

/*
 * The world behind every page.
 *
 * It lives in the shell, not in a page, so it is never torn down: moving
 * between pages moves the camera through the same scene rather than loading
 * a new background. The air colour is painted here too, underneath the
 * canvas, so a browser without WebGL still stands in the right room, and the
 * scene itself is loaded only after the page is up.
 */
const WorldCanvas = dynamic(
  () => import("@/components/site/WorldCanvas").then((m) => m.WorldCanvas),
  { ssr: false },
);

export function WorldBackdrop() {
  const pathname = usePathname();
  const room = roomFor(pathname);
  const [webgl, setWebgl] = React.useState(false);
  // Day until the client knows the hour, then whatever Oslo says it is.
  const [phase, setPhase] = React.useState<Phase>("dag");
  const sky = skyFor(room.sky, phase);

  React.useEffect(() => {
    const check = () => setPhase(osloPhase());
    check();
    const id = window.setInterval(check, 5 * 60_000);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    let ok = false;
    try {
      const probe = document.createElement("canvas");
      ok = !!probe.getContext("webgl2");
    } catch {
      ok = false;
    }
    setWebgl(ok);
    // Tells the title screen to write the name as text instead.
    document.documentElement.classList.toggle("no-webgl", !ok);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="world-backdrop"
      style={{ backgroundColor: sky }}
    >
      {webgl ? (
        <Quietly>
          <WorldCanvas station={room.station} sky={sky} phase={phase} />
        </Quietly>
      ) : null}
    </div>
  );
}
