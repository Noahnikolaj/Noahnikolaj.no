/*
 * Tilting the phone, as an input.
 *
 * On a phone there is no pointer, so the portrait and the world listen to
 * this instead: tip the phone left and right, toward and away from you, and
 * they turn the way they turn for a mouse on desktop. The first reading
 * after starting is taken as level, so however the phone is being held
 * counts as the middle.
 *
 * iOS only hands out orientation after the reader says yes, from a tap; see
 * TiltKey. Elsewhere it simply starts.
 */
export type Tilt = { x: number; y: number };

let tilt: Tilt = { x: 0, y: 0 };
let running = false;
let level: number | null = null;
const listeners = new Set<(t: Tilt) => void>();
const stateListeners = new Set<() => void>();

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function onOrientation(event: DeviceOrientationEvent) {
  if (event.gamma == null || event.beta == null) return;
  if (level === null) level = event.beta;
  const next = { x: clamp(event.gamma / 30), y: clamp((event.beta - level) / 25) };
  // Ignore the tremor of a hand holding still.
  if (Math.abs(next.x - tilt.x) + Math.abs(next.y - tilt.y) < 0.02) return;
  tilt = next;
  listeners.forEach((fn) => fn(tilt));
}

type WithPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

export function tiltAvailable() {
  return typeof window !== "undefined" && "DeviceOrientationEvent" in window;
}

export function tiltNeedsPermission() {
  return (
    tiltAvailable() &&
    typeof (DeviceOrientationEvent as unknown as WithPermission).requestPermission === "function"
  );
}

/** Must be called from a tap on iOS. Resolves to whether tilt is now on. */
export async function startTilt(): Promise<boolean> {
  if (running) return true;
  if (!tiltAvailable()) return false;
  const ask = (DeviceOrientationEvent as unknown as WithPermission).requestPermission;
  if (typeof ask === "function") {
    try {
      if ((await ask()) !== "granted") return false;
    } catch {
      return false;
    }
  }
  level = null;
  window.addEventListener("deviceorientation", onOrientation);
  running = true;
  stateListeners.forEach((fn) => fn());
  return true;
}

export function stopTilt() {
  window.removeEventListener("deviceorientation", onOrientation);
  running = false;
  tilt = { x: 0, y: 0 };
  listeners.forEach((fn) => fn(tilt));
  stateListeners.forEach((fn) => fn());
}

export function tiltRunning() {
  return running;
}

export function onTilt(fn: (t: Tilt) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function onTiltState(fn: () => void) {
  stateListeners.add(fn);
  return () => {
    stateListeners.delete(fn);
  };
}
