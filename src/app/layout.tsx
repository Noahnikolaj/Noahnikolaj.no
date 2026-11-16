import type { Metadata, Viewport } from "next";
import { Archivo, BIZ_UDPMincho, DotGothic16, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/*
 * Titles and menus: Unbounded. Wide and rounded, the shape of a 2000s
 * console's own lettering, softer than a grotesk and drawn with æ ø å.
 */
const display = Unbounded({
  subsets: ["latin", "latin-ext"],
  variable: "--font-unbounded",
  display: "swap",
});

/*
 * Everything you read in paragraphs: BIZ UDPMincho. A Japanese mincho, its
 * Latin slim and a little condensed, the voice of a console's own text
 * screens. The proportional cut, so long CV paragraphs still read evenly.
 */
const mincho = BIZ_UDPMincho({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-mincho",
  display: "swap",
});

/* Kept for the few places that want a sturdy grotesk: a cartridge's
   moulded code and the Deadwax logo. */
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

/*
 * The system voice. A Japanese bitmap gothic from the era these menus come
 * from, used only for the small lines the machine says to you. It is also
 * the one place the pixel grid still shows in the type.
 */
const system = DotGothic16({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-system",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Noah Klavestad-Christensen",
    template: "%s | Noah Klavestad-Christensen",
  },
  description:
    "Portefølje for Noah Klavestad-Christensen. Masterstudent i Human Computer Interaction ved Høyskolen Kristiania, designer og utvikler.",
  openGraph: {
    title: "Noah Klavestad-Christensen",
    description:
      "Designer og utvikler. Masterstudent i Human Computer Interaction.",
    locale: "nb_NO",
    type: "website",
  },
};

/*
 * One palette, so the browser chrome is told about it directly rather than
 * being left to guess from the reader's OS setting.
 */
export const viewport: Viewport = {
  themeColor: "#FFEEF1",
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning is for the script below, which puts a class on
     * <html> before React hydrates. The class deliberately is not in the
     * server HTML, so the two differ by design and React would otherwise
     * report it as a mismatch on every load.
     *
     * It used to be here for next-themes and was removed with it. The script
     * had always needed it too.
     */
    <html lang="nb" suppressHydrationWarning>
      <body className={`${display.variable} ${mincho.variable} ${archivo.variable} ${system.variable}`}>
        {/*
          Marks the document as reveal-capable before first paint. The scroll
          reveal styles are scoped to this class, so with JS disabled nothing
          is ever hidden, which is why it cannot be rendered on the server.

          It also marks the first page of a visit for the power-on sequence
          (PowerOn.tsx), before paint, so nothing shows and then jumps back.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js-reveal');" +
              "try{if(!sessionStorage.getItem('startet'))document.documentElement.setAttribute('data-boot','')}catch(e){}",
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
