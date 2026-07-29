import { TICKER } from "@/lib/data";

// Elemento firma de PAT: la traducción literal de "People Are Talking".
// Se pausa en hover (CSS :hover) y respeta prefers-reduced-motion
// (ver globals.css). No convertir en carrusel — ver README sección 4.
export default function Ticker({ inv = false }: { inv?: boolean }) {
  const group = (
    <div className="ticker-grp">
      {TICKER.map(([t, c], i) => (
        <span className="ticker-item" key={i}>
          <em>{c}</em>
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`ticker ${inv ? "inv" : ""}`} aria-hidden="true">
      <div className="ticker-track">
        {group}
        {group}
      </div>
    </div>
  );
}
