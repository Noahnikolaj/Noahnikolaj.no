import type { Sprite } from "./sprites";

/*
 * Denji, doing a different job on every project.
 *
 * She sits in the bottom left corner of the projects preview, and what she
 * is doing there answers to whichever project you are looking at. The cat is
 * already the site's mascot; this is her taking a job on each piece of work
 * rather than five abstract icons standing in for them.
 *
 * Four frames each, all on the same 8x8 grid, so one steps(4) covers the
 * lot. Only the tempo differs.
 */

const CAT = "#ff8c1a";
const CAT_DARK = "#c25f06";
const CAT_DIM = "#7a4512";
const EYE = "#120c10";
const MUZZLE = "#ffd1a1";
const INK = "#320A1E";
const ROSE = "#E4647C";
const DEEP = "#9B2742";
const NIGHT = "#1A0F18";
const GLOW = "#FFBCC8";

export type DenjiJob = {
  frames: Sprite[];
  /** One pass of the loop. */
  ms: number;
};

const sprite = (art: string[], palette: Record<string, string>, label: string): Sprite => ({
  art,
  palette,
  label,
});

/* --- Guest Food Payment: lunch, so Denji is eating ----------------------- */

const BOWL = { o: CAT, e: EYE, w: MUZZLE, m: ROSE };

const GUEST_FOOD: DenjiJob = {
  frames: [
    sprite([
      "........",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo..",
      ".oowoo..",
      ".oooooo.",
      "..mmmm..",
    ], BOWL, "Denji ser opp fra skåla"),
    sprite([
      "........",
      "........",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo..",
      ".oowooo.",
      "..mmmm..",
    ], BOWL, "Denji bøyer seg mot skåla"),
    sprite([
      "........",
      "........",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".ooooo..",
      ".oowooo.",
      "..mwwm..",
    ], BOWL, "Denji spiser"),
    sprite([
      "........",
      "........",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo..",
      ".oowooo.",
      "..mmmm..",
    ], BOWL, "Denji tygger"),
  ],
  ms: 760,
};

/* --- Deadwax: headphones on, nodding along ------------------------------- */

const PHONES = { o: CAT, e: EYE, w: MUZZLE, h: INK };

const DEADWAX: DenjiJob = {
  frames: [
    sprite([
      "..hhhh..",
      ".h....h.",
      "h.o..o.h",
      "hooooooh",
      "hoeoeooh",
      ".oowooo.",
      ".oooooo.",
      "........",
    ], PHONES, "Denji med hodetelefoner"),
    sprite([
      "........",
      "..hhhh..",
      ".h....h.",
      "h.o..o.h",
      "hooooooh",
      "hoeoeooh",
      ".oowooo.",
      ".oooooo.",
    ], PHONES, "Denji nikker til musikken"),
    sprite([
      "..hhhh..",
      ".h....h.",
      "h.o..o.h",
      "hooooooh",
      "hoeoeooh",
      ".oowooo.",
      ".oooooo.",
      "........",
    ], PHONES, "Denji med hodetelefoner"),
    sprite([
      "........",
      "..hhhh..",
      ".h....h.",
      "h.o..o.h",
      "hooooooh",
      "hooooooh",
      ".oowooo.",
      ".oooooo.",
    ], PHONES, "Denji blunker til musikken"),
  ],
  ms: 620,
};

/* --- Bosett: arriving somewhere new, so Denji has luggage ---------------- */

const CASE = { o: CAT, e: EYE, w: MUZZLE, s: DEEP, k: INK };

const BOSETT: DenjiJob = {
  frames: [
    sprite([
      "........",
      "o...o...",
      "ooooo.k.",
      "oeoeo.ss",
      "oowoosss",
      "ooooosss",
      "o...osss",
      "........",
    ], CASE, "Denji med koffert"),
    sprite([
      "........",
      "o...o...",
      "ooooo.k.",
      "oeoeo.ss",
      "oowoosss",
      "ooooosss",
      ".o.o.sss",
      "........",
    ], CASE, "Denji tar et steg"),
    sprite([
      "........",
      "o...o...",
      "ooooo.k.",
      "ooooo.ss",
      "oowoosss",
      "ooooosss",
      "o...osss",
      "........",
    ], CASE, "Denji blunker"),
    sprite([
      "........",
      "o...o...",
      "ooooo.k.",
      "oeoeo.ss",
      "oowoosss",
      "ooooosss",
      ".oo..sss",
      "........",
    ], CASE, "Denji tar et steg til"),
  ],
  ms: 900,
};

/* --- PixiWorld: a platform for talking, so Denji has something to say ---- */

const TALK = { o: CAT, e: EYE, w: MUZZLE, d: CAT_DARK, b: DEEP };

const PIXIWORLD: DenjiJob = {
  frames: [
    sprite([
      "........",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo.d",
      ".oowoo.d",
      ".ooooo.d",
      ".o...o..",
    ], TALK, "Denji sier ingenting"),
    sprite([
      "....b...",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo.d",
      ".oowoo.d",
      ".ooooo.d",
      ".o...o..",
    ], TALK, "Denji begynner å si noe"),
    sprite([
      "...bbb..",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".oeoeo.d",
      ".oowoo.d",
      ".ooooo.d",
      ".o...o..",
    ], TALK, "Denji sier noe"),
    sprite([
      "..bbbb..",
      "o.....o.",
      "oo...oo.",
      ".ooooo..",
      ".ooooo.d",
      ".oowoo.d",
      ".ooooo.d",
      ".o...o..",
    ], TALK, "Denji sier noe og blunker"),
  ],
  ms: 1000,
};

/* --- The game: she is the thing you are looking for ---------------------- */

const CAVE = { n: NIGHT, g: GLOW, m: CAT_DIM, w: MUZZLE };

const DENJI_GAME: DenjiJob = {
  frames: [
    sprite([
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nngnngnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
    ], CAVE, "Et par øyne i mørket"),
    sprite([
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
    ], CAVE, "Mørket"),
    sprite([
      "nnnnnnnn",
      "mnnnnnmn",
      "mmnnnmmn",
      "nmgmgmnn",
      "nmmwmmnn",
      "nmmmmmnn",
      "nmnnnmnn",
      "nnnnnnnn",
    ], CAVE, "Denji så vidt synlig i mørket"),
    sprite([
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nngnngnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
      "nnnnnnnn",
    ], CAVE, "Et par øyne i mørket"),
  ],
  ms: 1400,
};

/** Keyed by project slug. A project without one simply gets no cat. */
export const DENJI_JOBS: Record<string, DenjiJob> = {
  "guest-food-payment": GUEST_FOOD,
  deadwax: DEADWAX,
  bosett: BOSETT,
  pixiworld: PIXIWORLD,
  denji: DENJI_GAME,
};
