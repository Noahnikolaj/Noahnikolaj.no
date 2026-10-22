import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bosett prototype",
  description:
    "Den interaktive Figma-prototypen av Bosett, en tidslinjebasert integreringsapp.",
};

export default function BosettPage() {
  return (
    <main id="hovedinnhold">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <Link
          href="/prosjekter/bosett"
          className="inline-flex min-h-[44px] items-center font-medium underline decoration-2 underline-offset-4"
        >
          Tilbake til Bosett
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05]">
          Bosett, prototypen
        </h1>
        <p className="mt-4 text-lg leading-relaxed">
          Klikk deg gjennom tidslinjen for å se flyten. Prototypen kjører
          innebygd fra Figma og krever JavaScript.
        </p>

        <div className="mt-10 border-4 border-foreground bg-card p-2 sm:p-3">
          <iframe
            title="Figma-prototype av Bosett"
            src="https://embed.figma.com/proto/xvV9sajUKm56pGfZxn41R2/THE-REAL-WIREFRAME?page-id=0%3A1&node-id=87-4974&starting-point-node-id=87%3A4974&embed-host=share"
            allowFullScreen
            className="aspect-[16/9] w-full border-0"
          />
        </div>
      </div>
    </main>
  );
}
