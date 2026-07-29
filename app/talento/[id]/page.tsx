import Link from "next/link";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { TAL, ARTS } from "@/lib/data";

export function generateStaticParams() {
  return TAL.map((t) => ({ id: t.id }));
}

export default function TalentoPerfil({ params }: { params: { id: string } }) {
  const t = TAL.find((x) => x.id === params.id) || TAL[0];
  const destacados = ARTS.slice(1, 4);

  return (
    <>
      <section className="sec dark">
        <div className="wrap">
          <Link href="/talento" className="meta" style={{ display: "inline-block", marginBottom: 22 }}>
            ← Todo el talento
          </Link>
          <div
            className="tp"
            style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 36, alignItems: "start" }}
          >
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              <Placeholder v={t.v} tag="Retrato editorial" />
            </div>
            <div>
              <span className="eyebrow" style={{ color: "var(--pat-yellow)" }}>
                {t.c.join(" · ")}
              </span>
              <h1 className="display" style={{ fontSize: "clamp(34px,5vw,64px)", marginBlock: "12px 8px" }}>
                {t.n}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--pat-yellow)",
                  fontSize: 15,
                  marginBottom: 20,
                }}
              >
                {t.h} · {t.b}
              </p>
              <p className="lede" style={{ maxWidth: "52ch" }}>
                Creador representado por PAT. Trabaja formatos cortos y
                contenido de marca con una audiencia que lo sigue por
                criterio, no por algoritmo. Bio de muestra — reemplazar por
                la real.
              </p>
              <div style={{ display: "flex", gap: 32, marginBlock: 28, flexWrap: "wrap" }}>
                <div>
                  <div className="display" style={{ fontSize: 34, color: "var(--pat-yellow)" }}>
                    {t.r}
                  </div>
                  <span className="meta">Audiencia total</span>
                </div>
                <div>
                  <div className="display" style={{ fontSize: 34, color: "var(--pat-yellow)" }}>
                    6.4%
                  </div>
                  <span className="meta">Engagement</span>
                </div>
                <div>
                  <div className="display" style={{ fontSize: 34, color: "var(--pat-yellow)" }}>
                    18–29
                  </div>
                  <span className="meta">Rango dominante</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                <Link href="/marcas" className="btn btn-y">
                  Contratar este talento
                </Link>
                <Link href="/marcas" className="btn btn-o">
                  Ver media kit
                </Link>
              </div>
            </div>
          </div>

          <div className="sec-hd" style={{ marginTop: 56 }}>
            <div>
              <span className="eyebrow">Contenido destacado</span>
              <h2>Últimos trabajos</h2>
            </div>
          </div>
          <div className="ed-grid">
            {destacados.map((a) => (
              <Card a={a} key={a.id} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
