export const TILE = 8;
export const COLS = 20;
export const ROWS = 18;
export const W = COLS * TILE; // 160
export const H = ROWS * TILE; // 144

/**
 * Four rooms in a hub-and-spoke layout: room 0 is the hub she starts in, and
 * rooms 1-3 hang off its left, right and bottom doors. '.' is floor, 'd' is a
 * doorway (walkable, triggers a room change), everything else is solid
 * furniture that doubles as a hiding spot.
 */
export const MAPS: string[][] = [
  // 0 — THE STAGE (hub)
  [
    "####################",
    "#..................#",
    "#..CCCCCCCCCCCCCC..#",
    "#..TTTTTTTTTTTTTT..#",
    "#..................#",
    "#....AA......AA....#",
    "#....AA......AA....#",
    "#..................#",
    "d..................d",
    "d..................d",
    "#..................#",
    "#..SS..........SS..#",
    "#..SS..........SS..#",
    "#..................#",
    "#.....BB....BB.....#",
    "#.....BB....BB.....#",
    "#..................#",
    "#########dd#########",
  ],
  // 1 — BACKSTAGE (through the left door)
  [
    "####################",
    "#..................#",
    "#.BB..BB..BB..BB...#",
    "#.BB..BB..BB..BB...#",
    "#..................#",
    "#....PP.......PP...#",
    "#..................#",
    "#.AAAA.........AA..#",
    "#.AAAA.............d",
    "#..................d",
    "#.........SSSS.....#",
    "#.........SSSS.....#",
    "#..................#",
    "#..TT..........TT..#",
    "#..TT..........TT..#",
    "#..................#",
    "#....BBBB..........#",
    "####################",
  ],
  // 2 — THE KITCHEN (through the right door)
  [
    "####################",
    "#..................#",
    "#.TTTTTT....TTTTTT.#",
    "#.TTTTTT....TTTTTT.#",
    "#..................#",
    "#..................#",
    "#..BB..........BB..#",
    "#..BB..........BB..#",
    "d..................#",
    "d..................#",
    "#......AAAA........#",
    "#......AAAA........#",
    "#..................#",
    "#.CC...........CC..#",
    "#.CC...........CC..#",
    "#..................#",
    "#....PP......PP....#",
    "####################",
  ],
  // 3 — STORAGE (through the bottom door)
  [
    "#########dd#########",
    "#..................#",
    "#..................#",
    "#.SS..BBBB....SS...#",
    "#.SS..BBBB....SS...#",
    "#..................#",
    "#.....PP....PP.....#",
    "#..................#",
    "#..AAAA......TTTT..#",
    "#..AAAA......TTTT..#",
    "#..................#",
    "#..................#",
    "#.BBBB.......BBBB..#",
    "#.BBBB.......BBBB..#",
    "#..................#",
    "#......CCCCCC......#",
    "#..................#",
    "####################",
  ],
];

export const ROOM_NAMES = ["THE STAGE", "BACKSTAGE", "THE KITCHEN", "STORAGE"];

export type Door = {
  /** Door tiles in this room, as [tx, ty]. */
  tiles: [number, number][];
  to: number;
  /** Tile the player lands on in the destination room. */
  entry: [number, number];
};

export const DOORS: Door[][] = [
  // from room 0
  [
    { tiles: [[0, 8], [0, 9]], to: 1, entry: [17, 8] },
    { tiles: [[19, 8], [19, 9]], to: 2, entry: [2, 8] },
    { tiles: [[9, 17], [10, 17]], to: 3, entry: [9, 2] },
  ],
  // from room 1 — back to the hub
  [{ tiles: [[19, 8], [19, 9]], to: 0, entry: [2, 8] }],
  // from room 2 — back to the hub
  [{ tiles: [[0, 8], [0, 9]], to: 0, entry: [17, 8] }],
  // from room 3 — back to the hub
  [{ tiles: [[9, 0], [10, 0]], to: 0, entry: [9, 15] }],
];

export const START_ROOM = 0;
export const START_TILE: [number, number] = [10, 9];

/** Floor tiles tucked against furniture, used for Denji and Foxy. */
export const HIDING_SPOTS: [number, number][][] = [
  [], // nothing hides in the hub — she always has to leave it
  [[17, 2], [3, 10], [9, 15], [17, 13]],
  [[10, 2], [4, 13], [17, 10], [9, 16]],
  [[17, 3], [7, 8], [10, 12], [3, 16]],
];

export const solidAt = (room: number, tx: number, ty: number) => {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
  const ch = MAPS[room][ty][tx];
  return ch !== "." && ch !== "d";
};

/** Feet-only hitbox, so she can tuck in behind furniture. */
export const canStand = (room: number, px: number, py: number) => {
  const x0 = px + 1;
  const x1 = px + 6;
  const y0 = py + 3;
  const y1 = py + 7;
  return !(
    solidAt(room, Math.floor(x0 / TILE), Math.floor(y0 / TILE)) ||
    solidAt(room, Math.floor(x1 / TILE), Math.floor(y0 / TILE)) ||
    solidAt(room, Math.floor(x0 / TILE), Math.floor(y1 / TILE)) ||
    solidAt(room, Math.floor(x1 / TILE), Math.floor(y1 / TILE))
  );
};
