import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Sprite } from "@/components/pixel/Sprite";
import { DENJI, NOAH } from "@/components/pixel/sprites";
import { cn } from "@/lib/utils";

/*
 * One button for the site. A `href` renders a single <a>, anything else a
 * single <button>: never a link nested inside a button, which is what the old
 * markup did and what makes screen readers announce nested interactives.
 *
 * Pressing it moves the button down onto its own shadow, the way a physical
 * key travels. That is motion answering an action, so it stays.
 *
 * `companion` puts one of the sprites behind the top edge, popping up on
 * hover or keyboard focus. It is a child of the single <a>/<button> rather
 * than a wrapper, so the element stays one interactive thing, and it is
 * pointer-events: none so it can never eat the click it is sitting on.
 */
const pixelButton = cva(
  [
    // `has-peek` and `relative` are what let the companion hang off the top
    // edge and react to hover/focus on the button itself. Its own class, not
    // Tailwind's shared `group`: see the note in globals.css.
    "has-peek relative inline-flex items-center justify-center gap-2 font-bold",
    "border-4 border-foreground",
    "shadow-[4px_4px_0_0_rgb(var(--foreground))]",
    "transition-[transform,box-shadow] duration-75",
    "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgb(var(--foreground))]",
    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    "motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-50",
    /*
     * Sizes icons passed as children to the label. Scoped past the
     * companion, which is art at its own scale rather than an icon and was
     * being squashed to 1.1em by this.
     */
    "[&_svg:not(.peek-sprite)]:size-[1.1em] [&_svg:not(.peek-sprite)]:shrink-0",
  ],
  {
    variants: {
      // Rose is a fill; the label on top of it is always the dark ink (5.35:1).
      variant: {
        rosa: "bg-primary text-primary-foreground",
        papir: "bg-card text-card-foreground",
        lys: "bg-secondary text-secondary-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-lg",
      },
    },
    defaultVariants: { variant: "rosa", size: "md" },
  },
);

const COMPANIONS = { noah: NOAH, denji: DENJI } as const;

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
   * Rail, climber, sprite. The rail clips, the climber slides, the sprite
   * breathes and squashes: see the note in globals.css for why they are
   * three elements and not one.
   */
  const peek = companion ? (
    <span aria-hidden="true" className="button-peek">
      <span className="button-peek-climb">
        <Sprite
          sprite={COMPANIONS[companion]}
          scale={5}
          decorative
          className="peek-sprite"
        />
      </span>
    </span>
  ) : null;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    const external = /^https?:|^mailto:/.test(href);

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {peek}
          {children}
          <span className="sr-only"> (åpnes i ny fane)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {peek}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {peek}
      {children}
    </button>
  );
}
