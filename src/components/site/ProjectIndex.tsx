"use client";

import * as React from "react";
import Image from "next/image";

import { Cartridge } from "@/components/site/Cartridge";
import { DeviceFrame } from "@/components/site/DeviceFrame";
import { PixelButton } from "@/components/site/PixelButton";
import { SpriteStrip } from "@/components/pixel/SpriteStrip";
import { DENJI_JOBS } from "@/components/pixel/denjiJobs";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/*
 * The projects as game cartridges and a machine that plays them.
 *
 * A rack of cartridges runs under the machine, each one labelled with its
 * project. Picking one drops it into the slot on top of the machine, a beam
 * of light comes up out of the slot, and the project appears in it as a
 * hologram: the real screenshot, large and at full colour, floating and
 * turning a little toward the pointer. What the project is comes in beside.
 *
 * On a phone the rack is a row you swipe, and whichever cartridge settles
 * in the middle is the one loaded. That is the phone's own scrolling with
 * snap points, so it costs nothing to run.
 *
 * ?velg=<project> loads a project, so one can be linked straight to.
 * Left and right walk the rack when it has focus.
 */

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState(0);
  const rack = React.useRef<HTMLUListElement>(null);
  const items = React.useRef<(HTMLButtonElement | null)[]>([]);
  const stage = React.useRef<HTMLDivElement>(null);
  // Set while a tap is scrolling its cartridge to the middle, so the scroll
  // handler does not load the ones it passes on the way.
  const steering = React.useRef(false);

  const remember = React.useCallback(
    (index: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set("velg", projects[index].slug);
      window.history.replaceState(window.history.state, "", url);
    },
    [projects],
  );

  const centre = (index: number, smooth: boolean) => {
    const el = items.current[index];
    const row = rack.current;
    if (!el || !row || row.scrollWidth <= row.clientWidth) return;
    const target = el.offsetLeft + el.offsetWidth / 2 - row.clientWidth / 2;
    row.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
  };

  const choose = (index: number, smooth = true) => {
    setActive(index);
    remember(index);
    steering.current = true;
    centre(index, smooth);
    window.setTimeout(() => {
      steering.current = false;
    }, 500);
  };

  // A linked project starts loaded and in the middle.
  React.useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("velg");
    const index = projects.findIndex((p) => p.slug === wanted);
    if (index >= 0) {
      setActive(index);
      requestAnimationFrame(() => centre(index, false));
    }
  }, [projects]);

  // Swiping: whichever cartridge comes to rest in the middle is loaded.
  React.useEffect(() => {
    const row = rack.current;
    if (!row) return;
    let timer = 0;
    const settle = () => {
      if (steering.current || row.scrollWidth <= row.clientWidth) return;
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((current) => {
        if (current !== best) remember(best);
        return best;
      });
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 90);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [remember]);

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = Math.min(projects.length - 1, Math.max(0, active + step));
    choose(next);
    items.current[next]?.focus({ preventScroll: true });
  };

  // The hologram leans toward the mouse. Written straight to CSS, no renders.
  const lean = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((event.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((event.clientY - r.top) / r.height) * 2 - 1;
    el.style.setProperty("--ry", `${(nx * 10).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-ny * 6).toFixed(2)}deg`);
  };
  const unlean = () => {
    stage.current?.style.setProperty("--ry", "0deg");
    stage.current?.style.setProperty("--rx", "0deg");
  };

  const shown = projects[active];

  return (
    <div className="cart-index">
      <div
        ref={stage}
        className="holo-stage"
        onPointerMove={lean}
        onPointerLeave={unlean}
        aria-hidden="true"
      >
        <div className="holo-view">
          <span key={`beam-${shown.slug}`} className="holo-beam" />
          <div key={shown.slug} className="holo-art">
            <div className="holo-float">
              <ProjectArt project={shown} maxHeight="min(19rem, 40vh)" />
              <span className="holo-scan" />
            </div>
          </div>
        </div>

        <div className="holo-machine">
          <span key={`cart-${shown.slug}`} className="holo-cart">
            <Cartridge project={shown} />
          </span>
          <span className="holo-base">
            <span key={`led-${shown.slug}`} className="holo-led" />
          </span>
          <ProjectDenji key={`denji-${shown.slug}`} slug={shown.slug} className="holo-denji" />
        </div>
      </div>

      <ul ref={rack} className="rack" aria-label="Prosjekter" onKeyDown={onKey}>
        {projects.map((project, index) => (
          <li key={project.slug} className="rack-slot">
            <button
              ref={(el) => {
                items.current[index] = el;
              }}
              type="button"
              aria-pressed={index === active}
              onClick={() => choose(index)}
              className="rack-item"
            >
              <Cartridge project={project} />
              <span className="rack-caption">{project.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <section
        key={`details-${shown.slug}`}
        className="cart-details shop-details flex flex-col items-start gap-3"
        aria-live="polite"
        aria-label={shown.title}
      >
        <h2 className="shop-title text-2xl sm:text-3xl" style={{ ["--i" as string]: 0 }}>
          {shown.title}
        </h2>
        <div className="text-sm" style={{ ["--i" as string]: 1 }}>
          <p className="font-bold">{shown.role}</p>
          <p className="text-muted-foreground">{shown.period}</p>
        </div>
        <ul className="flex flex-wrap gap-2" style={{ ["--i" as string]: 2 }}>
          {shown.stack.map((item) => (
            <li key={item} className="ps-chip">
              {item}
            </li>
          ))}
        </ul>
        <p className="leading-relaxed" style={{ ["--i" as string]: 3 }}>
          {shown.tagline}
        </p>
        <div className="mt-2" style={{ ["--i" as string]: 4 }}>
          <PixelButton href={`/prosjekter/${shown.slug}`}>Åpne prosjektet</PixelButton>
        </div>
      </section>
    </div>
  );
}

/*
 * One project's art, inside whichever device it belongs in. The height cap
 * rather than a width cap is what keeps a tall phone screenshot and a wide
 * browser screenshot the same visual size.
 */
function ProjectArt({ project, maxHeight }: { project: Project; maxHeight: string }) {
  const { image } = project;

  if (!image) {
    return (
      <div className="ps-well flex max-w-[22rem] items-center justify-center p-6">
        <p className="max-w-[24ch] text-center text-sm font-medium leading-relaxed text-muted-foreground">
          Arbeidet eies av Welcome Workdays, så det kan ikke vises her.
        </p>
      </div>
    );
  }

  return (
    <DeviceFrame device={image.device ?? "none"} className="max-w-full">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 768px) 80vw, 28rem"
        // The picture in the beam is the point of the screen: never deferred.
        loading="eager"
        style={{ maxHeight }}
        className="block h-auto w-auto max-w-full"
      />
    </DeviceFrame>
  );
}

/*
 * Denji, doing whatever this project has her doing: eating the guest lunch,
 * wearing headphones, sitting with a suitcase. Decorative.
 */
function ProjectDenji({ slug, className }: { slug: string; className?: string }) {
  const job = DENJI_JOBS[slug];
  if (!job) return null;
  return (
    <span
      aria-hidden="true"
      className={cn("project-denji", className)}
      style={{ ["--denji-ms" as string]: `${job.ms}ms` }}
    >
      <SpriteStrip frames={job.frames} scale={5} className="project-denji-strip" />
    </span>
  );
}
