import { cn } from "@/lib/utils";

/*
 * Screenshots, framed.
 *
 * A raw screenshot floating on the page reads as evidence rather than as
 * work. The usual fix is a photoreal device mockup, but a glossy rendered
 * iPhone next to hand-drawn sprites would be the one thing on the site that
 * came from a stock library. So the devices are drawn here instead, out of
 * the same parts as everything else: four-pixel borders, hard offset blocks,
 * no radius, no blur.
 *
 * The frame never imposes a ratio. Whatever goes inside keeps its own
 * proportions, which is the rule the project art has always followed.
 */
export type Device = "phone" | "browser" | "handheld" | "none";

const SHELL =
  "border-4 border-foreground shadow-[8px_8px_0_0_rgb(var(--blokk))]";

export function DeviceFrame({
  device,
  children,
  className,
}: {
  device: Device;
  /** The screenshot. Keeps its own aspect ratio. */
  children: React.ReactNode;
  className?: string;
}) {
  if (device === "none") {
    return (
      <div className={cn(SHELL, "bg-secondary overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  if (device === "browser") {
    return (
      <div className={cn(SHELL, "bg-card", className)}>
        {/* Chrome. Square buttons: nothing on this site is round. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 border-b-4 border-foreground bg-secondary px-2 py-2"
        >
          <span className="h-2 w-2 bg-foreground" />
          <span className="h-2 w-2 bg-foreground" />
          <span className="h-2 w-2 bg-foreground" />
          <span className="ml-1.5 h-2 flex-1 bg-foreground/25" />
        </div>
        <div className="overflow-hidden bg-secondary">{children}</div>
      </div>
    );
  }

  if (device === "phone") {
    return (
      <div className={cn(SHELL, "bg-foreground p-2", className)}>
        <div aria-hidden="true" className="flex justify-center pb-2">
          {/* Earpiece slot. */}
          <span className="h-1 w-10 bg-background/50" />
        </div>
        <div className="overflow-hidden bg-secondary">{children}</div>
        <div aria-hidden="true" className="flex justify-center pt-2">
          {/* Home bar. */}
          <span className="h-1 w-12 bg-background/50" />
        </div>
      </div>
    );
  }

  /*
   * The handheld, for the one project that genuinely is a Game Boy game: it
   * runs at 160x144 on a canvas. The rose buttons are not a palette
   * convenience, the DMG's own A and B buttons were magenta.
   */
  return (
    <div className={cn(SHELL, "bg-foreground p-3", className)}>
      <div className="overflow-hidden border-4 border-background/25 bg-secondary">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="mt-3 flex items-center justify-between px-1"
      >
        {/* D-pad: a plus drawn on a three by three grid. */}
        <div className="grid h-6 w-6 grid-cols-3 grid-rows-3">
          <span />
          <span className="bg-background/60" />
          <span />
          <span className="bg-background/60" />
          <span className="bg-background/60" />
          <span className="bg-background/60" />
          <span />
          <span className="bg-background/60" />
          <span />
        </div>
        <div className="flex gap-2">
          <span className="h-3 w-3 bg-primary" />
          <span className="h-3 w-3 bg-primary" />
        </div>
      </div>
    </div>
  );
}
