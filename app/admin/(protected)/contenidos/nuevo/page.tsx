import AdminShell from "@/components/admin/AdminShell";
import ContentForm from "@/components/admin/ContentForm";
import { currentUser } from "@/lib/cms/auth";
import { readDB } from "@/lib/cms/store";
import { can } from "@/lib/cms/rbac";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nuevo contenido — PAT Admin" };

export default function NuevoContenidoPage() {
  const user = currentUser()!;
  const db = readDB();

  if (!can(user.role, "crear")) {
    return (
      <AdminShell user={user} title="Nuevo contenido" breadcrumb="Contenidos">
        <div className="adm-panel">
          <p>Tu rol ({user.role}) no puede crear contenido en PAT.</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell user={user} title="Nuevo contenido" breadcrumb="Contenidos / Nuevo">
      <div className="adm-flow-note">
        Se guarda como <strong>Borrador</strong>. Desde ahí lo envías a revisión cuando esté listo.
      </div>
      <div className="adm-panel">
        <ContentForm mode="create" sections={db.settings.sections} cities={db.settings.cities} />
      </div>
    </AdminShell>
  );
}
