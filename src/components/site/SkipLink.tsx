/* WCAG 2.4.1. Hidden until focused, so it is the first keyboard stop. */
export function SkipLink() {
  return (
    <a
      href="#hovedinnhold"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:py-2 focus:font-bold focus:text-foreground focus:shadow-[0_0_0_4px_rgb(var(--foreground))]"
    >
      Hopp til hovedinnhold
    </a>
  );
}
