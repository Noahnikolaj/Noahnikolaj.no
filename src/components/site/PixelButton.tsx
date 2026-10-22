import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * One button for the site. A `href` renders a single <a>, anything else a
 * single <button>: never a link nested inside a button, which is what the old
 * markup did and what makes screen readers announce nested interactives.
 *
 * Pressing it moves the button down onto its own shadow, the way a physical
 * key travels. That is motion answering an action, so it stays.
 */
const pixelButton = cva(
  [
    "inline-flex items-center justify-center gap-2 font-bold",
    "border-4 border-foreground",
    "shadow-[4px_4px_0_0_rgb(var(--foreground))]",
    "transition-[transform,box-shadow] duration-75",
    "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgb(var(--foreground))]",
    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    "motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-[1.1em] [&_svg]:shrink-0",
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

type Props = VariantProps<typeof pixelButton> & {
  className?: string;
  children: React.ReactNode;
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
  ...props
}: Props) {
  const classes = cn(pixelButton({ variant, size }), className);

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
          {children}
          <span className="sr-only"> (åpnes i ny fane)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
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
      {children}
    </button>
  );
}
