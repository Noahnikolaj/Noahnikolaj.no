import { cn } from "@/lib/utils";
import type { Sprite as SpriteData } from "./sprites";

/*
 * Draws one of Noah's sprites as SVG rects instead of an upscaled bitmap, so
 * it stays perfectly crisp at any size with no image file and no canvas.
 */
export function Sprite({
  sprite,
  scale = 8,
  className,
  decorative = false,
}: {
  sprite: SpriteData;
  /** Rendered size of one art pixel, in CSS pixels. */
  scale?: number;
  className?: string;
  /** Set when the sprite repeats information already in adjacent text. */
  decorative?: boolean;
}) {
  const { art, palette, label } = sprite;
  const w = art[0].length;
  const h = art.length;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={cn("block h-auto max-w-full", className)}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {art.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = palette[ch];
          if (!fill) return null;
          return (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          );
        }),
      )}
    </svg>
  );
}
