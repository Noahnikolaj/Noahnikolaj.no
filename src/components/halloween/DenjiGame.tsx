"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DPad, { type Dir } from "./DPad";
import {
  canStand,
  COLS,
  DOORS,
  H,
  HIDING_SPOTS,
  MAPS,
  ROOM_NAMES,
  ROWS,
  START_ROOM,
  START_TILE,
  TILE,
  W,
} from "./rooms";
import type { RetroAudio } from "./useRetroAudio";

const SPEED = 46; // px per second
const FADE_TIME = 0.3; // room transition wipe
const HINT_ROOM_AT = 30; // seconds — tell her which room he is in
const HINT_EYES_AT = 45; // seconds — his eyes start glowing
const HINT_ARROW_AT = 70; // seconds — outright arrow
const CATCH = 9; // px

const TILE_COLORS: Record<string, { base: string; shade: string; top: string }> = {
  "#": { base: "#2a1b35", shade: "#160d1d", top: "#3a2748" },
  A: { base: "#35265c", shade: "#1e1538", top: "#4c3a7d" }, // arcade cabinet
  T: { base: "#5e3b24", shade: "#3a2416", top: "#7d5232" }, // table
  B: { base: "#6b4a2a", shade: "#44301b", top: "#8a6338" }, // boxes
  C: { base: "#6b1f2e", shade: "#43121d", top: "#8c2b3e" }, // curtain
  P: { base: "#1f4a2a", shade: "#12301b", top: "#2d6639" }, // plant
  S: { base: "#3a2244", shade: "#24152b", top: "#4f2f5c" }, // sofa
};

const P_PAL: Record<string, string> = {
  h: "#4a2f1c",
  s: "#ffd8b1",
  e: "#140d14",
  b: "#c2344f",
  d: "#8d2039",
};

const mirror = (art: string[]) => art.map((row) => [...row].reverse().join(""));

const BODY_DOWN = [
  "..hhhh..",
  ".hhhhhh.",
  ".hssssh.",
  ".sesesh.",
  "..ssss..",
  ".bbbbbb.",
  ".bbbbbb.",
];

const BODY_UP = [
  "..hhhh..",
  ".hhhhhh.",
  ".hhhhhh.",
  ".hhhhhh.",
  "..hhhh..",
  ".bbbbbb.",
  ".bbbbbb.",
];

const BODY_LEFT = [
  "..hhhh..",
  ".hhhhhh.",
  ".hhssss.",
  ".hesss..",
  "..ssss..",
  ".bbbbb..",
  ".bbbbb..",
];

const BODIES: Record<Dir, string[]> = {
  down: BODY_DOWN,
  up: BODY_UP,
  left: BODY_LEFT,
  right: mirror(BODY_LEFT),
};

const LEGS_V = ["..d..d..", ".d....d."];
const LEGS_H = ["..dd....", "...dd..."];

const C_PAL: Record<string, string> = {
  o: "#ff8c1a",
  d: "#c25f06",
  e: "#120c10",
  w: "#ffd1a1",
};

const CAT = [
  "o.....o.",
  "oo...oo.",
  ".ooooo..",
  ".oeoeo.d",
  ".oowoo.d",
  ".ooooo.d",
  ".o...o..",
  "........",
];

const CAT_BLINK = CAT.map((row, i) => (i === 3 ? ".ooooo.d" : row));

const F_PAL: Record<string, string> = {
  r: "#9e1f1f",
  d: "#5c0d0d",
  e: "#ffd400",
  w: "#efe6d4",
  k: "#8b929c",
};

/** Foxy, lurking. Mostly read as two yellow eyes until the torch hits him. */
const FOXY = [
  "..rrrr..",
  ".rrrrrr.",
  ".reerre.",
  ".rrrrrr.",
  ".wwwwww.",
  ".rwwwwr.",
  ".drrrrd.",
  ".k....k.",
];

function drawSprite(
  ctx: CanvasRenderingContext2D,
  art: string[],
  palette: Record<string, string>,
  x: number,
  y: number,
) {
  for (let r = 0; r < art.length; r++) {
    const row = art[r];
    for (let c = 0; c < row.length; c++) {
      const color = palette[row[c]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x) + c, Math.round(y) + r, 1, 1);
    }
  }
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Props = {
  audio: RetroAudio;
  paused: boolean;
  /** Increments after each jumpscare, which sends Foxy somewhere new. */
  scareCount: number;
  onFound: () => void;
  onFoxy: () => void;
};

