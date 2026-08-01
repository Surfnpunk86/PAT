import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Fab from "@/components/Fab";

// Chrome del portal público (header sticky, FAB de PAT IA, nav
// inferior mobile). Vive aquí y no en app/layout.tsx a propósito:
// el panel /admin (fuera de este grupo de rutas) es una
// herramienta interna con su propia interfaz, no una página del
// portal — no debe llevar este header ni esta navegación.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="app">{children}</main>
      <Fab />
      <MobileNav />
    </>
  );
}
