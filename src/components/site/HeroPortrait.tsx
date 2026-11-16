"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { BLEED } from "@/components/pixel/DepthPortrait";
import { Quietly } from "@/components/site/Quietly";
import { cn } from "@/lib/utils";

/*
 * The portrait in the hero.
 *
 * The plain image is what the server sends and what a reader without WebGL
 * keeps. Once the depth scene has its textures, the canvas takes over in
 * the same box and the image fades out underneath it, so nothing ever pops.
 */
const DepthPortrait = dynamic(
  () => import("@/components/pixel/DepthPortrait").then((m) => m.DepthPortrait),
  { ssr: false },
);

const WIDTH = 515;
const HEIGHT = 512;


export function HeroPortrait() {
  const [webgl, setWebgl] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const onReady = React.useCallback(() => setReady(true), []);

  React.useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      setWebgl(!!(probe.getContext("webgl2") || probe.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  const bleed = `${((BLEED - 1) / 2) * -100}%`;

  return (
    <div
      className="relative mx-auto w-[86%]"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      <Image
        src="/Profpic.png"
        alt="Noah Nikolaj, portrett"
        width={WIDTH}
        height={HEIGHT}
        priority
        sizes="(max-width: 768px) 62vw, 21rem"
        className={cn(
          "relative block h-auto w-full transition-opacity duration-300",
          ready && "opacity-0",
        )}
      />
      {webgl ? (
        <div
          aria-hidden="true"
          className="absolute"
          style={{ inset: bleed }}
        >
          <Quietly>
            <DepthPortrait
              color="/Profpic.png"
              depth="/Profpic-depth.png"
              onReady={onReady}
            />
          </Quietly>
        </div>
      ) : null}
    </div>
  );
}
