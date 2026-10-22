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
 * The wave starts from whatever was clicked. The worklet reads these off the
 * root element, and custom properties inherit down into the view transition
 * pseudo-elements.
 */
export function setFlipDuration(ms: number) {
  document.documentElement.style.setProperty("--flip-duration", `${ms}ms`);
}

export function setFlipOrigin(x: number, y: number) {
  const root = document.documentElement;
  root.style.setProperty("--flip-x", String(Math.round(x)));
  root.style.setProperty("--flip-y", String(Math.round(y)));
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

  const transition = (document as DocumentWithVT).startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        settle = resolve;
        commit();
        // Safety net: never leave the page frozen if the route never settles.
        setTimeout(() => {
          settle?.();
          settle = null;
        }, 1200);
      }),
  );
  survivesAbort(transition);
}

/** Called once the new route has rendered. */
export function settleTransition() {
  settle?.();
  settle = null;
}

/**
 * Theme changes are instant, but the nav animates differently for them, so
 * the document is marked for the duration.
 */
export function flipTheme(commit: () => void) {
  if (!supportsViewTransition() || prefersReducedMotion()) {
    commit();
    return;
  }
  const root = document.documentElement;
  root.classList.add("theme-switch");
  const transition = (document as DocumentWithVT).startViewTransition(() => {
    commit();
  });
  // .finally() re-throws a rejection; .catch() is what actually swallows an
  // abort when the viewport resizes mid-transition.
  const done = () => root.classList.remove("theme-switch");
  transition.finished.then(done).catch(done);
}
