import AdminShell from "@/components/admin/AdminShell";
import Placeholder from "@/components/Placeholder";
import { currentUser } from "@/lib/cms/auth";
import { listContent } from "@/lib/cms/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Biblioteca de medios — PAT Admin" };

export default function MediosPage() {
  const user = currentUser()!;
  const all = listContent();

  const variants = [1, 2, 3, 4].map((v) => ({
    v,
    count: all.filter((c) => c.featuredImageVariant === v).length,
  }));

  return (
    <AdminShell user={user} title="Biblioteca de medios" breadcrumb="Panel editorial">
      <div className="adm-flow-note">
        El portal todavía usa placeholders duotono generados en CSS en vez de fotografía real
        (ver README-HOWARD.md, sección 7 — "no son la solución final"). Cuando exista pipeline de
        subida real (Cloudinary / S3, ver sección 7 del documento de CMS), esta pantalla pasa a
        listar archivos reales con su información de derechos de uso / whitelisting, en vez de
        variantes de placeholder.
      </div>

      <div className="adm-grid-stats">
        {variants.map((item) => (
          <div className="adm-panel" key={item.v} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ aspectRatio: "16/10" }}>
              <Placeholder v={item.v} tag={`Variante ${item.v}`} />
            </div>
            <div style={{ padding: 14 }}>
              <strong>Placeholder variante {item.v}</strong>
              <p className="hint">Usado en {item.count} pieza{item.count === 1 ? "" : "s"}.</p>
              <p className="hint">Derechos de uso: pendiente — placeholder interno, no requiere whitelisting.</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
