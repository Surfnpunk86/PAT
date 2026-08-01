import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { currentUser } from "@/lib/cms/auth";
import { listContent } from "@/lib/cms/content";
import { readDB } from "@/lib/cms/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calendario editorial — PAT Admin" };

export default function CalendarioPage() {
  const user = currentUser()!;
  const db = readDB();
  const programados = listContent({ status: "programado" }).sort(
    (a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
  );
  const publicadosRecientes = listContent({ status: "publicado" }).slice(0, 10);

  const byDay = new Map<string, typeof programados>();
  for (const c of programados) {
    const day = new Date(c.scheduledAt!).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(c);
  }

  return (
    <AdminShell user={user} title="Calendario editorial" breadcrumb="Panel editorial">
      <div className="adm-flow-note">
        Vista de programación — clave para coordinar corresponsales en distintas zonas horarias
        (sección 6.4 del documento). Las piezas pasan a "Publicado" automáticamente al llegar su hora.
      </div>

      <div className="adm-panel">
        <h3>Próximas publicaciones</h3>
        {byDay.size === 0 ? (
          <p className="adm-empty">No hay nada programado. Aprueba una pieza y prográmala desde su ficha.</p>
        ) : (
          Array.from(byDay.entries()).map(([day, items]) => (
            <div className="adm-cal-day" key={day}>
              <div className="date">📅 {day}</div>
              {items.map((c) => {
                const author = db.users.find((u) => u.id === c.authorId);
                return (
                  <div className="adm-cal-item" key={c.id}>
                    <span>
                      <strong>{new Date(c.scheduledAt!).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</strong>{" "}
                      — {c.title} <span className="hint">({c.section} · {author?.name})</span>
                    </span>
                    <Link href={`/admin/contenidos/${c.id}`} className="btn btn-sm">
                      Ver
                    </Link>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="adm-panel">
        <h3>Publicado recientemente</h3>
        {publicadosRecientes.length === 0 ? (
          <p className="adm-empty">Nada publicado todavía.</p>
        ) : (
          publicadosRecientes.map((c) => (
            <div className="adm-log-item" key={c.id}>
              <span className="ts">{c.publishedAt && new Date(c.publishedAt).toLocaleDateString("es-CO")}</span>
              <span>{c.title} <span className="hint">({c.section})</span></span>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
