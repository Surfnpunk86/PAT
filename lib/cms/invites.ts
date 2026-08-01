import crypto from "crypto";
import { readDB, writeDB } from "./store";
import { hashPassword } from "./auth";
import { logAction } from "./audit";
import type { Role, User } from "./types";

// ============================================================
// Sección 4: "Alta de colaboradores desde el panel: el Editor en
// Jefe o Super Admin genera una invitación (correo + rol + ciudad
// + sección asignada); el corresponsal recibe un enlace para crear
// su contraseña — NUNCA se asigna contraseña manualmente por el
// admin, por seguridad."
//
// Envío de correo: no hay proveedor SMTP conectado en este entorno
// (ver lib/cms/mailer.ts). El flujo completo — token, expiración,
// activación de cuenta al aceptar — SÍ está implementado; lo único
// pendiente de producción es enchufar Resend/SendGrid en mailer.ts
// como recomienda la sección 7 del documento.
// ============================================================

const INVITE_DAYS = 7;

export function createInvite(
  inviter: User,
  email: string,
  role: Role,
  city: string | null,
  section: string | null
) {
  const db = readDB();
  const token = crypto.randomBytes(24).toString("hex");
  const now = new Date();
  db.invites.push({
    token,
    email,
    role,
    city,
    section,
    invitedBy: inviter.id,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + INVITE_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
  });
  writeDB(db);
  logAction(inviter, "invite_created", "invite", token, `${email} como ${role}`);
  return token;
}

export function getInvite(token: string) {
  const db = readDB();
  return db.invites.find((i) => i.token === token) || null;
}

export async function acceptInvite(
  token: string,
  name: string,
  password: string,
  bio: string,
  university: string,
  socials: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = readDB();
  const invite = db.invites.find((i) => i.token === token);
  if (!invite) return { ok: false, error: "Invitación no encontrada." };
  if (invite.acceptedAt) return { ok: false, error: "Esta invitación ya fue usada." };
  if (new Date(invite.expiresAt).getTime() < Date.now())
    return { ok: false, error: "Esta invitación expiró. Pide una nueva." };

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email: invite.email,
    passwordHash,
    role: invite.role,
    city: invite.city,
    section: invite.section,
    bio,
    avatarVariant: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4,
    university: university || null,
    socials,
    status: "activo",
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  invite.acceptedAt = new Date().toISOString();
  writeDB(db);
  logAction(user, "invite_accepted", "user", user.id, `${user.email} activó su cuenta`);
  return { ok: true };
}
