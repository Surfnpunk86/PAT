"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/lib/cms/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);
  return (
    <form action={formAction} className="adm-form-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div className="adm-field">
        <label htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required placeholder="admin@pat.com" />
      </div>
      <div className="adm-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required placeholder="••••••••" />
      </div>
      {state?.error && (
        <p style={{ color: "var(--red)", fontSize: 13 }}>{state.error}</p>
      )}
      <SubmitBtn />
    </form>
  );
}
