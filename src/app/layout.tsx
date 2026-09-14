import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import Backdrop from "@/components/Backdrop";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";
import "./globals.css";

/**
 * Two families, deliberately unalike. Bricolage is engineered and slightly
 * irregular; Instrument is tidy and quiet. The tension between them is the
 * point — soft glass everywhere else, hard letterforms on top.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.headline.join(" ")}`,
  description: profile.lede,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable}`}>
      <body className="min-h-screen">
        <Backdrop />

        {/*
          Deliberately `relative` with NO z-index. The handoff suggests z-10
          here, but any z-index creates a stacking context, and a stacking
          context isolates blending — which would stop the hero headline's
          mix-blend-mode from seeing the fluid canvas underneath it. Plain
          `relative` (z-index: auto) still paints above the fixed z-0 backdrop
          by DOM order, and leaves blending intact.
        */}
        <div className="relative flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only glass-3 sq-full absolute left-4 top-4 z-[60] px-5 py-3"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
