"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

export type Dir = "up" | "down" | "left" | "right";

type Props = {
  onDir: (dir: Dir, pressed: boolean) => void;
};

const ARROW: Record<Dir, string> = {
  up: "▲",
  down: "▼",
  left: "◀",
  right: "▶",
};

const CELL: Record<Dir, string> = {
  up: "col-start-2 row-start-1",
  left: "col-start-1 row-start-2",
  right: "col-start-3 row-start-2",
  down: "col-start-2 row-start-3",
};

/**
 * Chunky pixel D-pad for touch. Pointer capture keeps a held direction alive
 * even if her thumb slides off the button, and `touch-action: none` stops
 * Safari from treating the drag as a scroll or a double-tap zoom.
 */
export default function DPad({ onDir }: Props) {
  const bind = (dir: Dir) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      onDir(dir, true);
    },
    onPointerUp: (e: ReactPointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onDir(dir, false);
    },
    onPointerCancel: () => onDir(dir, false),
    onLostPointerCapture: () => onDir(dir, false),
    onContextMenu: (e: ReactPointerEvent<HTMLButtonElement>) => e.preventDefault(),
  });

  return (
    <div className="hw-dpad grid grid-cols-3 grid-rows-3 gap-1.5">
      {(Object.keys(CELL) as Dir[]).map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir}
          className={`hw-key ${CELL[dir]}`}
          {...bind(dir)}
        >
          {ARROW[dir]}
        </button>
      ))}
      <span className="hw-key-center col-start-2 row-start-2" aria-hidden="true" />
    </div>
  );
}
