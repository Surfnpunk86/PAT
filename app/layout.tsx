import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Fab from "@/components/Fab";

export const metadata: Metadata = {
  title: "PAT — People Are Talking",
  description:
    "PAT es el punto de encuentro para jóvenes que quieren informarse, crear, comprar, descubrir, expresarse y sentirse acompañados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main id="app">{children}</main>
        <Fab />
        <MobileNav />
      </body>
    </html>
  );
}
