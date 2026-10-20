import { ACTIVITIES, EVENT_END, EVENT_START, PLACE } from "@/components/halloween/invite";

export const dynamic = "force-static";

/**
 * Serves the invitation as a real .ics file. Tapping the link on an iPhone
 * opens Apple Calendar's "Add Event" sheet directly, which a blob download
 * would not do reliably.
 */
export function GET() {
  const description = ACTIVITIES.map((a) => a.label).join(", ") + ".";

  // ICS requires CRLF line endings.
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//noahnikolaj.no//halloween//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:halloween-denji-2026@noahnikolaj.no",
    `DTSTAMP:${EVENT_START}Z`,
    `DTSTART:${EVENT_START}`,
    `DTEND:${EVENT_END}`,
    "SUMMARY:Halloweenkveld 🎃",
    `LOCATION:${PLACE}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="halloween.ics"',
    },
  });
}
