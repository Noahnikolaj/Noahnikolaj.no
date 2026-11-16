/*
 * The sky keeps Oslo time.
 *
 * Each room has its own colour of air (rooms.ts). On top of that the light
 * follows the actual hour in Oslo, as a light touch on the pink rather than
 * a change of colour: a little warmer at dawn, the room's own colour through
 * the day, a little cooler at dusk and at night, when the stars come out.
 * Pink stays the colour of the site at every hour.
 *
 * Text stands straight on the sky in places, so whatever the mix comes out
 * as is held at a measured floor: relative luminance 0.47 keeps the muted
 * ink #6E3344 at 4.6:1 and the plum ink above 8:1. If a mix lands darker,
 * it is lifted toward white until it clears.
 *
 * ?tid=morgen|dag|kveld|natt pins a time, for looking at all four.
 */
export type Phase = "morgen" | "dag" | "kveld" | "natt";

const PHASE_LIGHT: Record<Phase, { color: string; amount: number }> = {
  morgen: { color: "#FFD2BF", amount: 0.28 },
  dag: { color: "#FFFFFF", amount: 0 },
  kveld: { color: "#E7A6CC", amount: 0.25 },
  natt: { color: "#D2B6E4", amount: 0.3 },
};

const MIN_LUMINANCE = 0.47;

export function osloPhase(now = new Date()): Phase {
  if (typeof window !== "undefined") {
    const pinned = new URLSearchParams(window.location.search).get("tid");
    if (pinned === "morgen" || pinned === "dag" || pinned === "kveld" || pinned === "natt") {
      return pinned;
    }
  }
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Europe/Oslo",
    }).format(now),
  );
  if (hour >= 5 && hour < 8) return "morgen";
  if (hour >= 8 && hour < 17) return "dag";
  if (hour >= 17 && hour < 21) return "kveld";
  return "natt";
}

type RGB = [number, number, number];

const toRGB = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = ([r, g, b]: RGB) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]: RGB) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** The room's air at this phase of the day, never darker than text allows. */
export function skyFor(roomSky: string, phase: Phase): string {
  const light = PHASE_LIGHT[phase];
  let rgb = mix(toRGB(roomSky), toRGB(light.color), light.amount);
  for (let i = 0; i < 20 && luminance(rgb) < MIN_LUMINANCE; i++) {
    rgb = mix(rgb, [255, 255, 255], 0.06);
  }
  return toHex(rgb);
}
