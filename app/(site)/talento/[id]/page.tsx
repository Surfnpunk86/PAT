import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { getContentBySlug, getPublished } from "@/lib/cms/content";
import { toTalent, toArticle } from "@/lib/cms/adapters";
import { currentUser } from "@/lib/cms/auth";
import { STATUS_LABEL } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export default function TalentoPerfil({ params }: { params: { id: string } }) {
  const item = getContentBySlug("creador", params.id);
  const viewer = currentUser();
  if (!item || (item.status !== "publicado" && !viewer)) notFound();

  const t = toTalent(item);
  const destacados = getPublished("noticia").slice(0, 3).map(toArticle);

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
                {item.body}
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

          {destacados.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
