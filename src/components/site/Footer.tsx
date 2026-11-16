"use client";

import * as React from "react";

/*
 * The footer is the back of the console.
 *
 * The same dark plastic as the machine on Prosjekter, turned around: screws
 * in the corners, a vent, the rating sticker, a power socket, and three
 * ports along the back, one for each way to reach Noah. Pointing at a port
 * (or tabbing to it) lowers a cable over it; clicking pushes the plug home,
 * lights the LED and leaves it plugged in.
 *
 * A phone has no pointer to hover with, so there the cables peek down one
 * after another when the console comes into view, to show they move, and a
 * tap plays the whole plug-in before the link opens.
 *
 * Every port is an ordinary link with its address written under it, so the
 * e-mail can be read and copied without plugging anything in.
 */
const PORTS = [
  {
    href: "mailto:noahnikolaj.c@gmail.com",
    label: "E-post",
    sub: "noahnikolaj.c@gmail.com",
    className: "port port--usb",
  },
  {
    href: "https://www.linkedin.com/in/noah-nikolaj-klavestad-christensen-130568247/",
    label: "LinkedIn",
    sub: "Noah Nikolaj K-C",
    className: "port port--jack",
  },
  {
    href: "https://www.instagram.com/handernoah/",
    label: "Instagram",
    sub: "@handernoah",
    className: "port port--hdmi",
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const back = React.useRef<HTMLDivElement>(null);
  const [plugged, setPlugged] = React.useState<string | null>(null);
  const [awake, setAwake] = React.useState(false);

  // The peek, once, the first time the console is on screen.
  React.useEffect(() => {
    const el = back.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setAwake(true);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const plugIn = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setPlugged(href);
    // With a mouse the cable is already over the port: go straight away.
    if (!window.matchMedia("(hover: none)").matches) return;
    // On touch, let the plug go home first, then follow it.
    event.preventDefault();
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        window.location.href = href;
      },
      quick ? 0 : 520,
    );
  };

  return (
    <footer className="mt-20">
      {/* Bottom padding clears the fixed floor. */}
      <div className="mx-auto w-full max-w-5xl px-3 pb-28 sm:px-5">
        <div ref={back} className={`console-back${awake ? " is-awake" : ""}`}>
          <span aria-hidden="true" className="screw screw--tl" />
          <span aria-hidden="true" className="screw screw--tr" />
          <span aria-hidden="true" className="screw screw--bl" />
          <span aria-hidden="true" className="screw screw--br" />
          <span aria-hidden="true" className="console-vents" />

          <div className="console-head">
            <h2 className="console-title">Ta kontakt</h2>
            <p className="console-hint">Koble til en av portene.</p>
          </div>

          <ul className="console-ports">
            {PORTS.map(({ href, label, sub, className }) => {
              const external = href.startsWith("http");
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`${className}${plugged === href ? " is-plugged" : ""}`}
                    onClick={(event) => plugIn(event, href)}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span aria-hidden="true" className="port-cable">
                      <span className="port-plug" />
                    </span>
                    <span aria-hidden="true" className="port-socket">
                      <span className="port-led" />
                    </span>
                    <span className="port-label">{label}</span>
                    <span className="port-sub">{sub}</span>
                    {external ? <span className="sr-only"> (åpnes i ny fane)</span> : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="console-sticker">
            <p className="console-sticker-name">Noah Nikolaj</p>
            <p>Modell NNK-01</p>
            <p>Laget i Norge, {year}</p>
            <span aria-hidden="true" className="console-barcode" />
            <p className="console-copy">© {year} Noah Klavestad-Christensen</p>
          </div>

          <span aria-hidden="true" className="console-power">
            <span />
            DC IN
          </span>
        </div>
      </div>
    </footer>
  );
}
