"use client";

import { useFormState, useFormStatus } from "react-dom";
import { acceptInviteAction } from "@/lib/cms/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Activando…" : "Activar mi cuenta"}
    </button>
  );
}

export default function AcceptInviteForm({ token }: { token: string }) {
  const action = acceptInviteAction.bind(null, token);
  const [state, formAction] = useFormState(action, undefined);
  return (
    <form action={formAction} className="adm-form-grid">
      <div className="adm-field full">
        <label htmlFor="name">Nombre completo</label>
        <input id="name" name="name" required />
      </div>
      <div className="adm-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required minLength={8} />
      </div>
      <div className="adm-field">
        <label htmlFor="password2">Repite la contraseña</label>
        <input id="password2" name="password2" type="password" required minLength={8} />
      </div>
      <div className="adm-field full">
        <label htmlFor="university">
          Universidad / medio de origen <span className="hint">(opcional)</span>
        </label>
        <input id="university" name="university" />
      </div>
      <div className="adm-field full">
        <label htmlFor="bio">
          Bio corta <span className="hint">(se muestra públicamente como tu firma)</span>
        </label>
        <textarea id="bio" name="bio" rows={3} />
      </div>
      <div className="adm-field full">
        <label htmlFor="socials">
          Redes sociales <span className="hint">(opcional)</span>
        </label>
        <input id="socials" name="socials" placeholder="@tuusuario" />
      </div>
      {state?.error && (
        <p className="full" style={{ color: "var(--red)", fontSize: 13 }}>
          {state.error}
        </p>
      )}
      <div className="full">
        <SubmitBtn />
      </div>
    </form>
  );
}
