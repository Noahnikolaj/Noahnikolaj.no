"use client";

import { useCallback, useMemo, useRef, useState } from "react";

/**
 * The sound bundle. This object identity must stay stable across renders —
 * the game loop takes it as an effect dependency, so a fresh object every
 * render would silently restart the game mid-play.
 */
export type RetroAudio = {
  unlock: () => void;
  blip: () => void;
  step: () => void;
  found: () => void;
  gift: () => void;
  scare: () => void;
  success: () => void;
};

export type RetroAudioHook = {
  sfx: RetroAudio;
  muted: boolean;
  toggleMute: () => void;
};

type ToneOpts = {
  freq: number;
  to?: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

/**
 * All sound on the halloween page is synthesized with the Web Audio API so
 * there are no audio files to ship. iOS only lets the context start inside a
 * user gesture, so `unlock()` is called from the START tap.
 */
export function useRetroAudio(): RetroAudioHook {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      try {
        ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, []);

  const unlock = useCallback(() => {
    const ctx = getCtx();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }, [getCtx]);

  const tone = useCallback(
    ({ freq, to, dur = 0.08, type = "square", gain = 0.06, delay = 0 }: ToneOpts) => {
      if (mutedRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (to && to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(amp).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },
    [getCtx],
  );

  const noise = useCallback(
    (dur = 0.5, gain = 0.18) => {
      if (mutedRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const frames = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      }
      const src = ctx.createBufferSource();
      const amp = ctx.createGain();
      src.buffer = buffer;
      amp.gain.setValueAtTime(gain, ctx.currentTime);
      src.connect(amp).connect(ctx.destination);
      src.start();
    },
    [getCtx],
  );

  const blip = useCallback(() => tone({ freq: 440, dur: 0.06, gain: 0.05 }), [tone]);

  const step = useCallback(
    () => tone({ freq: 95 + Math.random() * 25, dur: 0.045, type: "triangle", gain: 0.035 }),
    [tone],
  );

  const found = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ freq: f, dur: 0.13, gain: 0.07, delay: i * 0.1 }),
    );
  }, [tone]);

  const gift = useCallback(() => {
    tone({ freq: 220, to: 880, dur: 0.45, type: "sawtooth", gain: 0.05 });
    [659.25, 880, 1174.66].forEach((f, i) =>
      tone({ freq: f, dur: 0.16, gain: 0.06, delay: 0.4 + i * 0.12 }),
    );
  }, [tone]);

  const scare = useCallback(() => {
    noise(1.1, 0.22);
    tone({ freq: 760, to: 55, dur: 0.9, type: "sawtooth", gain: 0.12 });
    tone({ freq: 90, dur: 1.1, type: "square", gain: 0.07 });
  }, [noise, tone]);

  const success = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      tone({ freq: f, dur: 0.18, gain: 0.07, delay: i * 0.11 }),
    );
  }, [tone]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      mutedRef.current = !m;
      return !m;
    });
  }, []);

  // Deliberately excludes `muted` so toggling sound never restarts the game.
  const sfx = useMemo<RetroAudio>(
    () => ({ unlock, blip, step, found, gift, scare, success }),
    [unlock, blip, step, found, gift, scare, success],
  );

  return { sfx, muted, toggleMute };
}
