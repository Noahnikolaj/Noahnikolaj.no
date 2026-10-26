"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { PixelSky } from "@/components/pixel/PixelSky";
import { RoomTorch } from "@/components/pixel/RoomTorch";
import { roomFor } from "@/lib/rooms";
import { settleTransition } from "@/lib/viewTransition";

/*
 * The room you are standing in: its tint and its wallpaper.
 *
 * The arrival itself is handled by the browser's view transition, not by
 * anything drawn here, so both the outgoing and incoming views are real.
 * This component only has to tell the browser when the new route has
 * rendered, which is what releases the flip.
 */
export function RoomTransition() {
  const pathname = usePathname();
  const room = roomFor(pathname);

  React.useLayoutEffect(() => {
    settleTransition();
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className="room-wash"
        data-pattern={room.pattern}
        style={{ ["--rom-tint" as string]: room.tint }}
      />
      {room.pattern === "clouds" ? <PixelSky /> : null}
      {/* The gridded wall is the only one you carry a light across. */}
      {room.pattern === "grid" ? <RoomTorch tint={room.tint} /> : null}
    </>
  );
}
