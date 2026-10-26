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

/* ==========================================================================
   COMPANION ANIMATION

   What the characters do on a button.

   A sprite animates by being redrawn, so these are whole poses, not one
   drawing pushed around by CSS. Only the distinct poses are authored; the
   loops below repeat them, which is why six frames of animation cost three
   drawings.

   Every pose in a set must share a grid or the strip will not line up: Noah
   is 8x8 throughout, Denji 8x7.
   ========================================================================== */

/*
 * A wink, not a blink. Closing both eyes at this size deletes the face, and
 * at 250ms a frame that is long enough to read as a blank rather than as an
 * eyelid. Keeping one eye open says the same thing and stays a face.
 */
const NOAH_WINK: Sprite = {
  art: [
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesssh.",
    "..ssss..",
    ".bbbbbb.",
    ".bbbbbb.",
    "..d..d..",
  ],
  palette: NOAH_PALETTE,
  label: "Noah blunker",
};

/** Arms straight out to the sides: winding up. */
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

/** Hands planted down at his sides, still at full height. */
const NOAH_TAP: Sprite = {
  art: [
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    ".bbbbbb.",
    ".bbbbbb.",
    "sdd..dds",
  ],
  palette: NOAH_PALETTE,
  label: "Noah strekker hendene ned",
};

/** The same, dropped a pixel: the landing. */
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

const DENJI_PALETTE = DENJI.palette;

/** A wink, for the same reason as Noah's. */
const DENJI_WINK: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeooo.d",
    ".oowoo.d",
    ".ooooo.d",
    ".o...o..",
  ],
  palette: DENJI_PALETTE,
  label: "Denji blunker",
};

/** A paw out to the side, batting at the button. */
const DENJI_PAW: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeoeo.d",
    ".oowoo.d",
    "oooooo.d",
    ".o...o..",
  ],
  palette: DENJI_PALETTE,
  label: "Denji slår etter knappen",
};

/** Legs out wide: the stretch before a pounce. */
const DENJI_STRETCH: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeoeo.d",
    ".oowoo.d",
    ".ooooo.d",
    "o.....o.",
  ],
  palette: DENJI_PALETTE,
  label: "Denji strekker seg",
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
  palette: DENJI_PALETTE,
  label: "Denji trykker",
};

/* --- Hauling themselves up over the edge ---------------------------------
 *
 * The window clips whatever has not risen yet, so these are the poses the
 * climb passes through rather than a character sliding up rigid.
 */

/** Hanging off the edge, both arms overhead. */
const NOAH_HANG: Sprite = {
  art: [
    "s.hhhh.s",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    ".bbbbbb.",
    ".bbbbbb.",
    "..d..d..",
  ],
  palette: NOAH_PALETTE,
  label: "Noah henger i kanten",
};

/** Mid-pull: one arm still up, the other pushing down. */
const NOAH_PULL: Sprite = {
  art: [
    "s.hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    ".bbbbbbs",
    ".bbbbbb.",
    "..d..d..",
  ],
  palette: NOAH_PALETTE,
  label: "Noah drar seg opp",
};

/** A knee over the edge, nearly up. */
const NOAH_KNEE: Sprite = {
  art: [
    "..hhhh..",
    ".hhhhhh.",
    ".hssssh.",
    ".sesesh.",
    "..ssss..",
    "sbbbbbb.",
    ".bbbbbb.",
    ".dd...d.",
  ],
  palette: NOAH_PALETTE,
  label: "Noah får kneet over kanten",
};

/*
 * Denji's climb, in silhouettes rather than details.
 *
 * The first version changed two or three pixels a frame and read as nothing
 * happening. These change the shape of the whole cat instead: hanging thin,
 * then bunched up, then sprawled over the edge, then sitting.
 */

/** Hanging by the front paws, body stretched thin, back legs together. */
const DENJI_HANG: Sprite = {
  art: [
    "oo...oo.",
    ".ooooo..",
    ".oeoeo..",
    ".oowoo..",
    "..ooo..d",
    "..ooo..d",
    "..o.o...",
  ],
  palette: DENJI_PALETTE,
  label: "Denji henger i kanten",
};

/** Bunched up: shoulders wide, hauling herself over. */
const DENJI_PULL: Sprite = {
  art: [
    "oo...oo.",
    "oooooooo",
    ".oeoeo.d",
    ".oowoo.d",
    ".ooooo.d",
    "ooooooo.",
    "o.....o.",
  ],
  palette: DENJI_PALETTE,
  label: "Denji drar seg opp",
};

/** Belly over the edge, legs out sideways. */
const DENJI_OVER: Sprite = {
  art: [
    "o.....o.",
    "oo...oo.",
    ".ooooo..",
    ".oeoeo.d",
    "oooooood",
    "oo...oo.",
    "o.....o.",
  ],
  palette: DENJI_PALETTE,
  label: "Denji ruller over kanten",
};

export type CompanionFrames = {
  /** Plays once on arrival, while the window is still revealing them. */
  climb: Sprite[];
  /** Loops once they are up. */
  idle: Sprite[];
  /** Plays once while the button is held, and holds its last pose. */
  press: Sprite[];
  /** How long one pass of the idle loop takes. Their difference in tempo is
   *  half of what separates the two characters. */
  idleMs: number;
};

/*
 * Noah is deliberate. He gets up, waits, winks, waits again, and only then
 * knocks on the button, twice. Slow loop.
 */
export const NOAH_FRAMES: CompanionFrames = {
  climb: [NOAH_HANG, NOAH_PULL, NOAH_KNEE, NOAH],
  idle: [NOAH, NOAH, NOAH_WINK, NOAH, NOAH_REACH, NOAH_TAP, NOAH_REACH, NOAH_TAP],
  press: [NOAH_REACH, NOAH_TAP, NOAH_PRESS],
  idleMs: 1800,
};

/*
 * Denji is a cat. She scrambles up, sits very still, and then bats at the
 * thing twice without warning. Same eight slots, two thirds of the time.
 */
export const DENJI_FRAMES: CompanionFrames = {
  climb: [DENJI_HANG, DENJI_PULL, DENJI_OVER, DENJI],
  idle: [DENJI, DENJI, DENJI, DENJI_WINK, DENJI, DENJI_PAW, DENJI, DENJI_PAW],
  press: [DENJI_STRETCH, DENJI_PAW, DENJI_PRESS],
  idleMs: 1100,
};
