"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { roomFor } from "@/lib/rooms";
import { flipTo, setFlipDuration, setFlipOrigin } from "@/lib/viewTransition";

/*
 * Navigation lives along the floor rather than the top.
 *
 * It carries its own view-transition-name, so the coin flip only turns the
 * page behind it: the nav itself holds still while rooms change.
 *
 * The highlight is a single element that slides to the active item rather
 * than each link toggling its own background.
 */
const LINKS = [
  { href: "/", label: "Hjem" },
  { href: "/prosjekter", label: "Prosjekter" },
  { href: "/cv", label: "CV" },
];

export function WorldStrip() {
  const pathname = usePathname();
  const router = useRouter();

  const listRef = React.useRef<HTMLUListElement>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [marker, setMarker] = React.useState<{ x: number; w: number } | null>(
    null,
  );

  const activeIndex = LINKS.findIndex((link) =>
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
  );

  // Measure after layout so the highlight lands exactly on the item, and
  // re-measure when the strip resizes (rotation, font loading, zoom).
  React.useLayoutEffect(() => {
    const place = () => {
      const list = listRef.current;
      const el = itemRefs.current[activeIndex];
      if (!list || !el) {
        setMarker(null);
        return;
      }
      const listRect = list.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      setMarker({ x: itemRect.left - listRect.left, w: itemRect.width });
    };

    place();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(place);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [activeIndex, pathname]);

  /*
   * No visual-viewport pinning here on purpose.
   *
   * An earlier version transformed and scaled the strip to follow the visual
   * viewport while pinch zoomed. On a phone the viewport also changes size
   * whenever the URL bar slides away, so that transform fired during page
   * changes and sheared a slice off the bar. The browser's own handling of a
   * fixed element is predictable, so let it do the work.
   */

  /*
   * Keeps the strip usable while a flip is still running.
   *
   * During a view transition the captured page is not hit-tested, so a click
   * over the nav is retargeted to <html> and never reaches the link. The
   * event still arrives at the document though, so match it against the real
   * geometry of the buttons and act on whichever one it landed on. That is
   * what lets you change your mind mid-flip.
   */
  const navRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const within = (el: Element, x: number, y: number) => {
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    const rescue = (event: MouseEvent) => {
      const nav = navRef.current;
      if (!nav) return;
      // Normal path: the event already found its target.
      if (nav.contains(event.target as Node)) return;
      if (!within(nav, event.clientX, event.clientY)) return;

      const link = Array.from(nav.querySelectorAll("a")).find((a) =>
        within(a, event.clientX, event.clientY),
      );
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href === pathname) return;

      event.preventDefault();
      event.stopPropagation();
      setFlipOrigin(event.clientX, event.clientY);
      setFlipDuration(roomFor(href).duration);
      flipTo(() => router.push(href));
    };

    document.addEventListener("click", rescue, true);
    return () => document.removeEventListener("click", rescue, true);
  }, [pathname, router]);

  return (
    <div
      className="world-strip pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
    >
      <nav
        ref={navRef}
        aria-label="Hovedmeny"
        className="pointer-events-auto w-full max-w-md overflow-hidden border-4 border-foreground bg-grunn shadow-[4px_4px_0_0_rgb(var(--foreground))] sm:w-auto"
      >
        <ul ref={listRef} className="relative flex items-stretch">
          {marker ? (
            <li
              aria-hidden="true"
              className="nav-marker absolute inset-y-0 bg-foreground"
              style={{
                transform: `translateX(${marker.x}px)`,
                width: `${marker.w}px`,
              }}
            />
          ) : null}

          {LINKS.map((link, i) => (
            <li key={link.href} className="flex flex-1 basis-0">
              <Link
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={link.href}
                aria-current={i === activeIndex ? "page" : undefined}
                className={cn(
                  "relative z-10 flex h-14 flex-1 items-center justify-center whitespace-nowrap px-3 text-center text-sm font-bold transition-colors duration-200 sm:h-12 sm:px-6",
                  i === activeIndex ? "text-background" : "text-grunn-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
