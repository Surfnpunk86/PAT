import Link from "next/link";
import TalCard from "@/components/TalCard";
import Footer from "@/components/Footer";
import { TAL } from "@/lib/data";

export const metadata = { title: "Talento — PAT" };

const CATS = ["Todos", "Moda", "Música", "Bienestar", "Humor", "Tecnología", "Arte", "Deporte", "Emprendimiento"];

export default function Talento() {
  return (
    <>
      <section className="sec dark">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">El activo de PAT</span>
              <h2 className="display">Talento</h2>
              <p className="lede" style={{ marginTop: 14, maxWidth: "52ch" }}>
                Creadores representados por PAT. Cada uno con audiencia
                propia, voz propia y una relación real con la gente que lo
                sigue.
              </p>
            </div>
            <Link href="/marcas" className="btn btn-y btn-sm">
              Contratar talento
            </Link>
          </div>
          <div className="mr-cats">
            {CATS.map((c, i) => (
              <button
                className="mr-cat"
                key={c}
                style={{
                  background: i === 0 ? "var(--pat-yellow)" : "transparent",
                  color: i === 0 ? "var(--pat-black)" : "#B8B8B4",
                  borderColor: i === 0 ? "var(--pat-yellow)" : "var(--pat-line-dark)",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="tal-grid">
            {TAL.map((t) => (
              <TalCard t={t} key={t.id} />
            ))}
          </div>
          <p className="meta" style={{ marginTop: 26 }}>
            Nombres y cifras ficticios para demostración. Reemplazar por el
            roster real de PAT.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
