import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import StatusPill from "@/components/admin/StatusPill";
import { currentUser } from "@/lib/cms/auth";
import { listContent } from "@/lib/cms/content";
import { readDB } from "@/lib/cms/store";
import { can } from "@/lib/cms/rbac";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — PAT Admin" };

export default function AdminDashboard() {
  const user = currentUser()!;
  const all = listContent();
  const mine = user.role === "corresponsal" ? all.filter((c) => c.authorId === user.id) : all;

  const pendientes = all.filter((c) => c.status === "en_revision");
  const hoy = new Date().toDateString();
  const publicadosHoy = all.filter((c) => c.status === "publicado" && c.publishedAt && new Date(c.publishedAt).toDateString() === hoy);
  const programados = all.filter((c) => c.status === "programado");
  const borradores = mine.filter((c) => c.status === "borrador");

  const db = readDB();
  const recentLog = db.auditLog.slice(0, 12);

  return (
    <AdminShell user={user} title="Dashboard" breadcrumb="Panel editorial">
      <div className="adm-grid-stats">
        <div className="adm-stat-card accent">
          <div className="num">{pendientes.length}</div>
          <div className="lbl">Piezas pendientes de revisión</div>
        </div>
        <div className="adm-stat-card">
          <div className="num">{publicadosHoy.length}</div>
          <div className="lbl">Publicadas hoy</div>
        </div>
        <div className="adm-stat-card">
          <div className="num">{programados.length}</div>
          <div className="lbl">Programadas</div>
        </div>
        <div className="adm-stat-card">
          <div className="num">{borradores.length}</div>
          <div className="lbl">{user.role === "corresponsal" ? "Tus borradores" : "Borradores"}</div>
        </div>
      </div>

      {user.role === "corresponsal" && (
        <div className="adm-flow-note">
          Estás viendo tu propio panel de corresponsal. Puedes crear borradores y enviarlos a
          revisión — la publicación la decide tu editor de sección.
        </div>
      )}

      <div className="adm-panel">
        <h3>Pendientes de revisión</h3>
        {pendientes.length === 0 ? (
          <p className="adm-empty">No hay nada esperando revisión ahora mismo.</p>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Título</th>
                <th>Sección</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pendientes.slice(0, 8).map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.section}</td>
                  <td>{c.city || "—"}</td>
                  <td><StatusPill status={c.status} /></td>
                  <td>
                    <Link href={`/admin/contenidos/${c.id}`} className="btn btn-sm">
                      Revisar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {can(user.role, "ver_analiticas") && (
        <div className="adm-panel">
          <h3>Actividad reciente</h3>
          {recentLog.length === 0 ? (
            <p className="adm-empty">Sin actividad todavía.</p>
          ) : (
            recentLog.map((l) => (
              <div className="adm-log-item" key={l.id}>
                <span className="ts">{new Date(l.createdAt).toLocaleString("es-CO")}</span>
                <span>
                  <strong>{l.actorName}</strong> — {actionLabel(l.action)}
                  {l.meta ? <span style={{ color: "var(--gray)" }}> ({l.meta})</span> : null}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </AdminShell>
  );
}

function actionLabel(action: string): string {
  const map: Record<string, string> = {
    create: "creó una pieza",
    update: "editó una pieza",
    submit_review: "envió a revisión",
    approve: "aprobó una pieza",
    reject: "rechazó una pieza",
    return_to_draft: "volvió una pieza a borrador",
    publish: "publicó una pieza",
    schedule: "programó una publicación",
    archive: "archivó una pieza",
    revert: "revirtió una versión",
    auto_publish: "publicación automática por programación",
    login: "inició sesión",
    invite_created: "invitó a un colaborador",
    invite_accepted: "activó su cuenta",
    update_role: "cambió un rol",
    update_status: "cambió el estado de un usuario",
    force_logout: "forzó el cierre de sesión de un usuario",
    seed: "inicializó la base de datos",
  };
  return map[action] || action;
}
