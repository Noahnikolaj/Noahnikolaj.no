"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { RetroAudio } from "./useRetroAudio";

export type JumpscareHandle = {
  /** Warm the decoder inside a tap, so later playback starts instantly. */
  prime: () => void;
  /** `gesture: false` for scares not caused by a direct tap (walking into Foxy). */
  trigger: (opts?: { gesture?: boolean }) => void;
};

type Props = {
  /** Keep the clip mounted and buffered before it is needed. */
  preload: boolean;
  audio: RetroAudio;
  onDone: () => void;
};

const VIDEO_SRC = "/halloween/foxy-jumpscare.mp4";
const FALLBACK_MS = 1900;
const VIDEO_CAP_MS = 7000;
/** If `playing` never fires, show anyway rather than swallowing the scare. */
const REVEAL_SAFETY_MS = 220;

/**
 * The clip opens mid-lunge with no build-up, so nothing is shown until the
 * video is genuinely rolling — otherwise she gets a black screen followed by
 * a frozen first frame, which telegraphs the scare instead of landing it.
 */
const Jumpscare = forwardRef<JumpscareHandle, Props>(function Jumpscare(
  { preload, audio, onDone },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const endTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const armed = useRef(false);
  const done = useRef(false);
  const [showing, setShowing] = useState(false);
  const [fallback, setFallback] = useState(false);

  const clearTimers = () => {
    if (endTimer.current !== null) window.clearTimeout(endTimer.current);
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    endTimer.current = null;
    revealTimer.current = null;
  };

  const reveal = useCallback(() => {
    if (!armed.current) return;
    if (revealTimer.current !== null) {
      window.clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
    setShowing(true);
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    armed.current = false;
    clearTimers();
    setShowing(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    onDone();
  }, [onDone]);

  useImperativeHandle(
    ref,
    () => ({
      prime() {
        const v = videoRef.current;
        if (!v) return;
        try {
          v.muted = true;
          const p = v.play();
          const settle = () => {
            v.pause();
            v.currentTime = 0;
          };
          if (p && typeof p.then === "function") p.then(settle).catch(() => {});
          else settle();
        } catch {
          /* priming is best-effort */
        }
      },
      trigger({ gesture = true } = {}) {
        done.current = false;
        armed.current = true;
        clearTimers();

        const v = videoRef.current;
        let playing = false;
        if (v && !fallback) {
          try {
            v.muted = false;
            v.currentTime = 0;
            const p = v.play();
            playing = true;
            if (p && typeof p.catch === "function") {
              p.catch(() => {
                setFallback(true);
                audio.scare();
                reveal();
              });
            }
          } catch {
            playing = false;
          }
        }

        // Walking into Foxy is not a tap, so iOS may refuse the clip's audio.
        // The synthesized shriek is guaranteed to sound either way.
        if (!gesture) audio.scare();

        if (!playing) {
          setFallback(true);
          if (gesture) audio.scare();
          reveal();
        } else {
          revealTimer.current = window.setTimeout(reveal, REVEAL_SAFETY_MS);
        }

        endTimer.current = window.setTimeout(finish, playing ? VIDEO_CAP_MS : FALLBACK_MS);
      },
    }),
    [audio, fallback, finish, reveal],
  );

  const mountVideo = !fallback && (preload || showing);

  return (
    <div
      className={showing ? "hw-scare hw-scare--showing" : "hw-scare hw-scare--idle"}
      aria-hidden={!showing}
    >
      {mountVideo && (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          playsInline
          preload="auto"
          className="hw-scare-video"
          onPlaying={reveal}
          onError={() => setFallback(true)}
          onEnded={finish}
        />
      )}
      {showing && fallback && (
        <div className="hw-scare-fallback">
          <div className="hw-scare-face">
            <span className="hw-scare-eye hw-scare-eye--l" />
            <span className="hw-scare-eye hw-scare-eye--r" />
            <span className="hw-scare-grin" />
          </div>
        </div>
      )}
      {showing && <div className="hw-scare-static" />}
      {showing && <div className="hw-scare-strobe" />}
    </div>
  );
});

export default Jumpscare;
