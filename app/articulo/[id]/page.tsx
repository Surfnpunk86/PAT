import Link from "next/link";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { ARTS } from "@/lib/data";

export function generateStaticParams() {
  return ARTS.map((a) => ({ id: a.id }));
}

export default function Articulo({ params }: { params: { id: string } }) {
  const a = ARTS.find((x) => x.id === params.id) || ARTS[0];
  const related = ARTS.filter((x) => x.id !== a.id).slice(0, 3);

  return (
    <>
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
        <p>
          Este es contenido de muestra. La estructura, la medida de línea y
          el ritmo tipográfico son los definitivos: 680px de ancho máximo,
          entre 65 y 75 caracteres por línea, que es donde el ojo deja de
          cansarse.
        </p>
        <p>
          El cuerpo va en Inter a 17.5 píxeles con interlineado de 1.72. No
          es un capricho: es la diferencia entre un artículo que la gente
          termina y uno que abandona en el tercer párrafo.
        </p>
        <div className="pq">
          Los pull quotes van en la display, en amarillo, y se usan poco.
          Uno o dos por pieza.
        </div>
        <h2>Los subtítulos rompen el bloque</h2>
        <p>
          Cada 300 o 400 palabras el lector necesita un respiro visual. Los
          subtítulos van en la tipografía display, en caja alta, con
          tracking negativo — el mismo lenguaje del logo.
        </p>
        <p>
          Reemplazar todo este texto por el artículo real. La plantilla ya
          está lista para recibirlo.
        </p>
        <div className="share">
          <button className="sh">WhatsApp</button>
          <button className="sh">Instagram</button>
          <button className="sh">X</button>
          <button className="sh">Facebook</button>
          <button className="sh">Copiar link</button>
        </div>
      </article>

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
      <Footer />
    </>
  );
}
