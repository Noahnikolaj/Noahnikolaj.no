import { cn } from "@/lib/utils";
import type { Sprite } from "./sprites";

/*
 * A row of poses in one SVG, drawn the way a sprite sheet is.
 *
 * The frames sit side by side and the element is shown through a window
 * exactly one frame wide, so animating translateX by -100% with steps(n)
 * walks the strip one pose at a time. That is a single animation for any
 * number of frames, where stacking the poses and cross-fading them needs a
 * separate keyframe set per frame and never actually cuts between them.
 *
 * Every frame must share a grid; the first one sets the size.
 */
export function SpriteStrip({
  frames,
  scale = 5,
  className,
}: {
  frames: Sprite[];
  /** Rendered size of one art pixel, in CSS pixels. */
  scale?: number;
  className?: string;
}) {
  const w = frames[0].art[0].length;
  const h = frames[0].art.length;
  const n = frames.length;

  return (
    <svg
      viewBox={`0 0 ${w * n} ${h}`}
      width={w * n * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={cn("block", className)}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {frames.flatMap((frame, i) =>
        frame.art.flatMap((row, y) =>
          [...row].map((ch, x) => {
            const fill = frame.palette[ch];
            if (!fill) return null;
            return (
              <rect
                key={`${i}-${x}-${y}`}
                x={i * w + x}
                y={y}
                width={1}
                height={1}
                fill={fill}
              />
            );
          }),
        ),
      )}
    </svg>
  );
}
