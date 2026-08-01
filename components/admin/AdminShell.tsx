import Link from "next/link";
import type { User } from "@/lib/cms/types";
import { can } from "@/lib/cms/rbac";
import RoleBadge from "./RoleBadge";
import { logoutAction } from "@/lib/cms/actions";

const NAV: { href: string; label: string; icon: string; gate?: (u: User) => boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/contenidos", label: "Contenidos", icon: "▤" },
  { href: "/admin/calendario", label: "Calendario editorial", icon: "▥" },
  { href: "/admin/medios", label: "Biblioteca de medios", icon: "▧" },
  {
    href: "/admin/usuarios",
    label: "Usuarios y roles",
    icon: "▩",
    gate: (u) => can(u.role, "gestionar_usuarios"),
  },
  { href: "/admin/analiticas", label: "Analíticas", icon: "▨", gate: (u) => can(u.role, "ver_analiticas") },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    icon: "◫",
    gate: (u) => u.role === "super_admin" || u.role === "editor_jefe",
  },
];

export default function AdminShell({
  user,
  title,
  breadcrumb,
  children,
}: {
  user: User;
  title: string;
  breadcrumb?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="adm">
      <div className="adm-app">
        <aside className="adm-sidebar">
          <div className="adm-brand">
            <span className="mark">P</span>
            <div>
              <div className="name">PAT Admin</div>
              <div className="sub">Panel editorial</div>
            </div>
          </div>
          <nav className="adm-navlist">
            {NAV.filter((n) => !n.gate || n.gate(user)).map((n) => (
              <Link key={n.href} href={n.href} className="adm-navitem">
                <span className="ico">{n.icon}</span>
                <span className="label">{n.label}</span>
              </Link>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <p className="hint">
              Conectado como
              <br />
              <strong style={{ color: "#faf9f6" }}>{user.name}</strong>
            </p>
            <form action={logoutAction} style={{ marginTop: 10 }}>
              <button className="btn btn-sm" type="submit" style={{ width: "100%" }}>
                Cerrar sesión
              </button>
            </form>
          </div>
        </aside>
        <div className="adm-main">
          <header className="adm-topbar">
            <div>
              {breadcrumb && <div className="adm-breadcrumb">{breadcrumb}</div>}
              <h1>{title}</h1>
            </div>
            <div className="adm-user-switcher">
              <RoleBadge role={user.role} />
              {user.city && <span className="meta" style={{ fontFamily: "inherit" }}>· {user.city}</span>}
            </div>
          </header>
          <main className="adm-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
