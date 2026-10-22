import {
  Atom,
  Box,
  Brush,
  BookOpen,
  Camera,
  Code,
  Cuboid,
  Database,
  Figma,
  Film,
  GitGraph,
  Globe,
  Image as ImageIcon,
  Languages,
  Layout,
  Mic,
  Palette,
  PenTool,
  Server,
  Smartphone,
  Terminal,
  Video,
  type LucideIcon,
} from "lucide-react";

export const bio = {
  name: "Noah Klavestad-Christensen",
  title: "Masterstudent i Human Computer Interaction",
  intro:
    "Hei! Jeg er Noah, en masterstudent ved Høyskolen Kristiania, der jeg studerer Human Computer Interaction (HCI) :)",
};

export type ExperienceEntry = {
  organisation: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    organisation: "Welcome Workdays",
    role: "Fullstack-utvikler (praksis)",
    period: "aug. 2026 – okt. 2026",
    summary:
      "Praksisperiode som fullstack-utvikler, med backend som hovedrolle. Jeg jobbet på Guest Food Payment, der jeg hadde ansvar for gjestelunsj-funksjonaliteten.",
    bullets: [
      "Hovedansvar for backend på gjestelunsj-funksjonen: modellering av hvordan en bestilling knyttes til riktig vert og ender opp som en korrekt betaling.",
      "Bygget en rekke interne endepunkter som frontend bruker mot databasen og mot betalingsbehandleren vår, Mollie.",
      "Skrev alt i TypeScript på Node.js, med Firestore som database.",
      "Hadde ansvar for lagring av brukerdata, og jobbet med GDPR i bakhodet gjennom hele perioden.",
      "Lærte mest om dataflyt, validering, rate limiting og hva som skjer når noe går galt, ikke bare når alt går som planlagt.",
    ],
  },
];

export type EducationEntry = {
  institution: string;
  degree: string;
  period: string;
  description: string;
};

export const education: EducationEntry[] = [
  {
    institution: "Høyskolen Kristiania",
    degree: "Master i Human Computer Interaction (HCI)",
    period: "aug. 2025 – jun. 2027",
    description:
      "Jeg har en spesiell interesse for Virtual og artificial reality (VR og AR), samt kunstig intelligens. For tiden ønsker jeg å forske på hvordan vi kan anvende HCI-prinsipper i VR/AR-miljøer og AI-drevne systemer, for å gjøre dem mer tilgjengelige og menneskesentrerte.",
  },
  {
    institution: "Korea University",
    degree: "Exchange Student",
    period: "sep. 2024 – des. 2024",
    description:
      'Fikk tverrkulturelt perspektiv på UX og teknologi ved et av Koreas prestisjeskoler "SKY"-universitetene. Her fikk jeg observert koreanske designmønstre og "mobile-first" brukeropplevelser i et høyteknologisk samfunn bygd rundt mobiltelefoner.',
  },
  {
    institution: "Universitetet i Oslo (UiO)",
    degree: "Bachelor i Informatikk: Design, Bruk og Interaksjon",
    period: "aug. 2022 – jun. 2025",
    description:
      "Gjennom min bachelorgrad ved Universitetet i Oslo (UiO) fordypet jeg meg i både Backend utvikling og brukerdesign. Jeg fikk mye verdifull, praktisk erfaring gjennom større prosjekter med fokus på Android-utvikling og smidig metodikk (Scrum).",
  },
];

/*
 * Replaces the old 30-case switch statement. A missing entry simply renders
 * no icon, so adding a skill never needs a code change here.
 */
export const skillIcons: Record<string, LucideIcon> = {
  "TrueNas Scale": Server,
  "Ubuntu Server": Terminal,
  Docker: Box,
  Supabase: Database,
  Firestore: Database,
  "REST-API-er": Server,
  Vercel: Globe,
  Canvas: Palette,
  "Web Audio API": Mic,
  GDPR: BookOpen,
  Brukertesting: Layout,
  Python: Code,
  Java: Code,
  Kotlin: Code,
  TypeScript: Code,
  "Node.js": Server,
  SQL: Database,
  HTML: Code,
  CSS: Palette,
  Figma: Figma,
  Wireframing: Figma,
  Prototyping: Figma,
  React: Atom,
  "Next.js": Globe,
  "Android Studio": Smartphone,
  "Jetpack Compose": Layout,
  "Git/Github": GitGraph,
  InDesign: BookOpen,
  Illustrator: PenTool,
  Photoshop: ImageIcon,
  Lightroom: Camera,
  Premiere: Video,
  Audition: Mic,
  "Final Cut Pro": Film,
  Blender: Cuboid,
  Procreate: Brush,
  "Foto/Drone": Camera,
  "Norsk (Morsmål)": Languages,
  "Engelsk (Akademisk)": Languages,
  "Koreansk (Nybegynner)": Languages,
};

export type SkillGroup = {
  title: string;
  tone: "primary" | "accent";
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Utvikling",
    tone: "primary",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Java",
      "Kotlin",
      "HTML",
      "CSS",
      "Canvas",
      "Web Audio API",
      "Android Studio",
      "Jetpack Compose",
      "Git/Github",
    ],
  },
  {
    title: "Backend og data",
    tone: "primary",
    skills: ["Firestore", "Supabase", "REST-API-er", "GDPR"],
  },
  {
    title: "Design",
    tone: "accent",
    skills: ["Figma", "Wireframing", "Prototyping", "Brukertesting"],
  },
  {
    title: "Hosting og drift",
    tone: "primary",
    skills: ["Vercel", "TrueNas Scale", "Ubuntu Server", "Docker"],
  },
  {
    title: "Kreative Verktøy",
    tone: "accent",
    skills: [
      "InDesign",
      "Illustrator",
      "Photoshop",
      "Lightroom",
      "Premiere",
      "Audition",
      "Final Cut Pro",
      "Procreate",
      "Foto/Drone",
    ],
  },
  {
    title: "Språk",
    tone: "primary",
    skills: [
      "Norsk (Morsmål)",
      "Engelsk (Akademisk)",
      "Koreansk (Nybegynner)",
    ],
  },
];
