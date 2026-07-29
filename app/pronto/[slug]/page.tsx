import Link from "next/link";
import Footer from "@/components/Footer";
import { STUBS } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(STUBS).map((slug) => ({ slug }));
}

const LEGAL = ["terminos", "privacidad", "cookies"];

// Fase 2 / stubs legales. Ver README sección 2: checkout, pasarela,
// subastas, panel administrativo, comisiones, LLM en vivo — NO
// completar por iniciativa propia. La decisión es de Renzo y
// depende de que exista operación detrás.
export default function Pronto({ params }: { params: { slug: string } }) {
  const [t, d] = STUBS[params.slug] || ["PAT", "Sección en construcción."];
  const legal = LEGAL.includes(params.slug);

  return (
    <>
      <section className="stub dark">
        <div className="stub-in">
          <span className="badge">{legal ? "Requiere abogado" : "Fase 2"}</span>
          <h1 className="display">{t}</h1>
          <p className="lede">{d}</p>
          <p className="meta" style={{ maxWidth: "38ch", lineHeight: 1.6 }}>
            {legal
              ? "Este texto no se inventa. PAT debe pasarlo por abogado antes de captar un solo registro."
              : "Pantalla reservada en la arquitectura. Se construye cuando la operación detrás exista — no antes."}
          </p>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
            <Link href="/" className="btn btn-y btn-sm">
              Volver al inicio
            </Link>
            {!legal && (
              <Link href="/comunidad" className="btn btn-o btn-sm">
                Avísame cuando abra
              </Link>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
