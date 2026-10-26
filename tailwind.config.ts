import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /*
       * Tokens are space-separated RGB channels in globals.css ("255 238 241"),
       * read here as rgb(var(--x) / <alpha-value>) so opacity modifiers work.
       */
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        /*
         * Noah's brand rose. 2.92:1 on his paper, so it FAILS even the 3:1
         * large-text floor: this is a fill colour only. Never set text in it
         * on a light ground. Put `foreground` ink on top of it instead.
         */
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        /* The deep rose. This is the one that still reads pink AND passes AA. */
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        /* The ground band and the nav strip. Never --primary: see globals.css. */
        grunn: {
          DEFAULT: "rgb(var(--grunn) / <alpha-value>)",
          foreground: "rgb(var(--grunn-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
      fontFamily: {
        // Two families only. Lemon is already Noah's, and Bosett's own logo is
        // a chunky rounded slab, so it is literally his existing voice.
        display: ["var(--font-lemon)", "Georgia", "serif"],
        // Rounded terminals echo soft pixel corners; game-UI heritage; legible
        // at paragraph size; covers æ ø å.
        sans: ["var(--font-rounded)", "ui-rounded", "system-ui", "sans-serif"],
      },
      // Pixel world: nothing is rounded.
      borderRadius: {
        none: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        full: "9999px", // only for genuinely circular things
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