export default function DenjiGame({ audio, paused, scareCount, onFound, onFoxy }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Record<Dir, boolean>>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const foundRef = useRef(false);
  const pausedRef = useRef(paused);
  const scareRef = useRef(scareCount);
  const [roomName, setRoomName] = useState(ROOM_NAMES[START_ROOM]);
  const [hint, setHint] = useState<0 | 1 | 2 | 3>(0);
  const [denjiRoomName, setDenjiRoomName] = useState("");

  pausedRef.current = paused;
  scareRef.current = scareCount;

  const setDir = useCallback((dir: Dir, pressed: boolean) => {
    keys.current[dir] = pressed;
  }, []);

  // Let go of everything while a jumpscare is on screen.
  useEffect(() => {
    if (paused) keys.current = { up: false, down: false, left: false, right: false };
  }, [paused]);

  useEffect(() => {
    const map: Record<string, Dir> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
      W: "up", S: "down", A: "left", D: "right",
    };
    const down = (e: KeyboardEvent) => {
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      keys.current[dir] = true;
    };
    const up = (e: KeyboardEvent) => {
      const dir = map[e.key];
      if (!dir) return;
      keys.current[dir] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    // Denji and Foxy are always in different rooms, and never in the hub —
    // so she has to leave the starting room to finish.
    const searchable = [1, 2, 3];
    const denjiRoom = pick(searchable);
    const denjiTile = pick(HIDING_SPOTS[denjiRoom]);
    const denji = { room: denjiRoom, x: denjiTile[0] * TILE, y: denjiTile[1] * TILE };

    const placeFoxy = (avoidRoom: number) => {
      const options = searchable.filter((r) => r !== denjiRoom && r !== avoidRoom);
      const room = pick(options.length ? options : searchable.filter((r) => r !== denjiRoom));
      const tile = pick(HIDING_SPOTS[room]);
      return { room, x: tile[0] * TILE, y: tile[1] * TILE };
    };
    let foxy = placeFoxy(START_ROOM);

    let room = START_ROOM;
    const player = { x: START_TILE[0] * TILE, y: START_TILE[1] * TILE };
    let facing: Dir = "down";
    let elapsed = 0;
    let walkTimer = 0;
    let frame = 0;
    let stepTimer = 0;
    let fade = 0;
    let hintLevel: 0 | 1 | 2 | 3 = 0;
    let lastScare = scareRef.current;
    let raf = 0;
    let last = performance.now();

    const drawRoom = () => {
      const map = MAPS[room];
      for (let ty = 0; ty < ROWS; ty++) {
        for (let tx = 0; tx < COLS; tx++) {
          const ch = map[ty][tx];
          const x = tx * TILE;
          const y = ty * TILE;
          if (ch === ".") {
            ctx.fillStyle = (tx + ty) % 2 === 0 ? "#171122" : "#1c1529";
            ctx.fillRect(x, y, TILE, TILE);
            continue;
          }
          if (ch === "d") {
            // Doorway: a darker gap with a lit frame so it reads as an exit.
            ctx.fillStyle = "#0a0710";
            ctx.fillRect(x, y, TILE, TILE);
            ctx.fillStyle = "#4a3a1f";
            if (tx === 0 || tx === COLS - 1) ctx.fillRect(tx === 0 ? x : x + TILE - 1, y, 1, TILE);
            else ctx.fillRect(x, ty === 0 ? y : y + TILE - 1, TILE, 1);
            continue;
          }
          const c = TILE_COLORS[ch] ?? TILE_COLORS["#"];
          ctx.fillStyle = c.base;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = c.top;
          ctx.fillRect(x, y, TILE, 1);
          ctx.fillStyle = c.shade;
          ctx.fillRect(x, y + TILE - 1, TILE, 1);
          if (ch === "#") {
            ctx.fillStyle = c.shade;
            ctx.fillRect(x, y + 3, TILE, 1);
            ctx.fillRect(x + (ty % 2 === 0 ? 2 : 5), y, 1, 3);
          }
          if (ch === "A") {
            ctx.fillStyle = "#7de3ff";
            ctx.fillRect(x + 2, y + 2, 4, 3);
          }
          if (ch === "C") {
            ctx.fillStyle = c.shade;
            ctx.fillRect(x + 2, y, 1, TILE);
            ctx.fillRect(x + 5, y, 1, TILE);
          }
        }
      }
    };

    const drawDarkness = () => {
      const cx = player.x + 4;
      const cy = player.y + 4;
      const g = ctx.createRadialGradient(cx, cy, 6, cx, cy, 52);
      g.addColorStop(0, "rgba(9,6,13,0)");
      g.addColorStop(0.55, "rgba(9,6,13,0.4)");
      g.addColorStop(1, "rgba(9,6,13,0.97)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const glowEyes = (x: number, y: number, color: string, alpha: number) => {
      ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
      ctx.fillRect(x + 1, y + 2, 2, 2);
      ctx.fillRect(x + 4, y + 2, 2, 2);
    };

    const drawHints = () => {
      // Foxy's eyes always glow through the dark — she cannot tell from across
      // the room whether those eyes are the cat or not. That is the point.
      if (foxy.room === room) {
        glowEyes(foxy.x, foxy.y, "255,212,0", 0.4 + 0.35 * Math.sin(elapsed * 3));
      }
      if (denji.room !== room) return;
      if (hintLevel >= 2) {
        glowEyes(denji.x, denji.y, "255,140,26", 0.45 + 0.4 * Math.sin(elapsed * 4));
      }
      if (hintLevel < 3) return;
      const dx = denji.x - player.x;
      const dy = denji.y - player.y;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const ax = player.x + 4 + (horizontal ? (dx > 0 ? 10 : -10) : 0);
      const ay = player.y + 4 + (horizontal ? 0 : dy > 0 ? 10 : -10);
      ctx.fillStyle = `rgba(57,255,20,${(0.5 + 0.5 * Math.sin(elapsed * 6)).toFixed(3)})`;
      for (let i = 0; i < 3; i++) {
        const w = 3 - i;
        if (horizontal) ctx.fillRect(ax + (dx > 0 ? i : -i), ay - Math.floor(w / 2), 1, w);
        else ctx.fillRect(ax - Math.floor(w / 2), ay + (dy > 0 ? i : -i), w, 1);
      }
    };

    const drawScanlines = () => {
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);
    };

    const render = () => {
      drawRoom();
      if (denji.room === room) {
        const blink = Math.sin(elapsed * 1.7) > 0.93;
        drawSprite(ctx, blink ? CAT_BLINK : CAT, C_PAL, denji.x, denji.y);
      }
      if (foxy.room === room) drawSprite(ctx, FOXY, F_PAL, foxy.x, foxy.y);
      const legs = facing === "left" || facing === "right" ? LEGS_H : LEGS_V;
      drawSprite(ctx, [...BODIES[facing], legs[frame]], P_PAL, player.x, player.y);
      drawDarkness();
      drawHints();
      drawScanlines();
      if (fade > 0) {
        ctx.fillStyle = `rgba(0,0,0,${(fade / FADE_TIME).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // A jumpscare just finished: move Foxy somewhere else so she does not
      // walk straight back into him.
      if (scareRef.current !== lastScare) {
        lastScare = scareRef.current;
        foxy = placeFoxy(room);
      }

      if (pausedRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      elapsed += dt;
      if (fade > 0) fade = Math.max(0, fade - dt);

      if (elapsed > HINT_ARROW_AT && hintLevel !== 3) {
        hintLevel = 3;
        setHint(3);
      } else if (elapsed > HINT_EYES_AT && hintLevel < 2) {
        hintLevel = 2;
        setHint(2);
      } else if (elapsed > HINT_ROOM_AT && hintLevel < 1) {
        hintLevel = 1;
        setHint(1);
        setDenjiRoomName(ROOM_NAMES[denji.room]);
      }

      let vx = 0;
      let vy = 0;
      if (keys.current.left) vx -= 1;
      if (keys.current.right) vx += 1;
      if (keys.current.up) vy -= 1;
      if (keys.current.down) vy += 1;

      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy) || 1;
        const step = SPEED * dt;
        const nx = player.x + (vx / len) * step;
        const ny = player.y + (vy / len) * step;
        if (canStand(room, nx, player.y)) player.x = nx;
        if (canStand(room, player.x, ny)) player.y = ny;

        facing =
          vx !== 0 && Math.abs(vx) >= Math.abs(vy)
            ? vx > 0 ? "right" : "left"
            : vy > 0 ? "down" : "up";

        walkTimer += dt;
        if (walkTimer > 0.16) {
          walkTimer = 0;
          frame = frame === 0 ? 1 : 0;
        }
        stepTimer += dt;
        if (stepTimer > 0.26) {
          stepTimer = 0;
          audio.step();
        }
      } else {
        frame = 0;
      }

      // Doorways.
      if (fade === 0) {
        const ftx = Math.floor((player.x + 3.5) / TILE);
        const fty = Math.floor((player.y + 5) / TILE);
        const door = DOORS[room].find((d) =>
          d.tiles.some(([tx, ty]) => tx === ftx && ty === fty),
        );
        if (door) {
          room = door.to;
          player.x = door.entry[0] * TILE;
          player.y = door.entry[1] * TILE;
          fade = FADE_TIME;
          setRoomName(ROOM_NAMES[room]);
          audio.blip();
        }
      }

      render();

      if (foxy.room === room && Math.hypot(player.x - foxy.x, player.y - foxy.y) < CATCH) {
        onFoxy();
        raf = requestAnimationFrame(tick);
        return;
      }
      if (
        denji.room === room &&
        Math.hypot(player.x - denji.x, player.y - denji.y) < CATCH &&
        !foundRef.current
      ) {
        foundRef.current = true;
        audio.found();
        onFound();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    render();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audio, onFound, onFoxy]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="hw-pixel text-[10px] tracking-widest text-[#ff7518]">FIND DENJI</p>
      <p className="hw-pixel text-[8px] tracking-widest text-[#39ff14]">{roomName}</p>
      <div className="hw-screen">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="hw-canvas"
          aria-label="Pixelrom der du leter etter katten Denji"
        />
      </div>
      <p className="hw-mono min-h-[3rem] text-center text-lg leading-tight text-[#9b8aa8]">
        {hint === 0 && "Denji gjemmer seg i et av rommene. Gå gjennom dørene for å lete."}
        {hint === 1 && `Du hører mjauing fra ${denjiRoomName}…`}
        {hint === 2 && `Mjauingen kommer fra ${denjiRoomName}. Se etter oransje øyne.`}
        {hint === 3 && "Følg pilen!"}
      </p>
      <DPad onDir={setDir} />
    </div>
  );
}
