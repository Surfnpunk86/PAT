// Placeholder editorial duotono. Reemplazar por fotografía real.
// Ver README sección 7 — "Fotografía": no es la solución final.
export default function Placeholder({
  v,
  tag,
  className = "",
}: {
  v: number;
  tag: string;
  className?: string;
}) {
  return (
    <div
      className={`ph ${className}`}
      data-v={String(v)}
      role="img"
      aria-label={tag}
    >
      <span className="ph-tag">{tag}</span>
    </div>
  );
}
