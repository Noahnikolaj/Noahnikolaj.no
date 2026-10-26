/*
 * Coin flip between two real views.
 *
 * Any overlay-based transition has to fill the screen with some flat colour
 * while the old view is gone and the new one has not arrived. In dark mode
 * that colour is the near-black page background, which is the black flash.
 *
 * The View Transitions API avoids it entirely: the browser keeps a snapshot of
 * the outgoing view and the incoming view at the same time, so one is the
 * front face of the coin and the other is the back. Nothing flat is ever
 * shown.
 *
 * A navigation finishes asynchronously, so we hand the browser a promise and
 * resolve it from the template once the new route has rendered.
 */

let settle: (() => void) | null = null;

/*
 * The wave starts from whatever was clicked.
 *
 * Rows are ranked by how far they sit from the click, and each one is told
 * when its slice of the run begins. The stylesheet reads these off the root
 * element, and custom properties inherit down into the view transition
 * pseudo-elements.
 *
 * Kept in step with globals.css by hand: both sides have to agree on how many
 * rows there are and how long one row takes.
 */
const FLIP_ROWS = 14;
const FLIP_SLICE = 0.45;

export function setFlipDuration(ms: number) {
  document.documentElement.style.setProperty("--flip-duration", `${ms}ms`);
}

export function setFlipOrigin(x: number, y: number) {
  const root = document.documentElement;
  const height = window.innerHeight || 1;
  const clicked = (y / height) * FLIP_ROWS;

  // Line the block grid up with the column that was pressed, so the first
  // shutter to move has an edge under the finger rather than near it.
  const block = height / FLIP_ROWS;
  root.style.setProperty("--flip-nudge", `${(x % block).toFixed(1)}px`);

  const away: number[] = [];
  for (let row = 0; row < FLIP_ROWS; row++) {
    away.push(Math.abs(row + 0.5 - clicked));
  }
  // Normalised against the furthest row, so the last one to turn always
  // starts late enough to finish exactly on time.
  const furthest = Math.max(...away) || 1;

  for (let row = 0; row < FLIP_ROWS; row++) {
    const begins = (away[row] / furthest) * (1 - FLIP_SLICE);
    root.style.setProperty(`--row-begins-${row}`, begins.toFixed(4));
  }
}

export function supportsViewTransition() {
  return (
    typeof document !== "undefined" &&
    typeof (document as Document & { startViewTransition?: unknown })
      .startViewTransition === "function"
  );
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type ViewTransition = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition?: () => void;
};

type DocumentWithVT = Document & {
  startViewTransition: (callback: () => void | Promise<void>) => ViewTransition;
};

/*
 * A view transition aborts if the viewport resizes while it is running, and
 * on a phone that happens routinely: the URL bar slides away as the page
 * changes. The browser rejects `ready` and `finished` with an
 * InvalidStateError, which surfaces as an unhandled rejection and an error
 * overlay in development.
 *
 * Nothing is actually broken when this happens; the navigation still
 * completes, it just skips the animation. So swallow the abort and make sure
 * the route is released either way.
 */
function survivesAbort(transition: ViewTransition) {
  const released = () => {
    settle?.();
    settle = null;
  };
  transition.ready.catch(released);
  transition.finished.catch(released);
}

/** Runs `commit` inside a view transition, resolving when the route lands. */
export function flipTo(commit: () => void) {
  if (!supportsViewTransition() || prefersReducedMotion()) {
    commit();
    return;
  }

  // Interrupting one transition with another: release the first so its
  // promise cannot sit unresolved while the browser skips it.
  settle?.();
  settle = null;

  let landed = false;
  let abandon: (() => void) | null = null;

  const transition = (document as DocumentWithVT).startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        settle = () => {
          landed = true;
          resolve();
        };
        commit();
        /*
         * Safety net.
         *
         * Resolving this early is worse than not flipping at all. The browser
         * captures the incoming snapshot the moment the promise settles, so
         * an early resolve captures the page we are leaving: the flip then
         * turns one view into an identical copy of itself, and the real page
         * arrives afterwards with no animation on it.
         *
         * On a phone that was the normal case, not the edge case. A cold
         * route measured close to four seconds over a throttled connection,
         * where the old 1200ms limit fired long before the route landed.
         *
         * So give the route room, and if it still has not arrived, drop the
         * transition rather than animate nothing. Chrome kills a transition
         * of its own accord at four seconds, so stay under that.
         */
        setTimeout(() => {
          if (landed) return;
          abandon?.();
          settle?.();
          settle = null;
        }, 2500);
      }),
  );
  abandon = () => transition.skipTransition?.();
  survivesAbort(transition);
}

/*
 * The first flip on a page is the expensive one, and it is expensive in ways
 * that have nothing to do with the flip itself: the browser has to allocate
 * two full-screen snapshot textures, meet the registered property for the
 * first time, and parse the row masks from scratch. Paying for all of that on
 * the first tap is what makes the first transition feel heavier than every
 * one after it.
 *
 * So spend it while the page is sitting idle instead. A transition with no
 * DOM change and a 1ms run is invisible, and it leaves the machinery warm.
 */
let warmed = false;

export function warmFlip() {
  if (warmed || !supportsViewTransition() || prefersReducedMotion()) return;
  warmed = true;

  const root = document.documentElement;
  const previous = root.style.getPropertyValue("--flip-duration");
  const restore = () => {
    if (previous) root.style.setProperty("--flip-duration", previous);
    else root.style.removeProperty("--flip-duration");
  };
  root.style.setProperty("--flip-duration", "1ms");

  try {
    const transition = (document as DocumentWithVT).startViewTransition(
      () => {},
    );
    transition.finished.then(restore).catch(restore);
  } catch {
    restore();
  }
}

/** Called once the new route has rendered. */
export function settleTransition() {
  settle?.();
  settle = null;
}
