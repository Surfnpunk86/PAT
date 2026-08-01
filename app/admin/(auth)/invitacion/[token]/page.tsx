import { notFound } from "next/navigation";
import "../../../admin.css";
import AcceptInviteForm from "@/components/admin/AcceptInviteForm";
import { getInviteToken } from "@/lib/cms/actions";
import { ROLE_LABEL } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export default async function AcceptInvitePage({ params }: { params: { token: string } }) {
  const invite = await getInviteToken(params.token);
  if (!invite) notFound();

  const expired = new Date(invite.expiresAt).getTime() < Date.now();

  return (
    <div className="adm" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="adm-panel" style={{ width: 460, maxWidth: "100%" }}>
        <div className="adm-brand" style={{ borderBottom: "none", padding: 0, marginBottom: 18 }}>
          <span className="mark" style={{ background: "#0d0d0d", color: "#f5c518" }}>P</span>
          <div>
            <div className="name" style={{ color: "#0d0d0d" }}>Únete al equipo editorial de PAT</div>
            <div className="sub" style={{ color: "#6b6b6b" }}>
              Invitación para {invite.email} · {ROLE_LABEL[invite.role]}
              {invite.city ? ` · ${invite.city}` : ""}
            </div>
          </div>
        </div>
        {invite.acceptedAt ? (
          <p style={{ fontSize: 13 }}>Esta invitación ya fue usada. Si es tu cuenta, inicia sesión.</p>
        ) : expired ? (
          <p style={{ fontSize: 13, color: "var(--red)" }}>
            Esta invitación expiró. Pídele a tu editor que te envíe una nueva.
          </p>
        ) : (
          <AcceptInviteForm token={params.token} />
        )}
      </div>
    </div>
  );
}
