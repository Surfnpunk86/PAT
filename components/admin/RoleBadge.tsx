import { ROLE_LABEL, type Role } from "@/lib/cms/types";

const CLASS: Record<Role, string> = {
  super_admin: "adm-role-super_admin",
  editor_jefe: "adm-role-editor_jefe",
  editor_seccion: "adm-role-editor_seccion",
  corresponsal: "adm-role-corresponsal",
  social_media: "adm-role-community",
  auditor_legal: "adm-role-auditor",
};

export default function RoleBadge({ role }: { role: Role }) {
  return <span className={`adm-role-badge ${CLASS[role]}`}>{ROLE_LABEL[role]}</span>;
}
