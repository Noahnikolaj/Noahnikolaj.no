import type { Metadata } from "next";
import { Lemon, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Noah's existing display face. Bosett's own logo is a chunky rounded slab,
// so this is already his voice rather than an imported one.
const lemon = Lemon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lemon",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <body className={`${lemon.variable} ${rounded.variable}`}>
        {/*
          Marks the document as reveal-capable before first paint. The scroll
          reveal styles are scoped to this class, so with JS disabled nothing
          is ever hidden.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-reveal')",
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
