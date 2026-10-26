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
 *
 * One rule for choosing a variant: the art must not already contain a
 * device. A screenshot exported from a mockup tool arrives with its own
 * photoreal phone around it, and framing that gives a frame around a frame.
 * Crop to the screen first, or pass "none".
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
      <div className={cn(SHELL, "relative bg-foreground p-2", className)}>
        {/*
         * Side buttons, sized as a share of the body so they hold up at both
         * tile and preview scale. These are what make a dark rectangle read
         * as a phone at a glance, which is the job the title bar and its
         * three squares already do for the browser.
         */}
        <span
          aria-hidden="true"
          className="absolute -left-2 top-[18%] h-[6%] w-2 bg-foreground"
        />
        <span
          aria-hidden="true"
          className="absolute -left-2 top-[27%] h-[6%] w-2 bg-foreground"
        />
        <span
          aria-hidden="true"
          className="absolute -right-2 top-[22%] h-[10%] w-2 bg-foreground"
        />

        {/*
         * What goes in here has to be a plain rectangle of screen. Anything
         * still carrying a render's rounded corners reads as clipped once it
         * sits inside a square frame. See the note on the Guest Food Payment
         * image in content/projects.ts.
         */}
        <div className="relative overflow-hidden bg-secondary">
          {children}
          {/*
           * Home indicator, drawn where a real one lives: on the screen, not
           * on the bezel. It is the phone's answer to the browser's title
           * bar, the one piece of chrome that is obviously drawn rather than
           * photographed.
           */}
          <span
            aria-hidden="true"
            className="absolute bottom-[1.5%] left-1/2 h-1 w-1/3 -translate-x-1/2 bg-foreground/70"
          />
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
      {/* A light inner bezel, or the near-black game screen merges into the
          shell and you cannot tell where the screen starts. */}
      <div className="overflow-hidden border-4 border-background/60 bg-foreground">
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
