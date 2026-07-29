import Link from "next/link";
import Footer from "@/components/Footer";
import JoinForm from "@/components/JoinForm";
import { SVCS, PKS } from "@/lib/data";

export const metadata = { title: "Marcas — PAT" };

export default function Marcas() {
  return (
    <>
      <section className="sec dark" style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--pat-yellow)" }}>
            Marcas en PAT
          </span>
          <h1 className="display" style={{ fontSize: "clamp(32px,5.2vw,66px)", marginBlock: "14px 18px", maxWidth: "17ch" }}>
            Conecta con una audiencia joven, activa y culturalmente
            relevante.
          </h1>
          <p className="lede" style={{ maxWidth: "56ch", marginBottom: 26 }}>
            PAT representa creadores, produce contenido editorial y opera
            una plataforma donde esa audiencia ya está. No compras
            impresiones: compras conversación.
          </p>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <Link href="#comunidad" className="btn btn-y">
              Solicitar propuesta
            </Link>
            <Link href="/talento" className="btn btn-o">
              Ver el roster
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              gap: 44,
              marginTop: 44,
              flexWrap: "wrap",
              paddingTop: 32,
              borderTop: "1px solid var(--pat-line-dark)",
            }}
          >
            <div>
              <div className="display" style={{ fontSize: "clamp(34px,4vw,52px)", color: "var(--pat-yellow)" }}>
                2.5M
              </div>
              <span className="meta">Audiencia agregada del roster</span>
            </div>
            <div>
              <div className="display" style={{ fontSize: "clamp(34px,4vw,52px)", color: "var(--pat-yellow)" }}>
                15–30
              </div>
              <span className="meta">Rango de edad</span>
            </div>
            <div>
              <div className="display" style={{ fontSize: "clamp(34px,4vw,52px)", color: "var(--pat-yellow)" }}>
                8
              </div>
              <span className="meta">Creadores representados</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Qué hacemos</span>
              <h2>Servicios</h2>
            </div>
          </div>
          <div className="svc-grid">
            {SVCS.map(([t, d]) => (
              <div className="svc" key={t}>
                <div style={{ fontSize: 15 }}>{t}</div>
                <p style={{ fontSize: 12.5, color: "#8A8A85", fontWeight: 400, lineHeight: 1.45 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Paquetes</span>
              <h2>Cómo trabajamos juntos</h2>
            </div>
          </div>
          <div className="pk-grid">
            {PKS.map((p) => (
              <div className={`pk ${p.feat ? "feat" : ""}`} key={p.n}>
                {p.feat && (
                  <span
                    className="eyebrow"
                    style={{
                      color: "var(--pat-black)",
                      background: "var(--pat-yellow)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      alignSelf: "flex-start",
                    }}
                  >
                    Más elegido
                  </span>
                )}
                <h3>{p.n}</h3>
                <p style={{ fontSize: 13.5, color: "#9A9A96", lineHeight: 1.5 }}>{p.d}</p>
                <ul>
                  {p.f.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href="#comunidad"
                  className={`btn ${p.feat ? "btn-y" : "btn-o"} btn-sm`}
                  style={{ justifyContent: "center" }}
                >
                  Solicitar propuesta
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec join" id="comunidad">
        <div className="wrap">
          <div className="join-in">
            <div>
              <span className="eyebrow">Comunidad</span>
              <h2 className="display" style={{ marginTop: 12 }}>
                Únete a la comunidad PAT
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: "38ch", marginBottom: 20 }}>
                Recibe tendencias, descuentos, convocatorias, planes y
                contenidos creados para lo que estás viviendo ahora.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, fontSize: 14, fontWeight: 500 }}>
                <li>— Guarda artículos, planes y cupones</li>
                <li>— Participa en concursos</li>
                <li>— Sigue a tus marcas y creadores</li>
                <li>— Vota en los rankings</li>
                <li>— Envía tus historias</li>
              </ul>
            </div>
            <div>
              <JoinForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
