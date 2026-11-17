"use client";

import * as React from "react";

/*
 * The pointer: a reticle.
 *
 * The dot is exactly where the mouse is, every event, so aiming never feels
 * soft. Around it four corner brackets ride a spring. In open space they
 * trail the dot loosely. When the pointer comes onto something you can
 * press, they fly out and lock around it, and the thing itself leans a few
 * pixels toward the pointer: the magnet. Pressing squeezes them in.
 *
 * Mouse and trackpad only. On touch there is no pointer to draw.
 */
const MAGNETIC = "a[href], button:not(:disabled), [role='button'], summary";
const REST = 22; // reticle size in open space
const PAD = 6; // breathing room when locked on
const MAX_W = 460; // bigger than this is a region, not a button
const MAX_H = 320; // a home-page cartridge with its title is about 240
const PULL = 0.16; // how far a locked target leans toward the pointer
const PULL_X = 7;
const PULL_Y = 4;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function PixelCursor() {
  const [on, setOn] = React.useState(false);
  const ring = React.useRef<HTMLDivElement>(null);
  const dot = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setOn(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    if (!on) return;
    const html = document.documentElement;
    html.classList.add("pixel-cursor");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let px = -100;
    let py = -100;
    let seen = false;
    let down = false;
    let target: HTMLElement | null = null;
    const box = { x: 0, y: 0, w: REST, h: REST };
    const vel = { x: 0, y: 0, w: 0, h: 0 };
    // Every element currently leaning, and by how much.
    const leaning = new Map<HTMLElement, { x: number; y: number }>();

    const pick = (el: Element | null): HTMLElement | null => {
      const hit = el?.closest?.(MAGNETIC) as HTMLElement | null;
      if (!hit) return null;
      const r = hit.getBoundingClientRect();
      return r.width > MAX_W || r.height > MAX_H ? null : hit;
    };

    const show = (visible: boolean) => {
      ring.current?.classList.toggle("is-hidden", !visible);
      dot.current?.classList.toggle("is-hidden", !visible);
    };

    const move = (event: MouseEvent) => {
      px = event.clientX;
      py = event.clientY;
      if (!seen) {
        seen = true;
        box.x = px - REST / 2;
        box.y = py - REST / 2;
        show(true);
      }
      if (dot.current) dot.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      target = pick(event.target as Element);
      wake();
    };
    // Scrolling moves things under a still pointer.
    const scroll = () => {
      if (seen) target = pick(document.elementFromPoint(px, py));
      wake();
    };
    const press = () => {
      down = true;
      wake();
    };
    const release = () => {
      down = false;
      wake();
    };
    const leave = () => show(false);
    const enter = () => {
      if (seen) show(true);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("mousedown", press, { passive: true });
    window.addEventListener("mouseup", release, { passive: true });
    html.addEventListener("mouseleave", leave);
    html.addEventListener("mouseenter", enter);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let tx: number;
      let ty: number;
      let tw: number;
      let th: number;
      let lean = { x: 0, y: 0 };

      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        // Measure where it would be without our own lean on it.
        const mine = leaning.get(target) ?? { x: 0, y: 0 };
        const left = r.left - mine.x;
        const top = r.top - mine.y;
        tx = left - PAD;
        ty = top - PAD;
        tw = r.width + PAD * 2;
        th = r.height + PAD * 2;
        lean = {
          x: clamp((px - (left + r.width / 2)) * PULL, -PULL_X, PULL_X),
          y: clamp((py - (top + r.height / 2)) * PULL, -PULL_Y, PULL_Y),
        };
        tx += lean.x;
        ty += lean.y;
      } else {
        tx = px - REST / 2;
        ty = py - REST / 2;
        tw = REST;
        th = REST;
      }
      if (down) {
        tx += 3;
        ty += 3;
        tw -= 6;
        th -= 6;
      }

      if (still) {
        Object.assign(box, { x: tx, y: ty, w: tw, h: th });
      } else {
        // Underdamped: it overshoots a hair and settles.
        const k = 380;
        const c = 26;
        const goal = { x: tx, y: ty, w: tw, h: th };
        for (const key of ["x", "y", "w", "h"] as const) {
          vel[key] += ((goal[key] - box[key]) * k - vel[key] * c) * dt;
          box[key] += vel[key] * dt;
        }
      }

      const el = ring.current;
      if (el) {
        el.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
        el.style.width = `${Math.max(8, box.w)}px`;
        el.style.height = `${Math.max(8, box.h)}px`;
        el.classList.toggle("is-locked", !!target);
      }

      // The lean: the locked target eases toward its pull, everything else
      // eases back to rest and is let go once it gets there.
      if (target && !still && !leaning.has(target)) leaning.set(target, { x: 0, y: 0 });
      const ease = Math.min(1, dt * 14);
      leaning.forEach((v, node) => {
        const goal = node === target ? lean : { x: 0, y: 0 };
        v.x += (goal.x - v.x) * ease;
        v.y += (goal.y - v.y) * ease;
        if (node !== target && Math.abs(v.x) < 0.1 && Math.abs(v.y) < 0.1) {
          node.style.translate = "";
          leaning.delete(node);
        } else {
          node.style.translate = `${v.x.toFixed(2)}px ${v.y.toFixed(2)}px`;
        }
      });

      /*
       * Asleep when there is nothing to do: no target, nothing leaning, the
       * spring at rest. The next move, scroll or click wakes it. Locked on
       * a target it keeps running, since the target itself may move.
       */
      const resting =
        !target &&
        leaning.size === 0 &&
        Math.abs(vel.x) + Math.abs(vel.y) + Math.abs(vel.w) + Math.abs(vel.h) < 0.5 &&
        Math.abs(tx - box.x) + Math.abs(ty - box.y) + Math.abs(tw - box.w) + Math.abs(th - box.h) < 0.3;
      raf = resting ? 0 : requestAnimationFrame(frame);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      leaning.forEach((_, node) => {
        node.style.translate = "";
      });
      html.classList.remove("pixel-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      html.removeEventListener("mouseleave", leave);
      html.removeEventListener("mouseenter", enter);
    };
  }, [on]);

  if (!on) return <TapReticle />;

  return (
    <>
      <div ref={ring} aria-hidden="true" className="ps-cursor-ring is-hidden">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div ref={dot} aria-hidden="true" className="ps-cursor-dot is-hidden">
        <i />
      </div>
    </>
  );
}

/*
 * On touch there is no pointer to follow, so the reticle answers the tap
 * instead: the brackets snap shut around whatever you touched and fade.
 * The same mark as on desktop, one beat long.
 */
function TapReticle() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      const hit = (event.target as Element | null)?.closest?.(MAGNETIC) as HTMLElement | null;
      const el = ref.current;
      if (!hit || !el) return;
      const r = hit.getBoundingClientRect();
      if (r.width > MAX_W * 1.5 || r.height > MAX_H * 1.5) return;
      el.style.transform = `translate3d(${r.left - PAD}px, ${r.top - PAD}px, 0)`;
      el.style.width = `${r.width + PAD * 2}px`;
      el.style.height = `${r.height + PAD * 2}px`;
      el.classList.remove("is-tap");
      void el.offsetWidth; // restart the animation
      el.classList.add("is-tap");
    };
    document.addEventListener("pointerdown", down, { passive: true });
    return () => document.removeEventListener("pointerdown", down);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="ps-tap-ring">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
