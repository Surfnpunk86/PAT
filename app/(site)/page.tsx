import Link from "next/link";
import Ticker from "@/components/Ticker";
import Card from "@/components/Card";
import TalCard from "@/components/TalCard";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import JoinForm from "@/components/JoinForm";
import { MR_CATS } from "@/lib/data";
import { getPublished } from "@/lib/cms/content";
import { toArticle, toTalent } from "@/lib/cms/adapters";

export const dynamic = "force-dynamic";

export default function Home() {
  const ARTS = getPublished("noticia")
    .filter((c) => c.section !== "Mente Real")
    .map(toArticle);
  const TAL = getPublished("creador").map(toTalent);

  return (
    <>
      <section className="hero">
        <div className="hero-in">
          <div>
            <span className="eyebrow" style={{ color: "var(--pat-yellow)", display: "block", marginBottom: 16 }}>
              People Are Talking
            </span>
            <h1 className="display">
              Todo lo que está pasando, <span className="hl">se está hablando aquí.</span>
            </h1>
            <p className="lede">
              PAT es el punto de encuentro para jóvenes que quieren informarse,
              crear, comprar, descubrir, expresarse y sentirse acompañados.
            </p>
            <div className="hero-cta">
              <Link href="/tendencias" className="btn btn-y">
                Explorar tendencias
              </Link>
              <Link href="/mente-real/chat" className="btn btn-o">
                Hablar con PAT IA
              </Link>
              <Link href="/comunidad" className="btn btn-o">
                Unirme
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Placeholder v={1} tag="Hero — jóvenes urbanos colombianos" />
            <div className="hero-badge">
              <span className="eyebrow">Ahora en PAT</span>
              8 creadores representados moviendo la conversación
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="sec dark">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Hoy en PAT</span>
              <h2>Lo que importa ahora</h2>
            </div>
            <Link href="/actualidad" className="btn btn-o btn-sm">
              Ver todo
            </Link>
          </div>
          <div className="ed-grid">
            {ARTS[0] && <Card a={ARTS[0]} lead />}
            {ARTS.slice(1, 5).map((a) => (
              <Card a={a} key={a.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Talento PAT</span>
              <h2>Las voces que representamos</h2>
            </div>
            <Link href="/talento" className="btn btn-y btn-sm">
              Ver todo el talento
            </Link>
          </div>
          <div className="rail">
            {TAL.map((t) => (
              <TalCard t={t} key={t.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec mr">
        <div className="wrap">
          <div className="sec-hd mr-hd">
            <div>
              <span className="eyebrow" style={{ color: "var(--mr-accent)" }}>
                Mente Real
              </span>
              <h2 className="display">
                Un espacio para hablar de lo que muchos sienten y pocos dicen.
              </h2>
            </div>
          </div>
          <div className="ia-blk">
            <div>
              <h3>PAT IA · 24/7</h3>
              <p>
                Habla cuando lo necesites. PAT IA está disponible para
                escucharte, ayudarte a ordenar lo que sientes y orientarte
                hacia recursos seguros. No es psicólogo y no reemplaza
                atención profesional — es el primer paso hacia alguien que sí
                puede acompañarte.
              </p>
            </div>
            <div className="ia-acts">
              <Link
                href="/mente-real/chat"
                className="btn btn-w"
                style={{ background: "#fff", color: "var(--mr-deep)", justifyContent: "center" }}
              >
                Iniciar conversación
              </Link>
              <Link href="/ayuda" className="btn btn-o" style={{ justifyContent: "center" }}>
                Ver recursos de ayuda
              </Link>
            </div>
          </div>
          <div className="mr-cats" style={{ marginTop: 24 }}>
            {MR_CATS.map((c) => (
              <Link href="/mente-real" className="mr-cat" key={c}>
                {c}
              </Link>
            ))}
          </div>
          <Link href="/mente-real" className="btn btn-mr">
            Entrar a Mente Real
          </Link>
        </div>
      </section>

      <Ticker inv />

      <section className="sec dark">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Marcas en PAT</span>
              <h2>Conecta con una audiencia joven y culturalmente relevante</h2>
            </div>
            <Link href="/marcas" className="btn btn-y btn-sm">
              Trabajemos juntos
            </Link>
          </div>
          <div className="svc-grid">
            {[
              ["Representación de talento", "El roster PAT, con contrato y gestión."],
              ["Branded content", "Contenido editorial, no publicidad disfrazada."],
              ["Publicidad nativa", "Formatos que la audiencia no salta."],
              ["Patrocinio de sección", "Tu marca vive donde vive la conversación."],
              ["Activaciones", "Presencia física con creadores."],
              ["Retos y concursos", "PAT Challenges con tu mecánica."],
            ].map(([t, d]) => (
              <div className="svc" key={t}>
                <div style={{ fontSize: 15 }}>{t}</div>
                <p style={{ fontSize: 12.5, color: "#8A8A85", fontWeight: 400, lineHeight: 1.45 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec join">
        <div className="wrap">
          <div className="join-in">
            <div>
              <h2 className="display">Únete a la comunidad PAT</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: "38ch" }}>
                Recibe tendencias, descuentos, convocatorias, planes y
                contenidos creados para lo que estás viviendo ahora.
              </p>
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
