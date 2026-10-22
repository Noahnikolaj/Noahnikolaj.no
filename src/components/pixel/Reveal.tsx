"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Scroll-in from the right.
 *
 * Two things keep this from being the usual fade-and-slide: the easing is
 * steps(), so an element jumps in over five frames like a sprite rather than
 * gliding, and the hidden state only exists when JS is running AND the reader
 * has not asked for reduced motion (see globals.css). Without JS, or with
 * reduced motion, everything is simply visible.
 *
 * Each element reveals once and then stops being observed.
 */
export function Reveal({
  children,
  as: As = "div",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  as?: "div" | "li" | "section";
  /** Stagger within a group, in milliseconds. Keep groups short. */
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <As
      ref={ref as React.Ref<never>}
      data-reveal=""
      data-shown={shown ? "" : undefined}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(className)}
    >
      {children}
    </As>
  );
}
