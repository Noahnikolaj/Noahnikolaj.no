"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Sprite } from "@/components/pixel/Sprite";
import { NOAH } from "@/components/pixel/sprites";
import { roomFor } from "@/lib/rooms";
import { onTitleChange, titleActive } from "@/lib/titleScreen";
import { cn } from "@/lib/utils";

/*
 * The front of the console, with a teleporter on top.
 *
 * Navigation is the face of the machine: one slim plastic strip along the
 * bottom of the screen. At its left end a small recessed bay holds the
 * teleport pad, with Noah standing on it; then three keys, the one for
 * the page you are on pressed in with its light on. Nothing sticks up out
 * of the strip, so it never sits on top of the page. Pressing another button clicks it
 * down, a beam shoots up out of the pad and Noah goes up in it, slice by
 * slice; on the new page the beam comes down and he is put back together.
 * The world behind travels to the new room in the meantime.
 *
 * Arriving any other way (a link in a page, the back button) plays the
 * arrival too, so he always comes in by the beam.
 *
 * On a desktop, when you arrive he says a line about the room you are in.
 * A phone has no room for it over the page, so there he stays quiet. On a
 * phone the console tucks away while you scroll down through a page, back
 * the moment you scroll up or reach the end.
 *
 * The footer is the back of the same console.
 */
const BUTTONS = [
  { href: "/", label: "Hjem" },
  { href: "/prosjekter", label: "Prosjekter" },
  { href: "/cv", label: "CV" },
];

/* What Noah says on arriving in each room. */
const LINES: Record<string, string> = {
  hjem: "Hjemme igjen. Fire spill på hylla.",
  prosjekter: "Velg et spill, så går det i maskinen.",
  prosjekt: "Her er hele historien bak spillet.",
  cv: "Arkivet. Alt jeg har jobbet med.",
  bosett: "Bosett-prototypen. Klikk deg rundt!",
  denji: "Pst. Finn katten før det blir mørkt.",
  borte: "Hm. Her er det ingen.",
};
const FIRST_LINE = "Hei, jeg er Noah! Trykk en knapp, så teleporterer vi.";
const TYPE_MS = 28;
const HOLD_MS = 2600;
const BEAM_UP_MS = 480;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function WorldFloor() {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = BUTTONS.findIndex((b) =>
    b.href === "/" ? pathname === "/" : pathname.startsWith(b.href),
  );

  const [phase, setPhase] = React.useState<"idle" | "leaving" | "arriving">("idle");
  const [pressed, setPressed] = React.useState<number | null>(null);
  const [tucked, setTucked] = React.useState(false);
  const [line, setLine] = React.useState<string | null>(null);
  const leaving = React.useRef(false);
  const lastPath = React.useRef(pathname);

  // Arriving in a room: the beam comes down and puts him back together.
  React.useEffect(() => {
    leaving.current = false;
    setPressed(null);
    // The page he loaded on: he is simply standing there.
    if (lastPath.current === pathname) {
      setPhase("idle");
      return;
    }
    lastPath.current = pathname;
    if (reducedMotion()) {
      setPhase("idle");
      return;
    }
    setPhase("arriving");
    const done = window.setTimeout(() => setPhase("idle"), 800);
    return () => window.clearTimeout(done);
  }, [pathname]);

  const teleport = React.useCallback(
    (index: number) => {
      const target = BUTTONS[index];
      if (!target || index === activeIndex || leaving.current) return;
      leaving.current = true;
      setPressed(index);
      setLine(null);
      if (reducedMotion()) {
        router.push(target.href);
        return;
      }
      setPhase("leaving");
      window.setTimeout(() => router.push(target.href), BEAM_UP_MS);
    },
    [activeIndex, router],
  );

  const press = (event: React.MouseEvent, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    teleport(index);
  };

  // Arrow keys move between the buttons once one has focus.
  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const links = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLAnchorElement>(".console-button"),
    );
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (at < 0) return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    links[(at + step + links.length) % links.length]?.focus();
  };

  // Phone only: tuck away scrolling down, come back scrolling up or at the end.
  React.useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (!phone.matches) {
          setTucked(false);
          lastY = y;
          return;
        }
        const atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 48;
        if (atEnd || y < 80) setTucked(false);
        else if (y > lastY + 8) setTucked(true);
        else if (y < lastY - 8) setTucked(false);
        if (Math.abs(y - lastY) > 8) lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // A line for the room, a beat after arriving, then gone. Not on a phone.
  React.useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setLine(null);
      return;
    }
    // The first page of a visit still carries the boot mark (see PowerOn).
    const first = pathname === "/" && document.documentElement.hasAttribute("data-boot");
    const text = first ? FIRST_LINE : (LINES[roomFor(pathname).id] ?? LINES.borte);
    setLine(null);
    const timers: number[] = [];
    const say = (delay: number) => {
      timers.push(
        window.setTimeout(() => {
          setLine(text);
          setTucked(false);
        }, delay),
      );
      timers.push(
        window.setTimeout(() => setLine(null), delay + text.length * TYPE_MS + HOLD_MS),
      );
    };
    // Behind the title screen he waits, and greets you once the console is up.
    let off = () => {};
    if (titleActive()) {
      off = onTitleChange(() => {
        if (titleActive()) return;
        off();
        say(1100);
      });
    } else {
      say(800);
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      off();
    };
  }, [pathname]);

  return (
    <div className={cn("world-floor", tucked && "is-tucked")}>
      <nav
        aria-label="Hovedmeny"
        className="floor-nav console-front"
        onFocus={() => setTucked(false)}
        onKeyDown={onKey}
      >
        <div className="console-body">
          {/* The teleporter bay and Noah. Decorative: the keys say where you are. */}
          <div
            aria-hidden="true"
            className={cn(
              "console-pad",
              phase === "leaving" && "is-leaving",
              phase === "arriving" && "is-arriving",
            )}
          >
            <span className="pad-beam" />
            <span className="pad-ring" />
            <span className="pad-noah">
              <Sprite sprite={NOAH} scale={4} decorative className="sprite-idle" />
              {line ? <Bubble key={line + pathname} text={line} /> : null}
            </span>
          </div>

          <ul className="console-buttons">
            {BUTTONS.map((button, i) => {
              const current = i === activeIndex;
              return (
                <li key={button.href}>
                  <Link
                    href={button.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "console-button",
                      current && "is-on",
                      pressed === i && "is-pressed",
                    )}
                    onClick={(event) => press(event, i)}
                  >
                    <span aria-hidden="true" className="console-led" />
                    {button.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

    </div>
  );
}

/* What he says, typed out a letter at a time over his head. */
function Bubble({ text }: { text: string }) {
  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    if (reducedMotion()) {
      setShown(text.length);
      return;
    }
    const id = window.setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <span className="floor-bubble is-middle">
      {text.slice(0, shown)}
      {/* The rest, invisible, so the bubble is its full size from the start. */}
      <span className="invisible">{text.slice(shown)}</span>
    </span>
  );
}
