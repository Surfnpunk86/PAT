import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import StatusPill from "@/components/admin/StatusPill";
import ContentForm from "@/components/admin/ContentForm";
import { currentUser } from "@/lib/cms/auth";
import { getContentById, getVersions } from "@/lib/cms/content";
import { readDB } from "@/lib/cms/store";
import { can } from "@/lib/cms/rbac";
import {
  submitForReviewAction,
  approveAction,
  rejectAction,
  returnToDraftAction,
  publishAction,
  scheduleAction,
  archiveAction,
  revertVersionAction,
} from "@/lib/cms/actions";

export const dynamic = "force-dynamic";

export default function ContenidoDetallePage({ params }: { params: { id: string } }) {
  const user = currentUser()!;
  const item = getContentById(params.id);
  if (!item) notFound();

  const db = readDB();
  const author = db.users.find((u) => u.id === item.authorId);
  const versions = getVersions(item.id);

  const ctx = { isOwn: item.authorId === user.id, sameSection: !!user.section && user.section === item.section };
  const canEdit = can(user.role, "editar", ctx);
  const canPublishHere = can(user.role, "publicar", ctx);
  const canProgram = can(user.role, "programar");
  const canArchive = can(user.role, "despublicar", ctx);
  const canSubmit = item.authorId === user.id || canEdit;

  const previewHref =
    item.type === "creador" ? `/talento/${item.slug}` : item.type === "noticia" ? `/articulo/${item.slug}` : null;

  return (
    <AdminShell user={user} title={item.title} breadcrumb={`Contenidos / ${item.section}`}>
      <div className="adm-toolbar">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <StatusPill status={item.status} />
          <span className="hint">
            Autor: <strong>{author?.name || "—"}</strong> · Actualizado{" "}
            {new Date(item.updatedAt).toLocaleString("es-CO")}
          </span>
        </div>
        <div className="adm-btn-row">
          {previewHref && (
            <Link href={previewHref} target="_blank" className="btn">
              Vista previa en el portal ↗
            </Link>
          )}
          <Link href="/admin/contenidos" className="btn btn-ghost">
            ← Volver al listado
          </Link>
        </div>
      </div>

      {item.status === "rechazado" && item.rejectReason && (
        <div className="adm-flow-note" style={{ background: "#f8d7da", borderColor: "var(--red)", color: "#721c24" }}>
          <strong>Motivo del rechazo:</strong> {item.rejectReason}
        </div>
      )}
      {item.status === "programado" && item.scheduledAt && (
        <div className="adm-flow-note">
          Programado para publicarse el {new Date(item.scheduledAt).toLocaleString("es-CO")}.
        </div>
      )}

      {/* ---------- Acciones de workflow (sección 3) ---------- */}
      <div className="adm-panel">
        <h3>Flujo editorial</h3>
        <div className="adm-btn-row">
          {item.status === "borrador" && canSubmit && (
            <form action={submitForReviewAction.bind(null, item.id)}>
              <button className="btn btn-primary" type="submit">
                Enviar a revisión
              </button>
            </form>
          )}

          {item.status === "en_revision" && canPublishHere && (
            <>
              <form action={approveAction.bind(null, item.id)}>
                <button className="btn btn-yellow" type="submit">
                  Aprobar
                </button>
              </form>
              <RejectForm id={item.id} />
            </>
          )}

          {item.status === "rechazado" && item.authorId === user.id && (
            <form action={returnToDraftAction.bind(null, item.id)}>
              <button className="btn" type="submit">
                Volver a borrador y corregir
              </button>
            </form>
          )}

          {item.status === "aprobado" && canPublishHere && (
            <form action={publishAction.bind(null, item.id)}>
              <button className="btn btn-primary" type="submit">
                Publicar ahora
              </button>
            </form>
          )}
          {item.status === "aprobado" && canProgram && <ScheduleForm id={item.id} />}

          {(item.status === "publicado" || item.status === "programado") && canArchive && (
            <ArchiveForm id={item.id} />
          )}

          {item.status === "archivado" && (
            <span className="hint">Archivado. El histórico se conserva — no se elimina.</span>
          )}
        </div>
        {!canEdit && item.status === "en_revision" && item.authorId === user.id && (
          <p className="hint" style={{ marginTop: 10 }}>
            Está en revisión — queda bloqueado para tu edición hasta que el editor decida.
          </p>
        )}
      </div>

      {/* ---------- Formulario de edición ---------- */}
      <div className="adm-panel">
        <h3>Contenido</h3>
        <ContentForm
          mode="edit"
          item={item}
          sections={db.settings.sections}
          cities={db.settings.cities}
          disabled={!canEdit}
        />
      </div>

      {/* ---------- Versionado (sección 5.2) ---------- */}
      <div className="adm-panel">
        <h3>Historial de versiones</h3>
        {versions.length === 0 ? (
          <p className="adm-empty">Todavía no hay ediciones guardadas sobre este contenido.</p>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Versión</th>
                <th>Título en ese momento</th>
                <th>Editado por</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id}>
                  <td>#{v.versionNumber}</td>
                  <td>{v.snapshot.title}</td>
                  <td>{db.users.find((u) => u.id === v.editedBy)?.name || "—"}</td>
                  <td>{new Date(v.createdAt).toLocaleString("es-CO")}</td>
                  <td>
                    {canEdit && (
                      <form action={revertVersionAction.bind(null, item.id, v.id)}>
                        <button className="btn btn-sm" type="submit">
                          Revertir a esta versión
                        </button>
                      </form>
                    )}
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

function RejectForm({ id }: { id: string }) {
  return (
    <form action={rejectAction.bind(null, id)} style={{ display: "flex", gap: 6 }}>
      <input name="reason" placeholder="Motivo del rechazo…" required style={{ minWidth: 220 }} />
      <button className="btn btn-danger" type="submit">
        Rechazar
      </button>
    </form>
  );
}

function ScheduleForm({ id }: { id: string }) {
  return (
    <form action={scheduleAction.bind(null, id)} style={{ display: "flex", gap: 6 }}>
      <input name="scheduledAt" type="datetime-local" required />
      <button className="btn" type="submit">
        Programar
      </button>
    </form>
  );
}

function ArchiveForm({ id }: { id: string }) {
  return (
    <form action={archiveAction.bind(null, id)} style={{ display: "flex", gap: 6 }}>
      <input name="reason" placeholder="Motivo (opcional)…" />
      <button className="btn btn-danger" type="submit">
        Archivar / dar de baja
      </button>
    </form>
  );
}
