"use client";

import { PixelButton } from "@/components/site/PixelButton";

/*
 * The plain version, for a recruiter. Printing the page drops the world,
 * the floor and the map (see the print rules in globals.css), so "save as
 * PDF" in the print dialog gives a clean one-column CV.
 */
export function PrintCv() {
  return (
    <PixelButton variant="papir" size="sm" onClick={() => window.print()}>
      Last ned som PDF
    </PixelButton>
  );
}
