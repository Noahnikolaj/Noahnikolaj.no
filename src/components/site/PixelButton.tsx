import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { SpriteStrip } from "@/components/pixel/SpriteStrip";
import { DENJI_FRAMES, NOAH_FRAMES } from "@/components/pixel/sprites";
import { cn } from "@/lib/utils";

/*
 * One button for the site. A `href` renders a single <a>, anything else a
 * single <button>: never a link nested inside a button, which is what the old
 * markup did and what makes screen readers announce nested interactives.
 *
 * The face is frosted, bevelled at one corner, with a bar on the left that
 * grows into a block under the pointer, the way a system menu marks the
 * item you are on. Pressing presses it in.
 *
 * `companion` puts one of the sprites behind the top edge, popping up on
 * hover or keyboard focus. It is a child of the single <a>/<button> rather
 * than a wrapper, so the element stays one interactive thing, and it is
 * pointer-events: none so it can never eat the click it is sitting on.
 */
const pixelButton = cva(
  [
    // `has-peek` and `relative` are what let the companion hang off the top
    // edge and react to hover/focus on the button itself. `isolate` keeps
    // the face (a pseudo-element behind the label) inside the button.
    "has-peek ps-btn relative isolate inline-flex items-center justify-center gap-2",
    "font-display font-medium uppercase tracking-[0.04em]",
    "disabled:pointer-events-none disabled:opacity-50",
    /*
     * Sizes icons passed as children to the label. Scoped past the
     * companion, which is art at its own scale rather than an icon.
     */
    "[&_svg:not(.peek-sprite)]:size-[1.1em] [&_svg:not(.peek-sprite)]:shrink-0",
  ],
  {
    variants: {
      // Rose is a fill; the label on top of it is always the dark ink (5.35:1).
      variant: {
        rosa: "ps-btn--rosa",
        papir: "ps-btn--papir",
        lys: "ps-btn--lys",
      },
      size: {
        sm: "h-9 pl-5 pr-4 text-[0.62rem]",
        md: "h-11 pl-6 pr-5 text-[0.7rem]",
        lg: "h-14 pl-8 pr-7 text-[0.8rem]",
      },
    },
    defaultVariants: { variant: "rosa", size: "md" },
  },
);

const COMPANIONS = { noah: NOAH_FRAMES, denji: DENJI_FRAMES } as const;

type Props = VariantProps<typeof pixelButton> & {
  className?: string;
  children: React.ReactNode;
  /** Who peeks over the top edge on hover. Decorative; use it sparingly. */
  companion?: keyof typeof COMPANIONS;
} & (
    | ({ href: string } & Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "className" | "children"
      >)
    | ({ href?: undefined } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        "className" | "children"
      >)
  );

export function PixelButton({
  variant,
  size,
  className,
  children,
  companion,
  ...props
}: Props) {
  const classes = cn(pixelButton({ variant, size }), className);

  /*
   * Only buttons that carry a character need watching, and only on touch:
   * see TouchSpotlight.
   */
  const spotlight = companion ? { "data-spotlight": "" } : null;

  /*
   * Rail, climber, strips. The rail is exactly one frame wide and clips on
   * both axes, so it is the window the strips are walked past; the climber
   * carries the slide up and down. See the note in globals.css.
   */
  const frames = companion ? COMPANIONS[companion] : null;
  const peek = frames ? (
    <span aria-hidden="true" className="button-peek">
      <span
        className="button-peek-climb"
        style={{ ["--peek-idle" as string]: `${frames.idleMs}ms` }}
      >
        <SpriteStrip
          frames={frames.climb}
          className="peek-sprite peek-strip peek-strip--climb"
        />
        <SpriteStrip
          frames={frames.idle}
          className="peek-sprite peek-strip peek-strip--idle"
        />
        <SpriteStrip
          frames={frames.press}
          className="peek-sprite peek-strip peek-strip--press"
        />
      </span>
    </span>
  ) : null;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    // Mail opens the mail app; it is not a page, so no new tab.
    const external = /^https?:/.test(href);
    if (/^mailto:/.test(href)) {
      return (
        <a href={href} className={classes} {...spotlight} {...rest}>
          {peek}
          {children}
        </a>
      );
    }

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...spotlight}
          {...rest}
        >
          {peek}
          {children}
          <span className="sr-only"> (åpnes i ny fane)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...spotlight} {...rest}>
        {peek}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...spotlight}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {peek}
      {children}
    </button>
  );
}
