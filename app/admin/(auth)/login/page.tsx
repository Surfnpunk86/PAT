import "../../admin.css";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Ingresar — PAT Admin" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { activada?: string };
}) {
  return (
    <div className="adm" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="adm-panel" style={{ width: 380, maxWidth: "100%" }}>
        <div className="adm-brand" style={{ borderBottom: "none", padding: 0, marginBottom: 18 }}>
          <span className="mark" style={{ background: "#0d0d0d", color: "#f5c518" }}>P</span>
          <div>
            <div className="name" style={{ color: "#0d0d0d" }}>PAT Admin</div>
            <div className="sub" style={{ color: "#6b6b6b" }}>Panel editorial</div>
          </div>
        </div>
        {searchParams?.activada && (
          <p style={{ color: "var(--green)", fontSize: 13, marginBottom: 12 }}>
            Cuenta activada. Ya puedes iniciar sesión.
          </p>
        )}
        <LoginForm />
        <p className="hint" style={{ marginTop: 16, color: "var(--gray)", fontSize: 11 }}>
          Acceso para el equipo editorial de PAT y corresponsales invitados.
          Si necesitas una cuenta, pídele una invitación a tu editor.
        </p>
      </div>
    </div>
  );
}
