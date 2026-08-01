import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { getPublished } from "@/lib/cms/content";
import { toArticle } from "@/lib/cms/adapters";

const CATS = [
  "Todo",
  "Cultura joven",
  "Música",
  "Moda",
  "Tecnología",
  "Educación",
  "Sociedad",
  "Entretenimiento",
  "Emprendimiento",
  "Ciudad",
];

export const metadata = { title: "Actualidad — PAT" };
// Lee del CMS en cada visita: lo que se publica en /admin aparece
// aquí sin rebuild.
export const dynamic = "force-dynamic";

export default function Actualidad() {
  const grid = getPublished("noticia")
    .filter((c) => c.section !== "Mente Real")
    .map(toArticle);

  if (grid.length === 0) {
    return (
      <>
        <section className="sec dark">
          <div className="wrap">
            <h2 className="display">Actualidad</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Todavía no hay piezas publicadas en esta sección.
            </p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="sec dark" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Portal editorial</span>
              <h2 className="display">Actualidad</h2>
            </div>
          </div>
          <div className="mr-cats" style={{ marginBottom: 0 }}>
            {CATS.map((c, i) => (
              <button
                className={`mr-cat ${i === 0 ? "on" : ""}`}
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
        </div>
      </section>
      <section className="sec dark" style={{ paddingTop: 26 }}>
        <div className="wrap">
          <div className="ed-grid">
            <Card a={grid[0]} lead />
            {grid.slice(1).map((a, i) => (
              <Card a={a} key={`${a.id}-${i}`} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
