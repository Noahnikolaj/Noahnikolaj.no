import type { Metadata, Viewport } from "next";
import { Bungee, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/*
 * Display face.
 *
 * Was Lemon, which a designer read as "the default font in Word": rounded
 * serif terminals that say word processor rather than pixel art. Bungee is
 * drawn for vertical signage, so it is built from flat slabs with no
 * tapering at all. It keeps the weight Lemon had and throws away the
 * softness, and it draws æ ø å itself rather than falling back.
 *
 * One weight, by design. It is a display face and never sets running text.
 */
const display = Bungee({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

// Rounded terminals echo the soft pixel corners, and it stays legible at
// paragraph size. Covers æ ø å.
const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-rounded",
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
      <body className={`${display.variable} ${rounded.variable}`}>
        {/*
          Marks the document as reveal-capable before first paint. The scroll
          reveal styles are scoped to this class, so with JS disabled nothing
          is ever hidden, which is why it cannot be rendered on the server.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-reveal')",
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
