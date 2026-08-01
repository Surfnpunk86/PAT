import AdminShell from "@/components/admin/AdminShell";
import RoleBadge from "@/components/admin/RoleBadge";
import InviteForm from "@/components/admin/InviteForm";
import { currentUser } from "@/lib/cms/auth";
import { listUsers } from "@/lib/cms/users";
import { readDB } from "@/lib/cms/store";
import { can } from "@/lib/cms/rbac";
import { ROLE_LABEL, type Role, type UserStatus } from "@/lib/cms/types";
import { updateUserRoleAction, updateUserStatusAction, forceLogoutAction } from "@/lib/cms/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuarios y roles — PAT Admin" };

const ROLES: Role[] = ["super_admin", "editor_jefe", "editor_seccion", "corresponsal", "social_media", "auditor_legal"];
const STATUSES: UserStatus[] = ["activo", "suspendido", "inactivo", "eliminado"];

export default function UsuariosPage() {
  const user = currentUser()!;
  const db = readDB();

  if (!can(user.role, "gestionar_usuarios")) {
    return (
      <AdminShell user={user} title="Usuarios y roles" breadcrumb="Panel editorial">
        <div className="adm-panel">
          <p>Tu rol no tiene acceso a la gestión de usuarios.</p>
        </div>
      </AdminShell>
    );
  }

  const users = listUsers();
  const jefeLimitado = user.role === "editor_jefe"; // solo corresponsales/redactores

  return (
    <AdminShell user={user} title="Usuarios y roles" breadcrumb="Panel editorial">
      <div className="adm-panel">
        <h3>Invitar colaborador</h3>
        <p className="hint" style={{ marginBottom: 14 }}>
          Nunca se asigna contraseña manualmente. El colaborador la crea al aceptar el enlace.
        </p>
        <InviteForm sections={db.settings.sections} cities={db.settings.cities} />
      </div>

      <div className="adm-panel">
        <h3>Equipo</h3>
        <table className="data">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Ciudad</th>
              <th>Sección</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const editable = !jefeLimitado || u.role === "corresponsal";
              return (
                <tr key={u.id}>
                  <td>
                    <span className="adm-avatar">{u.name.slice(0, 1)}</span>
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {editable ? (
                      <form action={updateUserRoleAction.bind(null, u.id)}>
                        <select
                          name="role"
                          defaultValue={u.role}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABEL[r]}
                            </option>
                          ))}
                        </select>
                      </form>
                    ) : (
                      <RoleBadge role={u.role} />
                    )}
                  </td>
                  <td>{u.city || "—"}</td>
                  <td>{u.section || "—"}</td>
                  <td>
                    {editable ? (
                      <form action={updateUserStatusAction.bind(null, u.id)}>
                        <select
                          name="status"
                          defaultValue={u.status}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </form>
                    ) : (
                      u.status
                    )}
                  </td>
                  <td>
                    {user.role === "super_admin" && u.id !== user.id && (
                      <form action={forceLogoutAction.bind(null, u.id)}>
                        <button className="btn btn-sm btn-danger" type="submit">
                          Cerrar sesión remota
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
