/*
 * Single source of truth for project content.
 *
 * Previously this array was duplicated verbatim in app/page.tsx and
 * app/cv/page.tsx, two copies to keep in sync. The home grid, /prosjekter,
 * the detail pages and the CV all read from here now.
 *
 * [BEKREFT] markers are facts Noah still needs to supply. They are rendered
 * visibly on purpose, nothing unverified should quietly read as fact.
 */

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "figma" | "live" | "play";
};

export type ProjectImage = {
  src: string;
  /** Natural size. Photos keep their own proportions; nothing is cropped to
   *  a shared ratio, which is what made the old carousel look broken. */
  width: number;
  height: number;
  alt: string;
  /** PNGs with an alpha channel sit straight on the pink with no frame. */
  transparent?: boolean;
  /**
   * Which drawn device the screenshot sits inside. See DeviceFrame. Omit for
   * art that is already composed, where a frame would only be a frame around
   * a frame.
   */
  device?: "phone" | "browser" | "handheld";
};

export type Project = {
  slug: string;
  title: string;
  /** One line, shown on cards */
  tagline: string;
  /** Paragraphs, shown on the detail page */
  body: string[];
  role: string;
  period: string;
  stack: string[];
  /** Null when there is genuinely nothing we are allowed to show. */
  image: ProjectImage | null;
  links?: ProjectLink[];
  /** The three shown on the home page */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "guest-food-payment",
    title: "Guest Food Payment",
    tagline:
      "Betalingsløsning for gjestelunsj på arbeidsplassen. Backend-rollen min under praksis hos Welcome Workdays.",
    role: "Backend-utvikler",
    period: "aug. – okt. 2026",
    stack: ["Node.js", "TypeScript", "Backend", "intern APIs", "Firestore/Firebase"],
    image: {
      /*
       * The app screen on its own. The original export is a photoreal iPhone
       * render, which inside a drawn phone was a frame around a frame, and
       * cropping only to the screen rect still left the render's rounded
       * corners and its Dynamic Island behind, so the content read as
       * clipped by a shape that was no longer there.
       *
       * This is cropped inside all of that: no bezel, no corner arcs, no
       * island. A plain rectangle of app, which is what DeviceFrame needs to
       * supply the device itself. The original export is kept untouched.
       */
      src: "/projectphotos/guest-food-payment-app.png",
      device: "phone",
      width: 398,
      height: 792,
      alt: "Mobilskjerm fra Guest Food Payment for Welcome Workdays: landingsside for gjestelunsj på Skippergata 3",
    },
    featured: true,
    body: [
      "Guest Food Payment håndterer bestilling og betaling av mat for gjester på arbeidsplassen. Jeg jobbet på løsningen gjennom praksisperioden min som fullstack-utvikler hos Welcome Workdays, der hovedrollen min var backend.",
      "Min hovedoppgave var gjestelunsj-funksjonaliteten: å modellere hvordan en gjestelunsj blir bestilt, knyttet til riktig vert, og ender opp som en korrekt betaling. Det var her jeg lærte mest i praksisen, å tenke på dataflyt, validering, rate limiting og hva som skjer når noe går galt, ikke bare på hva som skjer når alt går som planlagt.",
      "Dette er arbeid som eies av arbeidsgiver, så beskrivelsen holdes på et overordnet nivå. Interne datamodeller og detaljerte API-spesifikasjoner er ikke delt her.",
      "Mitt hovedansvar var å lage en rekke interne endepunkter for frontend til å kommunisere med databasen og betalingsbehandleren vår (Mollie). Jeg skrev alt i TypeScript og fikk jobbet med GDPR i bakhodet, mens jeg hadde ansvar for lagring av data fra brukeren.",
    ],
  },
  {
    slug: "deadwax",
    title: "Deadwax",
    tagline:
      "Musikk-review-nettsiden min der du logger, vurderer og anmelder albumene du hører på, og ser hva andre hører på.",
    role: "Design og utvikling",
    period: "2025 til nå",
    stack: ["React", "TypeScript", "Node.js", "Supabase", "Vercel"],
    image: {
      src: "/projectphotos/deadwax-live.png",
      device: "browser",
      width: 1600,
      height: 1000,
      alt: "Forsiden av Deadwax: et rutenett av platecover med terningkast under hvert album.",
    },
    featured: true,
    links: [
      { label: "Åpne deadwax.space", href: "https://deadwax.space/", kind: "live" },
    ],
    body: [
      "Deadwax er musikknettsiden min, en logg over albumene du vil dele med andre eller lagre for din egen del. Du logger det du hører på, gir det en review fra 1-5 stjerner, skriver korte anmeldelser, og ser hva andre har hørt på.",
      "Siden er inspirert av min bruk av Letterboxd og var laget mest for min egen del, ettersom jeg er veldig interessert i statistikken til hva jeg hører og ser på. Jeg har stått for både design og utvikling.",
      "Deadwax er laget i React, skrevet i TypeScript og bruker Node.js. Jeg har også tatt i bruk Vercel for hosting, og Supabase som database og for brukerbekreftelse.",
    ],
  },
  {
    slug: "bosett",
    title: "Bosett",
    tagline:
      "Tidslinjebasert integreringsapp som samler nødvendig informasjon for innvandrere i Norge på ett sted.",
    role: "UX-design og prototyping",
    period: "Kristiania",
    stack: ["Figma", "Wireframing", "Prototyping", "Brukertesting"],
    image: {
      src: "/projectphotos/Bosett.png",
      width: 1231,
      height: 1014,
      alt: "To mobilskjermer fra Bosett. Den ene ønsker velkommen til Norge og ber deg velge språk, den andre viser tidslinjen med steg som første ankomst og å opprette bankkonto.",
    },
    featured: true,
    links: [{ label: "Se prototypen", href: "/bosett", kind: "figma" }],
    body: [
      "Bosett er en tidslinjebasert integreringsapp som hjelper innvandrere i Norge med å finne og forstå nødvendig informasjon på ett sted, og som reduserer integreringsstress gjennom en tydelig, brukersentrert steg-for-steg-opplevelse.",
      "Kjerneidéen er tidslinjen: i stedet for å måtte vite hva man skal spørre om, får brukeren se hvilke steg som kommer, i hvilken rekkefølge, og hva hvert steg krever.",
    ],
  },
  {
    slug: "pixiworld",
    title: "PixiWorld",
    tagline:
      "Sosial medieplattform for barn, med trygghet og barnas helse i fokus.",
    role: "Design og utvikling",
    period: "Kristiania",
    stack: ["Design", "Utvikling", "Eksamensprosjekt"],
    image: {
      src: "/projectphotos/Pixiworld.png",
      device: "browser",
      width: 2969,
      height: 1603,
      alt: "PixiWorld sitt oppslagstavle-grensesnitt i pikselkunst, med en pergamentrull som meny og innlegg fra barn i trerammer mot en pikselhimmel.",
    },
    links: [
      {
        label: "Kode på GitHub",
        href: "https://github.com/Noahnikolaj/PixiWorld_SocialNetworkExam",
        kind: "repo",
      },
    ],
    body: [
      "En sosial medieplattform rettet mot barn, som har trygghet og barnas helse i fokus.",
      "Prosjektet handlet like mye om hva man ikke skal bygge som om hva man skal bygge: hvilke mekanismer i sosiale medier som er problematiske for barn, og hvordan en plattform kan utformes uten dem.",
    ],
  },
  {
    slug: "denji",
    title: "Fnaf finding Denji",
    tagline:
      "Fnaf inspirert minispill i nettleseren: finn katten. Laget på én kveld som en invitasjon for min samboer.",
    role: "Design og utvikling",
    period: "okt. 2026",
    stack: ["Canvas", "TypeScript", "Web Audio", "Pixel art", "React"],
    image: {
      src: "/projectphotos/denji-game.png",
      device: "handheld",
      width: 960,
      height: 864,
      alt: "Skjermbilde fra Denji-spillet: et rom i Game Boy-oppløsning med spillerfiguren mellom møbler.",
    },
    links: [{ label: "Spill spillet", href: "/prosjekter/denji", kind: "play" }],
    body: [
      "Et lite letespill bygget i nettleseren på én kveld. Oppgaven er enkel: finn katten Denji. Spillet var opprinnelig inngangen til en halloween-invitasjon, du måtte finne katten før du fikk se invitasjonen.",
      "Alt kjører på et 160×144 piksler stort canvas, samme oppløsning som en Game Boy, skalert opp med pikselert rendering. Rommene er definert som ASCII-tilemaps, og figurene er håndskrevne pikselkunst-strenger med egne palettkart.",
      "Det jeg liker best teknisk: ingen lydfiler. All lyd er syntetisert i Web Audio API, så hele spillet er bare kode. Kollisjonsboksen bruker bare føttene til spilleren, slik at du kan gå delvis bak møbler, og hint eskalerer gradvis hvis du bruker for lang tid, først navnet på rommet, så glødende øyne, til slutt en pil.",
      "Spillet er laget for touch først, med en D-pad som bruker pointer capture, og fungerer like godt med tastatur.",
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
