import type { Sprite } from "./sprites";

/*
 * One drawn mark per project, animated.
 *
 * The index rows carry a title, a role and a period, which tells you what
 * each project is but gives you nothing to recognise it by at a glance. A
 * mark does that, and because it is drawn rather than an icon from a set, it
 * can say something specific: the record turns, the timeline fills in, the
 * cat is hiding in the dark.
 *
 * Four frames each, so one steps(4) covers all of them, and all on the same
 * 8x8 grid. Only the tempo differs, because a record spinning and a pair of
 * eyes blinking are not the same speed.
 */

const INK = "#320A1E";
const PAPER = "#FFEEF1";
const ROSE = "#E4647C";
const DEEP = "#9B2742";
const EDGE = "#D98DA0";
const NIGHT = "#1A0F18";
const GLOW = "#FFBCC8";

export type ProjectMark = {
  frames: Sprite[];
  /** One pass of the loop. */
  ms: number;
};

/* --- Guest Food Payment: a phone, an order going through ----------------- */

const PHONE_PALETTE = { p: INK, w: PAPER, r: ROSE };

const phone = (screen: string[]): Sprite => ({
  art: [".pppppp.", ...screen, ".pppppp.", "........"],
  palette: PHONE_PALETTE,
  label: "Mobilskjerm",
});

const GUEST_FOOD: ProjectMark = {
  frames: [
    phone([".pwwwwp.", ".pwwwwp.", ".pwwwwp.", ".pwwwwp.", ".pwwwwp."]),
    phone([".pwwwwp.", ".prrrwp.", ".pwwwwp.", ".pwwwwp.", ".pwwwwp."]),
    phone([".pwwwwp.", ".prrrwp.", ".prrwwp.", ".pwwwwp.", ".pwwwwp."]),
    phone([".pwwwwp.", ".prrrwp.", ".prrwwp.", ".pwwwwp.", ".prrrrp."]),
  ],
  ms: 900,
};

/* --- Deadwax: a record, and the shine turning on it ---------------------- */

const RECORD_PALETTE = { r: INK, c: ROSE, w: PAPER };

/*
 * The shine is what turns, not the disc: a disc this round looks identical
 * at every angle. A streak across the face reads as rotation, and it has to
 * sit INSIDE the disc. A first version put a single pixel on the rim, where
 * it had nothing to contrast against and disappeared.
 */
const record = (rows: string[]): Sprite => ({
  art: ["..rrrr..", rows[0], rows[1], rows[2], rows[3], rows[4], rows[5], "..rrrr.."],
  palette: RECORD_PALETTE,
  label: "Plate som snurrer",
});

const DEADWAX: ProjectMark = {
  frames: [
    // Vertical.
    record([".rrwwrr.", "rrrwwrrr", "rrrccrrr", "rrrccrrr", "rrrwwrrr", ".rrwwrr."]),
    // Leaning one way.
    record([".rrrrwr.", "rrrrrwrr", "rrrccrrr", "rrrccrrr", "rrwrrrrr", ".rwrrrr."]),
    // Flat.
    record([".rrrrrr.", "rwwrrrrr", "rwwccwwr", "rwwccwwr", "rrrrrwwr", ".rrrrrr."]),
    // Leaning the other way.
    record([".rwrrrr.", "rrwrrrrr", "rrrccrrr", "rrrccrrr", "rrrrrwrr", ".rrrrwr."]),
  ],
  ms: 520,
};

/* --- Bosett: a timeline filling in, one step at a time ------------------- */

const TIMELINE_PALETTE = { e: EDGE, f: DEEP, k: INK };

const timeline = (a: string, b: string, c: string): Sprite => ({
  art: [
    `..${a}${a}${a}${a}..`,
    "...kk...",
    "...kk...",
    `..${b}${b}${b}${b}..`,
    "...kk...",
    "...kk...",
    `..${c}${c}${c}${c}..`,
    "........",
  ],
  palette: TIMELINE_PALETTE,
  label: "Tidslinje som fylles ut",
});

const BOSETT: ProjectMark = {
  frames: [
    timeline("e", "e", "e"),
    timeline("f", "e", "e"),
    timeline("f", "f", "e"),
    timeline("f", "f", "f"),
  ],
  ms: 1200,
};

/* --- PixiWorld: two children talking, turn and turn about ---------------- */

/*
 * Two speech bubbles rather than two figures. A person drawn three pixels
 * wide is a smudge, and the first attempt put a paper-coloured bubble on the
 * paper-coloured page, which was invisible. Bubbles are legible at this size
 * and a conversation going back and forth is the thing worth saying about a
 * social platform for children anyway.
 */
const CHAT_PALETTE = { d: DEEP, e: EDGE };

const chat = (l: string, r: string): Sprite => ({
  art: [
    `${l}${l}${l}${l}....`,
    `${l}${l}${l}${l}....`,
    `${l}${l}......`,
    "........",
    `....${r}${r}${r}${r}`,
    `....${r}${r}${r}${r}`,
    `......${r}${r}`,
    "........",
  ],
  palette: CHAT_PALETTE,
  label: "To snakkebobler",
});

const PIXIWORLD: ProjectMark = {
  frames: [chat("d", "e"), chat("e", "e"), chat("e", "d"), chat("e", "e")],
  ms: 1000,
};

/* --- Denji: the cat you are looking for, in the dark --------------------- */

const DARK_PALETTE = { n: NIGHT, g: GLOW };

const dark = (row2: string, row3: string): Sprite => ({
  art: [
    "nnnnnnnn",
    "nnnnnnnn",
    row2,
    row3,
    "nnnnnnnn",
    "nnnnnnnn",
    "nnnnnnnn",
    "nnnnnnnn",
  ],
  palette: DARK_PALETTE,
  label: "Et par øyne i mørket",
});

const DENJI_GAME: ProjectMark = {
  frames: [
    dark("nnnnnnnn", "nngnngnn"),
    dark("nnnnnnnn", "nnnnnnnn"),
    dark("nnnnnnnn", "nngnngnn"),
    dark("nngnngnn", "nnnnnnnn"),
  ],
  ms: 1400,
};

/** Keyed by project slug. A project without one simply has no mark. */
export const PROJECT_MARKS: Record<string, ProjectMark> = {
  "guest-food-payment": GUEST_FOOD,
  deadwax: DEADWAX,
  bosett: BOSETT,
  pixiworld: PIXIWORLD,
  denji: DENJI_GAME,
};
