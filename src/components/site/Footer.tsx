import { Sprite } from "@/components/pixel/Sprite";
import { DENJI } from "@/components/pixel/sprites";

const CONTACTS = [
  { href: "mailto:noahnikolaj.c@gmail.com", label: "noahnikolaj.c@gmail.com" },
  {
    href: "https://www.linkedin.com/in/noah-nikolaj-klavestad-christensen-130568247/",
    label: "LinkedIn",
  },
  { href: "https://www.instagram.com/handernoah/", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t-4 border-foreground bg-secondary">
      {/* Bottom padding clears the fixed navigation strip. */}
      <div className="mx-auto w-full max-w-5xl px-5 pb-32 pt-14 sm:px-8">
        <h2 className="font-display text-2xl text-secondary-foreground">
          Ta kontakt
        </h2>

        <ul className="mt-4">
          {CONTACTS.map(({ href, label }) => {
            const external = href.startsWith("http");
            return (
              <li key={href}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex min-h-[44px] items-center font-bold text-secondary-foreground underline decoration-2 underline-offset-4"
                >
                  {label}
                  {external ? (
                    <span className="sr-only"> (åpnes i ny fane)</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex items-end justify-between gap-4">
          <p className="text-sm font-medium text-secondary-foreground">
            © {new Date().getFullYear()} Noah Klavestad-Christensen
          </p>
          <Sprite sprite={DENJI} scale={5} decorative />
        </div>
      </div>
    </footer>
  );
}
