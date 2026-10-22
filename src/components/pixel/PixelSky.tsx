/*
 * Drifting pixel clouds. Place inside a `relative` band: the sky belongs to
 * the top of a page, where the hero is, NOT behind the whole site. Behind body
 * copy it stopped being weather and became wallpaper, and it fought the text.
 *
 * The cloud shape is an SVG mask rather than a coloured image, so the clouds
 * take their colour from the theme token and recolour themselves at night
 * without a second asset. Two layers at different sizes and speeds give
 * parallax. Movement is a fixed pixel distance equal to one tile, so the loop
 * is seamless, and it runs on transform so it stays off the paint path.
 */

const CLOUDS =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 70'%3E%3Crect x='14' y='10' width='8' height='2'/%3E%3Crect x='12' y='12' width='13' height='2'/%3E%3Crect x='10' y='14' width='17' height='2'/%3E%3Crect x='11' y='16' width='15' height='2'/%3E%3Crect x='92' y='44' width='7' height='2'/%3E%3Crect x='90' y='46' width='12' height='2'/%3E%3Crect x='88' y='48' width='16' height='2'/%3E%3C/svg%3E";

export function PixelSky() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="sky-layer sky-layer--far"
        style={{ maskImage: `url("${CLOUDS}")`, WebkitMaskImage: `url("${CLOUDS}")` }}
      />
      <div
        className="sky-layer sky-layer--near"
        style={{ maskImage: `url("${CLOUDS}")`, WebkitMaskImage: `url("${CLOUDS}")` }}
      />
    </div>
  );
}
