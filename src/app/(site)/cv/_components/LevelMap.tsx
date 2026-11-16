"use client";

import * as React from "react";

import { Sprite } from "@/components/pixel/Sprite";
import { SpriteStrip } from "@/components/pixel/SpriteStrip";
import {
  NOAH,
  NOAH_RUN_LEFT,
  NOAH_RUN_RIGHT,
  type Sprite as SpriteData,
} from "@/components/pixel/sprites";
import { cn } from "@/lib/utils";

/*
 * The CV as a world map.
 *
 * Every job and degree is an island, numbered in the order it started,
 * each with a landmark of the place drawn in pixels: columns for UiO, a
 * gate for Korea, the campus for Kristiania, an office tower for Welcome
 * Workdays. The road runs up to the one still going, where Noah stands
 * with the arrow over him. Anything that started after it and is already
 * done happened along the way, so it hangs off that island on a branch,
 * the way a bonus level does. Past it, a grey island down a dotted road:
 * the next level, still locked, which opens your mail to him.
 *
 * Choosing an island walks him there along the road, one stop at a time,
 * then takes you down to that entry and lights it up. Every island is a
 * plain link to its entry, so without JavaScript, or with a screen reader,
 * the map is simply a table of contents.
 */
export type Level = {
  id: string;
  name: string;
  /** Which landmark stands on the island. */
  place: "korea" | "uio" | "kontor" | "kristiania";
  current: boolean;
};

const K = "#320A1E"; // plum outline
const PAL = {
  k: K,
  r: "#E4647C",
  d: "#9B2742",
  w: "#FFF6F8",
  y: "#FFE08A",
  p: "#FF8FA8",
  s: "#BFE3F2",
  g: "#8C7A84",
};

const art = (rows: string[]): SpriteData => ({ art: rows, palette: PAL, label: "" });

const LANDMARKS: Record<Level["place"] | "neste", SpriteData> = {
  // A gate with two curved roofs.
  korea: art([
    "....kkkk....",
    "..kkrrrrkk..",
    ".krrrrrrrrk.",
    "kkkkkkkkkkkk",
    "..kdk..kdk..",
    "..kkkkkkkk..",
    ".kddddddddk.",
    "kkkkkkkkkkkk",
    "..kdk..kdk..",
    "..kdk..kdk..",
  ]),
  // Columns under a pediment.
  uio: art([
    ".....kk.....",
    "...kkwwkk...",
    ".kkwwwwwwkk.",
    "kkkkkkkkkkkk",
    ".kwkwkkwkwk.",
    ".kwkwkkwkwk.",
    ".kwkwkkwkwk.",
    ".kwkwkkwkwk.",
    "kkkkkkkkkkkk",
    "kwwwwwwwwwwk",
  ]),
  // An office tower and its low neighbour, windows lit.
  kontor: art([
    "..kkkkkk....",
    "..kysysk....",
    "..kssssk....",
    "..kysysk.kkk",
    "..kssssk.kwk",
    "..kysyskkkyk",
    "..kssssk.kwk",
    "..kysysk.kyk",
    "..kssssk.kwk",
    "kkkkkkkkkkkk",
  ]),
  // The campus, with a flag on top.
  kristiania: art([
    "......kpp...",
    "......kppp..",
    "......k.....",
    "..kkkkkkkk..",
    ".krrrrrrrrk.",
    ".krssrrssrk.",
    ".krssrrssrk.",
    ".krrrrrrrrk.",
    ".krssrkkkrk.",
    "kkkkkkkkkkkk",
  ]),
  // A castle nobody has reached yet.
  neste: art([
    "k..k...k..k.",
    "kkkk...kkkk.",
    "kggk...kggk.",
    "kggkkkkkggk.",
    "kggggggggggk",
    "kgggkkkgggk.",
    "kggk...kggk.",
    "kggk.k.kggk.",
    "kggk...kggk.",
    "kkkkkkkkkkkk",
  ]),
};

/* Heights along the main road, as fractions of the map: it winds. */
const Y = [0.62, 0.3, 0.6, 0.32, 0.62, 0.34];

type Point = { x: number; y: number };

/*
 * Lays the map out. Main road: every level up to and including the current
 * one, then the locked one. Branches: levels after the current one, hung
 * off it above or below, whichever side has room.
 */
function layout(levels: Level[]) {
  const cur = levels.findIndex((l) => l.current);
  const last = cur >= 0 ? cur : levels.length - 1;
  const main = levels.slice(0, last + 1).map((_, i) => i);
  const branch = levels.map((_, i) => i).filter((i) => i > last);
  const stops = main.length + 1; // and the locked one
  const pos: Point[] = [];
  main.forEach((li, k) => {
    pos[li] = { x: 0.08 + (k * 0.84) / (stops - 1), y: Y[k % Y.length] };
  });
  const locked: Point = { x: 0.92, y: Y[main.length % Y.length] };
  const hub = pos[last];
  branch.forEach((li, k) => {
    const below = hub.y < 0.5;
    pos[li] = {
      x: Math.min(0.9, hub.x + 0.12 + k * 0.14),
      y: below ? Math.min(0.86, hub.y + 0.5) : Math.max(0.14, hub.y - 0.42),
    };
  });
  return { pos, locked, main, branch, hub: last };
}

