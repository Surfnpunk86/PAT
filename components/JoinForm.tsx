"use client";

import { useState } from "react";
import Link from "next/link";

// Age gate — Ley 1581 de 2012 (habeas data con menores).
// Ver README sección 6:
// - < 18 años -> aparece el bloque de autorización de acudiente.
// - El flujo del menor NO puede terminar en un registro activo
//   sin esa autorización.
// - El checkbox de autorización va SIN premarcar. No "mejorarlo".
// - GA4 / Meta Pixel / TikTok Pixel se cargan después del
//   consentimiento, no antes (implementar donde se integren).
export default function JoinForm() {
  const [age, setAge] = useState<string>("");
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const ageNum = parseInt(age, 10);
  const isMinor = !!ageNum && ageNum < 18;

  function handleSubmit() {
    if (!authorized) {
      alert("Necesitamos tu autorización para tratar tus datos.");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="form" id="joinform">
      <div className="fld">
        <label htmlFor="f-n">Nombre</label>
        <input id="f-n" placeholder="Tu nombre" />
      </div>
      <div className="fld">
        <label htmlFor="f-c">Correo</label>
        <input id="f-c" type="email" placeholder="tu@correo.com" />
      </div>
      <div className="fld">
        <label htmlFor="f-ci">Ciudad</label>
        <input id="f-ci" placeholder="Barranquilla" />
      </div>
      <div className="fld">
        <label htmlFor="f-e">Edad</label>
        <input
          id="f-e"
          type="number"
          min={13}
          max={99}
          placeholder="18"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="fld full">
        <label htmlFor="f-i">¿Qué te interesa?</label>
        <select id="f-i" defaultValue="Selecciona">
          <option>Selecciona</option>
          <option>Cultura y música</option>
          <option>Moda y estilo</option>
          <option>Bienestar</option>
          <option>Emprendimiento</option>
          <option>Tecnología</option>
          <option>Planes y ciudad</option>
        </select>
      </div>
      <div className={`minor ${isMinor ? "on" : ""}`} id="minor">
        <b>Necesitamos autorización de tu papá, mamá o acudiente</b>
        Como eres menor de 18, la ley colombiana (Ley 1581 de 2012) nos exige
        la autorización de un adulto responsable antes de tratar tus datos.
        Te enviamos un correo para que lo autorice. Mientras tanto, puedes
        navegar todo PAT sin registrarte — y Mente Real está abierto para ti
        siempre.
      </div>
      <div className="chk">
        <input
          type="checkbox"
          id="f-ok"
          checked={authorized}
          onChange={(e) => setAuthorized(e.target.checked)}
        />
        <label htmlFor="f-ok">
          Autorizo el tratamiento de mis datos personales según la{" "}
          <Link href="/pronto/privacidad" style={{ textDecoration: "underline" }}>
            política de privacidad
          </Link>{" "}
          de PAT.
        </label>
      </div>
      <div className="full">
        <button
          className="btn btn-k"
          style={{
            width: "100%",
            justifyContent: "center",
            background: status === "sent" ? "var(--ok)" : undefined,
            color: status === "sent" ? "#fff" : undefined,
          }}
          id="f-go"
          onClick={handleSubmit}
        >
          {status === "sent"
            ? isMinor
              ? "Enviamos el correo a tu acudiente"
              : "Listo — bienvenido a PAT"
            : "Registrarme"}
        </button>
      </div>
    </div>
  );
}
