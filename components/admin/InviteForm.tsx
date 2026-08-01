"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { inviteUserAction } from "@/lib/cms/actions";
import { ROLE_LABEL, type Role } from "@/lib/cms/types";

const ROLES: Role[] = ["editor_seccion", "corresponsal", "social_media", "editor_jefe", "auditor_legal"];

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Enviando…" : "Generar invitación"}
    </button>
  );
}

export default function InviteForm({ sections, cities }: { sections: string[]; cities: string[] }) {
  const [state, formAction] = useFormState(inviteUserAction, undefined);
  const [copied, setCopied] = useState(false);

  return (
    <form action={formAction} className="adm-form-grid">
      <div className="adm-field">
        <label htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="adm-field">
        <label htmlFor="role">Rol</label>
        <select id="role" name="role" required defaultValue="corresponsal">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="city">Ciudad</label>
        <select id="city" name="city" defaultValue="">
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="section">Sección asignada</label>
        <select id="section" name="section" defaultValue="">
          <option value="">—</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {state?.error && (
        <p className="full" style={{ color: "var(--red)", fontSize: 13 }}>
          {state.error}
        </p>
      )}
      {state?.link && (
        <div className="full" style={{ background: "#fff8e1", padding: 10, borderRadius: 6, fontSize: 12 }}>
          <p style={{ marginBottom: 6 }}>
            Invitación creada. No hay proveedor de correo conectado todavía (ver README-CMS.md) —
            comparte este enlace manualmente:
          </p>
          <code style={{ wordBreak: "break-all" }}>{state.link}</code>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(state.link!);
                setCopied(true);
              }}
            >
              {copied ? "Copiado ✓" : "Copiar enlace"}
            </button>
          </div>
        </div>
      )}
      <div className="full">
        <SubmitBtn />
      </div>
    </form>
  );
}
