import Link from "next/link";
import Placeholder from "./Placeholder";
import type { Article } from "@/lib/data";

// El grid de Actualidad es asimétrico a propósito: una pieza grande
// (lead) + secundarias. No normalizar a tres columnas iguales.
export default function Card({ a, lead = false }: { a: Article; lead?: boolean }) {
  return (
    <Link href={`/articulo/${a.id}`} className={`card ${lead ? "card-lead" : ""}`}>
      <Placeholder v={a.v} tag="Fotografía editorial" />
      <div className="card-b">
        <span className="card-cat">{a.cat}</span>
        <h3>{a.t}</h3>
        {lead && (
          <p className="lede" style={{ fontSize: 15 }}>
            {a.s}
          </p>
        )}
        <div className="card-ft">
          <span className="meta">{a.r} min lectura</span>
          <span className="meta">{a.d}</span>
        </div>
      </div>
    </Link>
  );
}
