"use client";

/*
 * PUBLIC demo of the Denji mini-game.
 *
 * ⚠️  PRIVACY, read before editing.
 * This route is linked from the public portfolio. It must mount the GAME ONLY.
 * Do NOT import:
 *   - @/components/halloween/invite        (GUEST name, PLACE address, DATE)
 *   - @/components/halloween/Invitation    (renders all of the above)
 *   - @/components/halloween/GiftBox       (part of the invitation flow)
 * The private invitation lives at /halloween and stays noindex.
 *
 * Jumpscare IS included here, as on /halloween. It only imports a type, no
 * event data. There is a notice above the start button because the scare is
 * loud, sudden and full screen, and a reader deserves to opt in.
 */

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";

import DenjiGame from "@/components/halloween/DenjiGame";
import Jumpscare, {
  type JumpscareHandle,
} from "@/components/halloween/Jumpscare";
import { useRetroAudio } from "@/components/halloween/useRetroAudio";
import "@/app/halloween/halloween.css";

export default function DenjiDemoPage() {
  const { sfx: audio, muted, toggleMute } = useRetroAudio();
  const [started, setStarted] = useState(false);
  const [found, setFound] = useState(false);
  const [caught, setCaught] = useState(0);
  const [scaring, setScaring] = useState(false);

  const scareRef = useRef<JumpscareHandle>(null);
  // The loop can report the same collision twice before state settles.
  const scaringRef = useRef(false);

  const start = useCallback(() => {
    audio.unlock();
    audio.blip();
    // Warming the clip inside this tap is what makes the scare land instantly
    // instead of showing a frozen first frame on iOS.
    scareRef.current?.prime();
    setStarted(true);
  }, [audio]);

  const onFound = useCallback(() => setFound(true), []);

  /** Walking into Foxy mid-game. */
  const onFoxy = useCallback(() => {
    if (scaringRef.current) return;
    scaringRef.current = true;
    setScaring(true);
    scareRef.current?.trigger({ gesture: false });
  }, []);

  const scareDone = useCallback(() => {
    scaringRef.current = false;
    setScaring(false);
    // Bumping the count sends Foxy somewhere new.
    setCaught((count) => count + 1);
  }, []);

  const restart = useCallback(() => {
    setFound(false);
    setCaught(0);
  }, []);

  return (
    <main id="hovedinnhold">
      {/* pb-32 so the touch D-pad can scroll clear of the fixed nav. */}
      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-12 md:px-6 md:pt-16">
        <Link
          href="/prosjekter"
          className="inline-flex min-h-[44px] items-center font-medium underline decoration-2 underline-offset-4"
        >
          Alle prosjekter
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]">
          Denji
        </h1>
        <p className="mt-4 text-lg leading-relaxed">
          Finn katten Denji. Fire rom, 160×144 piksler, og en rev som dukker opp
          der du minst venter det. Bruk piltastene eller D-paden.
        </p>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="font-bold" role="status" aria-live="polite">
            {found
              ? "Du fant Denji! 🐈"
              : caught > 0
                ? `Foxy tok deg (${caught}×), han har flyttet seg.`
                : started
                  ? "Leter…"
                  : "Trykk start for å spille."}
          </p>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Skru på lyd" : "Skru av lyd"}
            className="inline-flex h-11 w-11 items-center justify-center border-4 border-foreground bg-card"
          >
            {muted ? (
              <VolumeX aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Volume2 aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* .hw-root supplies the game's own dark palette and layout */}
        <div className="hw-root mt-4 !min-h-0 border-4 border-foreground">
          {!started ? (
            <section className="hw-stage">
              <p className="hw-pixel text-center text-sm leading-relaxed tracking-widest text-[#ff7518]">
                FINN DENJI
              </p>
              <p className="hw-mono max-w-[30ch] text-center text-lg text-[#cbbcd6]">
                Advarsel: spillet har et plutselig skrekkhopp med lyd og
                blinking.
              </p>
              <button
                type="button"
                className="hw-btn hw-btn--yes"
                onClick={start}
              >
                START
              </button>
            </section>
          ) : found ? (
            <section className="hw-stage">
              <p className="hw-pixel text-center text-sm leading-relaxed tracking-widest text-[#39ff14]">
                DU FANT DENJI!
              </p>
              <div className="hw-cat-big" aria-hidden="true">
                🐈
              </div>
              <button
                type="button"
                className="hw-btn hw-btn--yes"
                onClick={restart}
              >
                SPILL IGJEN
              </button>
            </section>
          ) : (
            <DenjiGame
              audio={audio}
              paused={scaring}
              scareCount={caught}
              onFound={onFound}
              onFoxy={onFoxy}
            />
          )}
        </div>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          Alt kjører på et canvas i Game Boy-oppløsning. Rommene er ASCII-kart,
          figurene er pikselkunst i kode, og all lyd er syntetisert i Web Audio
          API, ingen lydfiler.
        </p>
      </div>

      <Jumpscare
        ref={scareRef}
        preload={started && !found}
        audio={audio}
        onDone={scareDone}
      />
    </main>
  );
}
