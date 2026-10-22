import { Reveal } from "@/components/pixel/Reveal";

/*
 * One stop on the CV. This content genuinely is a sequence in time, so the
 * vertical rail and the marker encode real information rather than decorate.
 */
export function TimelineEntry({
  heading,
  subheading,
  period,
  description,
  bullets,
  index = 0,
}: {
  heading: string;
  subheading: string;
  period: string;
  description?: string;
  bullets?: string[];
  index?: number;
}) {
  return (
    <Reveal
      as="li"
      delay={Math.min(index, 3) * 80}
      className="relative pl-9 pb-11 last:pb-0"
    >
      <span
        aria-hidden="true"
        className="absolute left-[6px] top-3 h-full w-1 bg-border"
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-4 w-4 border-4 border-foreground bg-primary"
      />

      <div className="flex flex-col gap-x-6 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-display text-xl">{heading}</h3>
        <span className="shrink-0 text-sm font-bold text-muted-foreground">
          {period}
        </span>
      </div>

      <p className="mt-1 font-bold text-accent">{subheading}</p>

      {description ? (
        <p className="mt-3 leading-relaxed">{description}</p>
      ) : null}

      {bullets && bullets.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-[0.5em] h-2 w-2 shrink-0 bg-primary"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Reveal>
  );
}
