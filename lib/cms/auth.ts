import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { readDB, writeDB } from "./store";
import type { User, Session, Role } from "./types";

// ============================================================
// Sección 4 del documento:
// - hash seguro de contraseñas (bcrypt) — aquí bcryptjs, sin
//   dependencias nativas, mismo algoritmo.
// - sesiones con expiración configurable.
// - cierre de sesión remoto disponible para el Super Admin.
//
// Las sesiones se guardan en el store (no son JWT autocontenidos)
// precisamente para poder revocarlas: un JWT stateless no se
// puede "cerrar remotamente" sin una lista de revocación, así que
// usamos sesiones con estado desde el principio.
// ============================================================

const COOKIE_NAME = "pat_admin_session";
const SESSION_DAYS = 7;
// En producción, definir SESSION_SECRET en las variables de entorno
// de Render. Este valor por defecto es solo para desarrollo local.
const SECRET = process.env.SESSION_SECRET || "pat-dev-secret-cambiar-en-produccion";

function sign(value: string): string {
  const h = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${h}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export function createSession(userId: string, userAgent = ""): string {
  const db = readDB();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    revoked: false,
    userAgent,
  };
  db.sessions.push(session);
  writeDB(db);
  return sign(session.id);
}

export function destroySessionCookieValue(cookieValue: string | undefined) {
  if (!cookieValue) return;
  const sessionId = verify(cookieValue);
  if (!sessionId) return;
  const db = readDB();
  const s = db.sessions.find((x) => x.id === sessionId);
  if (s) {
    s.revoked = true;
    writeDB(db);
  }
}

/** Revoca TODAS las sesiones de un usuario — "cierre de sesión remoto". */
export function revokeAllSessions(userId: string) {
  const db = readDB();
  let changed = false;
  for (const s of db.sessions) {
    if (s.userId === userId && !s.revoked) {
      s.revoked = true;
      changed = true;
    }
  }
  if (changed) writeDB(db);
}

export function getUserBySession(cookieValue: string | undefined): User | null {
  if (!cookieValue) return null;
  const sessionId = verify(cookieValue);
  if (!sessionId) return null;
  const db = readDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (!session || session.revoked) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  const user = db.users.find((u) => u.id === session.userId);
  if (!user || user.status !== "activo") return null;
  return user;
}

/** Server Components / Server Actions: usuario autenticado actual, o null. */
export function currentUser(): User | null {
  const jar = cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  return getUserBySession(raw);
}

export function findUserByEmail(email: string): User | null {
  const db = readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export { COOKIE_NAME, SESSION_DAYS };
export type { Role };
