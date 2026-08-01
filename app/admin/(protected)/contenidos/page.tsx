import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import StatusPill from "@/components/admin/StatusPill";
import { currentUser } from "@/lib/cms/auth";
import { listContent } from "@/lib/cms/content";
import { readDB } from "@/lib/cms/store";
import { CONTENT_TYPE_LABEL, STATUS_LABEL, type ContentStatus, type ContentType } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contenidos — PAT Admin" };

export default function ContenidosPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; section?: string; q?: string };
}) {
  const user = currentUser()!;
  const db = readDB();

  let items = listContent({
    status: (searchParams.status as ContentStatus) || undefined,
    type: (searchParams.type as ContentType) || undefined,
    section: searchParams.section || undefined,
    q: searchParams.q || undefined,
  });

  // Alcance por rol: corresponsal solo ve lo suyo.
  if (user.role === "corresponsal") {
    items = items.filter((c) => c.authorId === user.id);
  } else if (user.role === "editor_seccion" && user.section) {
    // Ve todo, pero se resalta lo de su sección — se deja visible el resto
    // para contexto editorial (solo se restringe la ACCIÓN de publicar).
  }

  const authorName = (id: string) => db.users.find((u) => u.id === id)?.name || "—";

  return (
    <AdminShell user={user} title="Contenidos" breadcrumb="Panel editorial">
      <div className="adm-toolbar">
        <form className="adm-filters">
          <div className="fld">
            <label>Buscar</label>
            <input type="text" name="q" defaultValue={searchParams.q} placeholder="Título o resumen…" />
          </div>
          <div className="fld">
            <label>Estado</label>
            <select name="status" defaultValue={searchParams.status || ""}>
              <option value="">Todos</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Tipo</label>
            <select name="type" defaultValue={searchParams.type || ""}>
              <option value="">Todos</option>
              {Object.entries(CONTENT_TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Sección</label>
            <select name="section" defaultValue={searchParams.section || ""}>
              <option value="">Todas</option>
              {db.settings.sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-sm" type="submit">
            Filtrar
          </button>
          {(searchParams.status || searchParams.type || searchParams.section || searchParams.q) && (
            <Link href="/admin/contenidos" className="btn btn-sm btn-ghost">
              Limpiar
            </Link>
          )}
        </form>
        <Link href="/admin/contenidos/nuevo" className="btn btn-primary">
          + Nuevo contenido
        </Link>
      </div>

      <div className="adm-panel">
        {items.length === 0 ? (
          <p className="adm-empty">No hay contenido con estos filtros.</p>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Sección</th>
                <th>Ciudad</th>
                <th>Autor</th>
                <th>Estado</th>
                <th>Actualizado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td style={{ maxWidth: 280 }}>{c.title}</td>
                  <td>{CONTENT_TYPE_LABEL[c.type]}</td>
                  <td>{c.section}</td>
                  <td>{c.city || "—"}</td>
                  <td>{authorName(c.authorId)}</td>
                  <td>
                    <StatusPill status={c.status} />
                  </td>
                  <td>{new Date(c.updatedAt).toLocaleDateString("es-CO")}</td>
                  <td>
                    <Link href={`/admin/contenidos/${c.id}`} className="btn btn-sm">
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
