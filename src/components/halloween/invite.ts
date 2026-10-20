/* ------------------------------------------------------------------ */
/*  Invitation details — the only place these are defined.            */
/*  If you change the date or time, change BOTH the display strings   */
/*  and the EVENT_* values below so the calendar file stays in sync.  */
/* ------------------------------------------------------------------ */

export const GUEST = "Silje";
export const DATE = "26. oktober";
export const TIME = "kl. 19:00";
export const PLACE = "Brenneriveien 11d";

/** Same moment as DATE + TIME, in calendar format: YYYYMMDDTHHMMSS (local). */
export const EVENT_START = "20261026T190000";
export const EVENT_END = "20261026T230000";

export const ACTIVITIES = [
  { icon: "🍕", label: "Skummel pizza" },
  { icon: "🎮", label: "Horror games" },
  { icon: "🎬", label: "Skrekkfilm" },
  { icon: "🍬", label: "Altfor mye godteri" },
];