/* The road as a graph: neighbours along the main road, and hub to branch. */
function routeOf(from: number, to: number, main: number[], branch: number[], hub: number) {
  const next = (n: number) => {
    const out: number[] = [];
    const k = main.indexOf(n);
    if (k > 0) out.push(main[k - 1]);
    if (k >= 0 && k < main.length - 1) out.push(main[k + 1]);
    if (n === hub) out.push(...branch);
    if (branch.includes(n)) out.push(hub);
    return out;
  };
  const prev = new Map<number, number>([[from, from]]);
  const queue = [from];
  while (queue.length) {
    const n = queue.shift()!;
    if (n === to) break;
    for (const m of next(n)) {
      if (!prev.has(m)) {
        prev.set(m, n);
        queue.push(m);
      }
    }
  }
  const path: number[] = [];
  for (let n = to; n !== from; n = prev.get(n)!) path.unshift(n);
  return path;
}

const STEP_MS = 360;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function LevelMap({ levels }: { levels: Level[] }) {
  const { pos: points, locked, main, branch, hub } = layout(levels);
  const home = hub;

  const [at, setAt] = React.useState(home);
  const [facing, setFacing] = React.useState<"left" | "right">("right");
  const [walking, setWalking] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const arrive = (index: number) => {
    const target = document.getElementById(levels[index].id);
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    const entry = target.closest("li");
    entry?.classList.remove("is-chosen");
    void entry?.offsetWidth;
    entry?.classList.add("is-chosen");
    window.setTimeout(() => entry?.classList.remove("is-chosen"), 2200);
  };

  // Along the road one island at a time, never cutting across.
  const go = (index: number) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (index === at || reducedMotion()) {
      setAt(index);
      arrive(index);
      return;
    }
    setWalking(true);
    let t = 0;
    let from = at;
    for (const next of routeOf(at, index, main, branch, hub)) {
      const dir = points[next].x >= points[from].x ? "right" : "left";
      timers.current.push(
        window.setTimeout(() => {
          setFacing(dir);
          setAt(next);
        }, t),
      );
      t += STEP_MS;
      from = next;
    }
    timers.current.push(
      window.setTimeout(() => {
        setWalking(false);
        arrive(index);
      }, t),
    );
  };

  const pt = (p: Point) => `${(p.x * 100).toFixed(2)},${(p.y * 100).toFixed(2)}`;
  const open = main.map((i) => pt(points[i])).join(" ");
  const lockedRoad = `${pt(points[hub])} ${pt(locked)}`;
  const branchRoads = branch.map((i) => `${pt(points[hub])} ${pt(points[i])}`);
  const noah = points[at];

  return (
    <nav aria-label="Nivåer" className="world-map-wrap">
      <p className="level-hint">Velg et nivå</p>
      <div className="world-map">
        <svg
          aria-hidden="true"
          className="world-road"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {branchRoads.map((r) => (
            <polyline key={`edge-${r}`} points={r} className="road-edge" />
          ))}
          <polyline points={open} className="road-edge" />
          {branchRoads.map((r) => (
            <polyline key={r} points={r} className="road" />
          ))}
          <polyline points={open} className="road" />
          <polyline points={lockedRoad} className="road-locked" />
        </svg>

        <ol className="world-isles">
          {levels.map((level, i) => (
            <li
              key={level.id}
              className="world-node"
              style={{
                left: `${points[i].x * 100}%`,
                top: `${points[i].y * 100}%`,
              }}
            >
              <a
                href={`#${level.id}`}
                aria-current={level.current ? "step" : undefined}
                className={cn("isle", level.current && "is-current")}
                onClick={(event) => {
                  event.preventDefault();
                  go(i);
                }}
              >
                <Sprite sprite={LANDMARKS[level.place]} scale={4} decorative className="isle-mark" />
                <span aria-hidden="true" className="isle-ground" />
                <span className="isle-badge" aria-hidden="true">
                  N{i + 1}
                </span>
                <span className="isle-name">{level.name}</span>
              </a>
            </li>
          ))}
          <li
            className="world-node"
            style={{
              left: `${locked.x * 100}%`,
              top: `${locked.y * 100}%`,
            }}
          >
            <a
              href="mailto:noahnikolaj.c@gmail.com?subject=Neste%20niv%C3%A5"
              className="isle is-locked"
            >
              <Sprite sprite={LANDMARKS.neste} scale={4} decorative className="isle-mark" />
              <span aria-hidden="true" className="isle-ground" />
              <span className="isle-badge" aria-hidden="true">
                ?
              </span>
              <span className="isle-name">
                Neste nivå<span className="sr-only">: låst, send meg en e-post</span>
              </span>
            </a>
          </li>
        </ol>

        {/* Noah, and the arrow over him. Decorative. */}
        <span
          aria-hidden="true"
          className="world-noah"
          style={{
            left: `${noah.x * 100}%`,
            top: `${noah.y * 100}%`,
            ["--d" as string]: walking ? `${STEP_MS}ms` : "0ms",
          }}
        >
          <span className="world-arrow">▼</span>
          {walking ? (
            <span className="floor-run-window">
              <SpriteStrip
                frames={facing === "right" ? NOAH_RUN_RIGHT : NOAH_RUN_LEFT}
                scale={5}
                className="floor-run"
              />
            </span>
          ) : (
            <Sprite sprite={NOAH} scale={5} decorative className="sprite-idle" />
          )}
        </span>
      </div>
    </nav>
  );
}
