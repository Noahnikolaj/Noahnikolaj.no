/*
 * Every route is a room, and every room is a place in one world.
 *
 * The world is a single 3D scene behind every page (WorldBackdrop.tsx). A
 * room is a spot along it: changing page moves the camera to that spot, and
 * the air takes the room's colour on the way.
 *
 * `sky` is the colour of the air. Text can sit straight on it, so every sky
 * is measured against the two inks that do: plum #320A1E and the muted
 * #6E3344. Worst pair below is the muted ink on the cave, 4.67:1.
 *
 * `tint` is the room's own colour, used for the paint on its door.
 */
export type Room = {
  id: string;
  /** RGB channels of the room's colour, for its door. */
  tint: string;
  /** The air. */
  sky: string;
  /** Where along the world the room is. */
  station: number;
};

const ROOMS: Record<string, Room> = {
  // Outside, under the clouds. Plum 10.1, muted 5.46.
  hjem: { id: "hjem", tint: "228 100 124", sky: "#F6B3C0", station: 0 },
  // The gallery, a deeper rose than outside. Plum 9.6, muted 5.1.
  prosjekter: { id: "prosjekter", tint: "201 84 143", sky: "#F2AABF", station: 32 },
  // One picture, a step further into the gallery.
  prosjekt: { id: "prosjekt", tint: "201 84 143", sky: "#F2AABF", station: 40 },
  // The archive. Plum 8.6, muted 4.67.
  cv: { id: "cv", tint: "163 63 99", sky: "#E6A3B8", station: 70 },
  // The prototype room, in Bosett's own coral. Plum 10.1, muted 5.4.
  bosett: { id: "bosett", tint: "224 122 144", sky: "#F4B6A8", station: 100 },
  // The cave: dusk rather than dark, so text can still stand in it. Plum 8.6, muted 4.67.
  denji: { id: "denji", tint: "42 27 53", sky: "#C4AFCB", station: 130 },
  // Nowhere in particular.
  borte: { id: "borte", tint: "122 59 92", sky: "#EDB0C2", station: 160 },
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

export const STATIONS = Object.values(ROOMS)
  .map((room) => room.station)
  .filter((x, i, all) => all.indexOf(x) === i);
