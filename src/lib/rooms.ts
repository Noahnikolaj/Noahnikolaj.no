/*
 * Every route is a room.
 *
 * A room decides the colour you arrive through and the wallpaper once you are
 * inside. The arrival itself is the same flip wave everywhere, starting from
 * whatever you clicked, so the site behaves like one object.
 *
 * The page tokens never change, so contrast stays verified: a room only tints
 * the air and draws wallpaper, neither of which carries text.
 */

/** Wallpaper inside the room. */
export type RoomPattern = "clouds" | "grid" | "rules" | "dots" | "none";

export type Room = {
  id: string;
  /** RGB channels, fed to CSS custom properties. */
  tint: string;
  pattern: RoomPattern;
  /**
   * Arrival length in ms. Deliberately long: the curtain clears block by
   * block so the screen never steps between two brightnesses, which is the
   * thing that matters for photosensitivity.
   */
  duration: number;
};

const ROOMS: Record<string, Room> = {
  // Outside, under the clouds.
  hjem: { id: "hjem", tint: "228 100 124", pattern: "clouds", duration: 900 },
  // The gallery. Pictures hung on a gridded wall.
  prosjekter: { id: "prosjekter", tint: "201 84 143", pattern: "grid", duration: 850 },
  // One picture, up close.
  prosjekt: { id: "prosjekt", tint: "201 84 143", pattern: "grid", duration: 780 },
  // The archive. Ruled paper, no windows.
  cv: { id: "cv", tint: "163 63 99", pattern: "rules", duration: 880 },
  // The prototype room.
  bosett: { id: "bosett", tint: "224 122 144", pattern: "dots", duration: 850 },
  // The cave. It stays dark a moment while your eyes adjust.
  denji: { id: "denji", tint: "42 27 53", pattern: "none", duration: 1200 },
  // Nowhere in particular.
  borte: { id: "borte", tint: "122 59 92", pattern: "dots", duration: 760 },
};

export function roomFor(pathname: string): Room {
  if (pathname === "/") return ROOMS.hjem;
  // The cave is checked before the gallery it hangs off.
  if (pathname.startsWith("/prosjekter/denji")) return ROOMS.denji;
  if (pathname === "/prosjekter") return ROOMS.prosjekter;
  if (pathname.startsWith("/prosjekter/")) return ROOMS.prosjekt;
  if (pathname.startsWith("/cv")) return ROOMS.cv;
  if (pathname.startsWith("/bosett")) return ROOMS.bosett;
  return ROOMS.borte;
}
