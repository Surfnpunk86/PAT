import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { getContentBySlug, getPublished } from "@/lib/cms/content";
import { toArticle } from "@/lib/cms/adapters";
import { currentUser } from "@/lib/cms/auth";
import { STATUS_LABEL } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export default function Articulo({ params }: { params: { id: string } }) {
  const item = getContentBySlug("noticia", params.id);
  const viewer = currentUser();

  // Vista previa del portal real (sección 5.2 del documento de CMS):
  // un visitante anónimo solo ve contenido publicado; un miembro del
  // equipo editorial autenticado puede ver el estado real de la
  // pieza (borrador, en revisión, etc.) con un aviso visible.
  if (!item || (item.status !== "publicado" && !viewer)) notFound();

  const a = toArticle(item);
  const related = getPublished("noticia")
    .filter((c) => c.id !== item.id)
    .slice(0, 3)
    .map(toArticle);

  return (
    <>
      {viewer && item.status !== "publicado" && (
        <div
          style={{
            background: "var(--pat-yellow)",
            color: "var(--pat-black)",
            textAlign: "center",
            padding: "10px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Modo vista previa — estado real: {STATUS_LABEL[item.status]} · no visible para el público
        </div>
      )}
      <section className="art-hero">
        <div className="wrap">
          <Link href="/actualidad" className="meta">
            ← {a.cat}
          </Link>
          <h1 className="display">{a.t}</h1>
          <p className="lede" style={{ maxWidth: "60ch", marginBottom: 20 }}>
            {a.s}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span className="meta">{a.a}</span>
            <span className="meta">{a.d}</span>
            <span className="meta">{a.r} min lectura</span>
          </div>
          <div className="art-ph">
            <Placeholder v={a.v} tag="Fotografía editorial de apertura" />
          </div>
        </div>
      </section>

      <article className="art-body">
        {item.body.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="share">
          <button className="sh">WhatsApp</button>
          <button className="sh">Instagram</button>
          <button className="sh">X</button>
          <button className="sh">Facebook</button>
          <button className="sh">Copiar link</button>
        </div>
      </article>

      {related.length > 0 && (
        <section className="sec dark">
          <div className="wrap">
            <div className="sec-hd">
              <div>
                <span className="eyebrow">Sigue leyendo</span>
                <h2>Relacionados</h2>
              </div>
            </div>
            <div className="ed-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              {related.map((x) => (
                <Card a={x} key={x.id} />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
