// ============================================================
// Correo transaccional — sección 7: "Resend/SendGrid para
// invitaciones, aprobaciones/rechazos y recordatorios."
//
// No hay proveedor conectado en este entorno de desarrollo. Esta
// función deja explícito el punto de integración: cuando exista
// RESEND_API_KEY en las variables de entorno de Render, reemplaza
// el console.log por la llamada real (comentada abajo) y todo el
// resto del CMS (invites.ts, content.ts) sigue funcionando sin
// cambios — ya llaman a sendMail().
// ============================================================

export async function sendMail(to: string, subject: string, body: string) {
  if (process.env.RESEND_API_KEY) {
    // await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "PAT <editorial@pat.com>",
    //     to,
    //     subject,
    //     text: body,
    //   }),
    // });
    return;
  }
  // Sin proveedor conectado: se deja constancia en consola del
  // servidor. Las páginas de /admin que generan invitaciones o
  // notificaciones también muestran el enlace/mensaje en pantalla
  // para poder copiarlo y compartirlo manualmente mientras tanto.
  console.log(`[mailer stub] Para: ${to} — Asunto: ${subject}\n${body}`);
}
