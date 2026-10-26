/*
 * Pixel art lifted from Noah's own Game Boy mini-game.
 *
 * Source of truth is still src/components/halloween/DenjiGame.tsx, which draws
 * these onto a canvas. Copied rather than imported so the public site never
 * pulls in the game module (and with it anything near the private invitation).
 * If the art changes in the game, change it here too.
 *
 * Each sprite is an array of equal-length rows. One character is one pixel,
 * looked up in the palette. "." means transparent.
 */

export type Sprite = {
  art: string[];
  palette: Record<string, string>;
  /** Described for screen readers; these are content, not decoration. */
  label: string;
};

/** Noah, facing the reader. Rose clothing, which is already the brand colour. */
export const NOAH: Sprite = {
  art: [
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    ".bbbbbb.",
    ".bbbbbb.",
    "..d..d..",
  ],
  palette: {
    h: "#4a2f1c", // hår
    s: "#ffd8b1", // hud
    e: "#140d14", // øyne
    b: "#c2344f", // genser
    d: "#8d2039", // bein
  },
  label: "Pikselfigur av Noah",
};

/*
 * Noah side on, mid stride. Two frames, alternating legs, straight out of the
 * game's own BODY_LEFT plus its LEGS_H pair.
 */
const SIDE_BODY = [
  "..hhhh..",
  ".hhhhhh.",
  ".hhssss.",
  ".hesss..",
  "..ssss..",
  ".bbbbb..",
  ".bbbbb..",
];

const mirror = (art: string[]) =>
  art.map((row) => [...row].reverse().join(""));

const NOAH_PALETTE = NOAH.palette;

export const NOAH_RUN_LEFT: Sprite[] = [
  { art: [...SIDE_BODY, "..dd...."], palette: NOAH_PALETTE, label: "Noah løper" },
  { art: [...SIDE_BODY, "...dd..."], palette: NOAH_PALETTE, label: "Noah løper" },
];

export const NOAH_RUN_RIGHT: Sprite[] = NOAH_RUN_LEFT.map((frame) => ({
  ...frame,
  art: mirror(frame.art),
}));

/** Denji. The cat you are looking for in the game. */
export const DENJI: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeoeo.d",
    ".oowoo.d",
    ".ooooo.d",
    ".o...o..",
  ],
  palette: {
    o: "#ff8c1a",
    d: "#c25f06",
    e: "#120c10",
    w: "#ffd1a1",
  },
  label: "Pikselfigur av katten Denji",
};

/*
 * Companion frames.
 *
 * What the characters do on a button. Three poses each, swapped by CSS rather
 * than tweened: resting, reaching for the button, and pressing it. A sprite
 * animates by being redrawn, not by being transformed, so these are three
 * separate grids and the stylesheet decides which one is showing.
 *
 * Every frame of a set must be the same grid size or the stack will not line
 * up: Noah is 8x8 throughout, Denji 8x7.
 */
export type CompanionFrames = {
  /** Standing or sitting, doing nothing. */
  rest: Sprite;
  /** Arms or a paw out towards the button. */
  reach: Sprite;
  /** Mid-press: crouched, weight on the button. */
  press: Sprite;
};

/** Arms straight out to the sides, hands at the edges. */
const NOAH_REACH: Sprite = {
  art: [
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    "sbbbbbbs",
    ".bbbbbb.",
    "..d..d..",
  ],
  palette: NOAH_PALETTE,
  label: "Noah strekker seg",
};

/** Dropped a pixel, knees bent, hands planted down at his sides. */
const NOAH_PRESS: Sprite = {
  art: [
    "........",
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    ".bbbbbb.",
    "sdd..dds",
  ],
  palette: NOAH_PALETTE,
  label: "Noah trykker",
};

/** Stretched out wide, the moment before a pounce. */
const DENJI_REACH: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeoeo.d",
    ".oowoo.d",
    ".ooooo.d",
    "o.....o.",
  ],
  palette: DENJI.palette,
  label: "Denji strekker ut labben",
};

/** Flattened against the button, paws spread. */
const DENJI_PRESS: Sprite = {
  art: [
    "........",
    "o.....o.",
    "oo...oo.",
    ".ooooo.d",
    ".oeoeo.d",
    ".oowoo.d",
    "oo...oo.",
  ],
  palette: DENJI.palette,
  label: "Denji trykker",
};

export const NOAH_FRAMES: CompanionFrames = {
  rest: NOAH,
  reach: NOAH_REACH,
  press: NOAH_PRESS,
};

export const DENJI_FRAMES: CompanionFrames = {
  rest: DENJI,
  reach: DENJI_REACH,
  press: DENJI_PRESS,
};
