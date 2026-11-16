/*
 * Whether the title screen is up.
 *
 * The title screen is set by the page, but the world behind it (camera,
 * the name in cubes) and the floor (which waits to rise) both answer to
 * it, so it lives here where all three can see it.
 */
let active = false;
const listeners = new Set<() => void>();

export function titleActive() {
  return active;
}

export function setTitleActive(value: boolean) {
  if (active === value) return;
  active = value;
  listeners.forEach((fn) => fn());
}

export function onTitleChange(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
