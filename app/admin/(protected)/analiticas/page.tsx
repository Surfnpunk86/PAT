import AdminShell from "@/components/admin/AdminShell";
import { currentUser } from "@/lib/cms/auth";
import { listContent } from "@/lib/cms/content";
import { readDB } from "@/lib/cms/store";
import { can } from "@/lib/cms/rbac";
import { analyticsScope } from "@/lib/cms/rbac";
import { mockViews, mockAvgReadPct, mockShares } from "@/lib/cms/analytics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analíticas — PAT Admin" };

export default function AnaliticasPage() {
  const user = currentUser()!;

  if (!can(user.role, "ver_analiticas")) {
    return (
      <AdminShell user={user} title="Analíticas" breadcrumb="Panel editorial">
        <div className="adm-panel">
          <p>Tu rol no tiene acceso a analíticas.</p>
        </div>
      </AdminShell>
    );
  }

  const scope = analyticsScope(user.role);
  const db = readDB();
  let items = listContent({ status: "publicado" });

  if (scope === "propias") items = items.filter((c) => c.authorId === user.id);
  else if (scope === "seccion") items = items.filter((c) => c.section === user.section);

  const ranked = items
    .map((c) => ({ c, views: mockViews(c), read: mockAvgReadPct(c), shares: mockShares(c) }))
    .sort((a, b) => b.views - a.views);

  const byAuthor = new Map<string, number>();
  for (const r of ranked) byAuthor.set(r.c.authorId, (byAuthor.get(r.c.authorId) || 0) + r.views);
  const topAuthors = Array.from(byAuthor.entries())
    .map(([id, views]) => ({ name: db.users.find((u) => u.id === id)?.name || "—", views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  return (
    <AdminShell user={user} title="Analíticas" breadcrumb="Panel editorial">
      <div className="adm-flow-note">
        Datos simulados (deterministas por pieza) — no hay tracking real conectado todavía. Ver
        lib/cms/analytics.ts. El reemplazo natural es una tabla de eventos real en Postgres o un
        proveedor tipo Plausible.
        {scope === "propias" && " Estás viendo solo tus propias piezas."}
        {scope === "seccion" && ` Estás viendo solo la sección "${user.section}".`}
        {scope === "engagement" && " Tu rol ve métricas de engagement para republicación en redes."}
      </div>

      <div className="adm-panel">
        <h3>Contenido más visto</h3>
        <table className="data">
          <thead>
            <tr>
              <th>Título</th>
              <th>Sección</th>
              <th>Vistas</th>
              <th>% lectura promedio</th>
              <th>Compartidos</th>
            </tr>
          </thead>
          <tbody>
            {ranked.slice(0, 15).map(({ c, views, read, shares }) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.section}</td>
                <td>{views.toLocaleString("es-CO")}</td>
                <td>{read}%</td>
                <td>{shares}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(scope === true || scope === "seccion") && (
        <div className="adm-panel">
          <h3>Autores con más alcance</h3>
          {topAuthors.map((a) => (
            <div className="adm-log-item" key={a.name}>
              <span>{a.name}</span>
              <span className="ts">{a.views.toLocaleString("es-CO")} vistas</span>
            </div>
          ))}
          <p className="hint" style={{ marginTop: 10 }}>
            Dato pensado para negociar con corresponsales según desempeño (sección 8 del documento).
          </p>
        </div>
      )}
    </AdminShell>
  );
}
