import crypto from "crypto";
import { readDB, writeDB } from "./store";
import type { User } from "./types";

// Sección 4: "Registro de actividad (audit log): quién creó, editó,
// aprobó, publicó o dio de baja cada pieza, con fecha y hora —
// indispensable al escalar a decenas de corresponsales."
export function logAction(
  actor: User | null,
  action: string,
  resourceType: string,
  resourceId: string,
  meta: string = ""
) {
  const db = readDB();
  db.auditLog.unshift({
    id: crypto.randomUUID(),
    actorId: actor?.id ?? null,
    actorName: actor?.name ?? "Sistema",
    action,
    resourceType,
    resourceId,
    meta,
    createdAt: new Date().toISOString(),
  });
  // Mantener el log acotado en este store de archivo plano.
  if (db.auditLog.length > 2000) db.auditLog.length = 2000;
  writeDB(db);
}
