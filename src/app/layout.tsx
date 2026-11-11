import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Backdrop from "@/components/Backdrop";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: profile.name,
  description: `${profile.name}. ${profile.role}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="min-h-screen">
        <Backdrop />

        {/* No z-index here: it would isolate the hero name's blend from the fluid canvas. */}
        <div className="relative flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only bg-ink px-5 py-3 text-wall focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
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
