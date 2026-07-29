import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { ARTS } from "@/lib/data";

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

export default function Actualidad() {
  // El prototipo repite artículos para llenar el índice de muestra.
  const grid = [ARTS[0], ...ARTS.slice(1), ...ARTS.slice(0, 3)];
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
