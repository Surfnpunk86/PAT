import { readDB, writeDB, SYSTEM_AUTHOR_ID } from "./store";
import { can } from "./rbac";
import { revokeAllSessions } from "./auth";
import { logAction } from "./audit";
import type { Role, User, UserStatus } from "./types";

export class ForbiddenError extends Error {}

export function listUsers(): User[] {
  const db = readDB();
  return db.users.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getUser(id: string): User | null {
  const db = readDB();
  return db.users.find((u) => u.id === id) || null;
}

export function updateUserRole(actor: User, userId: string, role: Role) {
  const target = getUser(userId);
  if (!target) throw new Error("Usuario no encontrado.");
  if (!can(actor.role, "gestionar_usuarios", { targetRole: target.role })) {
    throw new ForbiddenError("Tu rol no puede gestionar usuarios.");
  }
  if (!can(actor.role, "gestionar_usuarios", { targetRole: role })) {
    throw new ForbiddenError("Tu rol no puede asignar ese rol.");
  }
  const db = readDB();
  const u = db.users.find((x) => x.id === userId)!;
  u.role = role;
  writeDB(db);
  logAction(actor, "update_role", "user", userId, `Nuevo rol: ${role}`);
}

export function updateUserStatus(actor: User, userId: string, status: UserStatus) {
  const target = getUser(userId);
  if (!target) throw new Error("Usuario no encontrado.");
  if (!can(actor.role, "gestionar_usuarios", { targetRole: target.role })) {
    throw new ForbiddenError("Tu rol no puede gestionar usuarios.");
  }
  const db = readDB();
  const u = db.users.find((x) => x.id === userId)!;
  u.status = status;
  writeDB(db);
  if (status !== "activo") revokeAllSessions(userId);

  // "Eliminado (baja permanente, con reasignación obligatoria de
  // autoría a 'Redacción PAT' para no perder el contenido)."
  if (status === "eliminado") {
    for (const c of db.content) {
      if (c.authorId === userId) c.authorId = SYSTEM_AUTHOR_ID;
    }
    writeDB(db);
  }
  logAction(actor, "update_status", "user", userId, `Nuevo estado: ${status}`);
}

/** Cierre de sesión remoto — solo Super Admin, sección 4. */
export function forceLogout(actor: User, userId: string) {
  if (actor.role !== "super_admin") {
    throw new ForbiddenError("Solo el Super Admin puede forzar el cierre de sesión.");
  }
  revokeAllSessions(userId);
  logAction(actor, "force_logout", "user", userId, "Cierre de sesión remoto");
}
