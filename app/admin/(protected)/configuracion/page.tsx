import AdminShell from "@/components/admin/AdminShell";
import { currentUser } from "@/lib/cms/auth";
import { readDB } from "@/lib/cms/store";
import { addSectionAction, addCityAction } from "@/lib/cms/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configuración — PAT Admin" };

export default function ConfiguracionPage() {
  const user = currentUser()!;
  const db = readDB();
  const canEdit = user.role === "super_admin" || user.role === "editor_jefe";

  return (
    <AdminShell user={user} title="Configuración" breadcrumb="Panel editorial">
      <div className="adm-panel">
        <h3>Secciones del portal</h3>
        <div className="adm-btn-row" style={{ marginBottom: canEdit ? 14 : 0 }}>
          {db.settings.sections.map((s) => (
            <span key={s} className="adm-pill adm-pill-borrador">
              {s}
            </span>
          ))}
        </div>
        {canEdit && (
          <form action={addSectionAction} style={{ display: "flex", gap: 6 }}>
            <input name="name" placeholder="Nueva sección…" required />
            <button className="btn btn-sm" type="submit">
              Agregar
            </button>
          </form>
        )}
      </div>

      <div className="adm-panel">
        <h3>Ciudades habilitadas</h3>
        <div className="adm-btn-row" style={{ marginBottom: canEdit ? 14 : 0 }}>
          {db.settings.cities.map((c) => (
            <span key={c} className="adm-pill adm-pill-borrador">
              {c}
            </span>
          ))}
        </div>
        {canEdit && (
          <form action={addCityAction} style={{ display: "flex", gap: 6 }}>
            <input name="name" placeholder="Nueva ciudad…" required />
            <button className="btn btn-sm" type="submit">
              Agregar
            </button>
          </form>
        )}
        <p className="hint" style={{ marginTop: 10 }}>
          Ciudad como campo estructurado (no texto libre) — sección 8 del documento: permite
          cruzar esta data con Territorio PAT más adelante.
        </p>
      </div>

      <div className="adm-panel">
        <h3>Plantilla de invitación</h3>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12.5, background: "#faf9f6", padding: 12, borderRadius: 8 }}>
          {db.settings.inviteEmailTemplate}
        </pre>
        <p className="hint">
          Editable directamente en lib/cms/store.ts (settings.inviteEmailTemplate) por ahora —
          conectar a un editor en pantalla es un siguiente paso menor.
        </p>
      </div>
    </AdminShell>
  );
}
