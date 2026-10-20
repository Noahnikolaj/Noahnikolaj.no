"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Confetti from "@/components/halloween/Confetti";
import DenjiGame from "@/components/halloween/DenjiGame";
import GiftBox from "@/components/halloween/GiftBox";
import { ACTIVITIES, DATE, GUEST, PLACE, TIME } from "@/components/halloween/invite";
import Invitation from "@/components/halloween/Invitation";
import Jumpscare, { type JumpscareHandle } from "@/components/halloween/Jumpscare";
import { useRetroAudio } from "@/components/halloween/useRetroAudio";

type Stage = "title" | "game" | "found" | "gift" | "opening" | "invitation";

export default function HalloweenPage() {
  const { sfx: audio, muted, toggleMute } = useRetroAudio();
  const [stage, setStage] = useState<Stage>("title");
  const [scaring, setScaring] = useState(false);
  const [scareCount, setScareCount] = useState(0);
  const [teased, setTeased] = useState(false);
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [burst, setBurst] = useState(0);
  const scareRef = useRef<JumpscareHandle>(null);
  const scaringRef = useRef(false);
  const scareSource = useRef<"gift" | "game">("gift");

  const start = useCallback(() => {
    audio.unlock();
    audio.blip();
    // Warming the clip inside this tap is what makes the scare land instantly.
    scareRef.current?.prime();
    setStage("game");
  }, [audio]);

  const onFound = useCallback(() => setStage("found"), []);

  /** Walking into Foxy mid-game. */
  const onFoxy = useCallback(() => {
    if (scaringRef.current) return; // the loop can report the hit twice
    scaringRef.current = true;
    scareSource.current = "game";
    scareRef.current?.trigger({ gesture: false });
    setScaring(true);
  }, []);

  const sayNo = useCallback(() => {
    if (scaringRef.current) return;
    scaringRef.current = true;
    scareSource.current = "gift";
    scareRef.current?.trigger({ gesture: true });
    setScaring(true);
  }, []);

  const scareDone = useCallback(() => {
    scaringRef.current = false;
    setScaring(false);
    setScareCount((c) => c + 1);
    if (scareSource.current === "gift") setTeased(true);
  }, []);

  useEffect(() => {
    if (stage !== "found") return;
    const t = window.setTimeout(() => setStage("gift"), 2200);
    return () => window.clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "opening") return;
    const t = window.setTimeout(() => {
      setStage("invitation");
      setBurst((b) => b + 1);
    }, 1600);
    return () => window.clearTimeout(t);
  }, [stage]);

  const sayYes = useCallback(() => {
    audio.gift();
    setStage("opening");
  }, [audio]);

  const accept = useCallback(() => {
    audio.success();
    setAccepted(true);
    setBurst((b) => b + 1);
  }, [audio]);

  /** Once she has been scared, NEI refuses to be tapped. */
  const dodgeNo = useCallback(() => {
    setDodge({ x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 80 });
  }, []);

  return (
    <div className="hw-root">
      <div className="hw-backdrop" aria-hidden="true" />

      <button
        type="button"
        className="hw-mute"
        onClick={toggleMute}
        aria-label={muted ? "Skru på lyd" : "Skru av lyd"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      <main className="hw-main">
        {stage === "title" && (
          <section className="hw-stage">
            <p className="hw-pixel hw-flicker text-center text-base leading-relaxed tracking-widest text-[#ff7518]">
              FIND DENJI
            </p>
            <p className="hw-mono text-center text-xl leading-snug text-[#cbbcd6]">
              Denji har rømt ut i mørket.
              <br />
              Let gjennom rommene og finn han.
            </p>
            <button type="button" className="hw-btn w-full" onClick={start}>
              PRESS START
            </button>
            <p className="hw-mono text-center text-base text-[#6c5d79]">
              Best med lyd på 🔊
            </p>
          </section>
        )}

        {stage === "game" && (
          <DenjiGame
            audio={audio}
            paused={scaring}
            scareCount={scareCount}
            onFound={onFound}
            onFoxy={onFoxy}
          />
        )}

        {stage === "found" && (
          <section className="hw-stage">
            <p className="hw-pixel hw-flicker text-center text-sm leading-relaxed tracking-widest text-[#39ff14]">
              DU FANT DENJI!
            </p>
            <div className="hw-cat-big" aria-hidden="true">
              🐈
            </div>
            <p className="hw-mono text-center text-xl text-[#cbbcd6]">
              …og han hadde med seg noe.
            </p>
          </section>
        )}

        {(stage === "gift" || stage === "opening") && (
          <section className="hw-stage">
            <GiftBox opening={stage === "opening"} />
            {stage !== "opening" && (
              <>
                <p className="hw-mono text-center text-2xl text-[#ff7518]">
                  Vil du åpne gaven?
                </p>
                {teased && (
                  <p className="hw-mono text-center text-lg text-[#8b0000]">
                    Feil svar. Prøv igjen.
                  </p>
                )}
                <div className="flex w-full gap-3">
                  <button type="button" className="hw-btn hw-btn--yes flex-1" onClick={sayYes}>
                    JA
                  </button>
                  <button
                    type="button"
                    className="hw-btn hw-btn--no flex-1"
                    style={teased ? { transform: `translate(${dodge.x}px, ${dodge.y}px)` } : undefined}
                    onPointerDown={teased ? dodgeNo : undefined}
                    onClick={teased ? undefined : sayNo}
                  >
                    NEI
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {stage === "invitation" && (
          <Invitation
            guest={GUEST}
            date={DATE}
            time={TIME}
            place={PLACE}
            activities={ACTIVITIES}
            accepted={accepted}
            onAccept={accept}
          />
        )}
      </main>

      <Jumpscare
        ref={scareRef}
        preload={stage === "game" || stage === "found" || stage === "gift" || stage === "opening"}
        audio={audio}
        onDone={scareDone}
      />
      <Confetti burst={burst} />
    </div>
  );
}
