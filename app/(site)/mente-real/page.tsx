import Link from "next/link";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { MR_CATS } from "@/lib/data";
import { getPublished } from "@/lib/cms/content";

export const metadata = { title: "Mente Real — PAT" };
export const dynamic = "force-dynamic";

// Cambio de temperatura deliberado: el amarillo es urgencia y hype,
// el registro equivocado para alguien con ansiedad a las 2 a.m.
// Esta sección corre con --mr-*. Ver README sección 4.
export default function MenteReal() {
  const MR_ARTS = getPublished("noticia", "Mente Real");
  return (
    <>
      <section className="sec mr" style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--mr-accent)" }}>
            Mente Real
          </span>
          <h1 className="display" style={{ fontSize: "clamp(32px,5.4vw,68px)", marginBlock: "14px 18px", maxWidth: "16ch" }}>
            Hablemos de lo que muchos sienten y pocos dicen.
          </h1>
          <p className="mr-claim">Aquí no hay que estar bien. Aquí hay que poder decirlo.</p>
          <div className="mr-cats">
            {MR_CATS.map((c, i) => (
              <button className={`mr-cat ${i === 0 ? "on" : ""}`} key={c}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="sec mr" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="ia-blk" style={{ marginBottom: 32 }}>
            <div>
              <h3>PAT IA · 24/7</h3>
              <p>
                Habla cuando lo necesites. Estoy para escucharte, ayudarte a
                ordenar lo que sientes y orientarte hacia recursos seguros.
              </p>
            </div>
            <div className="ia-acts">
              <Link
                href="/mente-real/chat"
                className="btn"
                style={{ background: "#fff", color: "var(--mr-deep)", justifyContent: "center" }}
              >
                Iniciar conversación
              </Link>
              <Link href="/ayuda" className="btn btn-o" style={{ justifyContent: "center" }}>
                Ver recursos de ayuda
              </Link>
            </div>
          </div>
          <div className="mr-grid">
            {MR_ARTS.map((item) => (
              <Link href={`/articulo/${item.slug}`} className="mr-card" key={item.id}>
                <Placeholder v={item.featuredImageVariant} tag="Fotografía editorial" className="ph-mr" />
                <div className="mr-card-b">
                  <span className="card-cat" style={{ color: "var(--mr-deep)", opacity: 0.7 }}>
                    {item.tags[0] || item.section}
                  </span>
                  <h3 style={{ marginTop: 7 }}>{item.title}</h3>
                  <span className="meta">{item.readMinutes} min lectura</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
