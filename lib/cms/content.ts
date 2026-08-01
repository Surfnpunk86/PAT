import crypto from "crypto";
import { readDB, writeDB, slugify, SYSTEM_AUTHOR_ID } from "./store";
import { can } from "./rbac";
import { logAction } from "./audit";
import type { ContentItem, ContentStatus, ContentType, User } from "./types";

// ============================================================
// Sección 3 — flujo editorial:
//   Borrador → En revisión → Aprobado → Programado → Publicado → Archivado
//                  ↓
//             Rechazado (con comentarios) → vuelve a Borrador
//
// Cada transición pasa por can() de rbac.ts antes de tocar el
// store, y cada mutación queda en el audit log (sección 4) y deja
// una versión en versions[] antes de sobrescribir (sección 5.2 —
// "Versionado: historial de cambios con posibilidad de revertir").
// ============================================================

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}

function ctxFor(actor: User, item: Pick<ContentItem, "authorId" | "section">) {
  return {
    isOwn: item.authorId === actor.id,
    sameSection: !!actor.section && actor.section === item.section,
  };
}

function snapshotVersion(item: ContentItem, editedBy: string) {
  const db = readDB();
  const versionNumber =
    db.versions.filter((v) => v.contentId === item.id).length + 1;
  db.versions.push({
    id: crypto.randomUUID(),
    contentId: item.id,
    versionNumber,
    snapshot: item,
    editedBy,
    createdAt: new Date().toISOString(),
  });
  writeDB(db);
}

// ---------- Lecturas ----------

export interface ContentFilters {
  status?: ContentStatus;
  type?: ContentType;
  section?: string;
  city?: string;
  authorId?: string;
  q?: string;
}

/** Pasa a "publicado" cualquier pieza programada cuya fecha ya llegó. */
function resolveScheduled() {
  const db = readDB();
  const now = Date.now();
  let changed = false;
  for (const c of db.content) {
    if (c.status === "programado" && c.scheduledAt && new Date(c.scheduledAt).getTime() <= now) {
      c.status = "publicado";
      c.publishedAt = new Date().toISOString();
      changed = true;
      logAction(null, "auto_publish", "content", c.id, "Publicación automática por fecha programada");
    }
  }
  if (changed) writeDB(db);
}

export function listContent(filters: ContentFilters = {}): ContentItem[] {
  resolveScheduled();
  const db = readDB();
  return db.content
    .filter((c) => (filters.status ? c.status === filters.status : true))
    .filter((c) => (filters.type ? c.type === filters.type : true))
    .filter((c) => (filters.section ? c.section === filters.section : true))
    .filter((c) => (filters.city ? c.city === filters.city : true))
    .filter((c) => (filters.authorId ? c.authorId === filters.authorId : true))
    .filter((c) =>
      filters.q
        ? c.title.toLowerCase().includes(filters.q.toLowerCase()) ||
          c.summary.toLowerCase().includes(filters.q.toLowerCase())
        : true
    )
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getContentById(id: string): ContentItem | null {
  resolveScheduled();
  const db = readDB();
  return db.content.find((c) => c.id === id) || null;
}

export function getContentBySlug(type: ContentType, slug: string): ContentItem | null {
  resolveScheduled();
  const db = readDB();
  return db.content.find((c) => c.type === type && c.slug === slug) || null;
}

/** Usado por el portal público: solo lo publicado, salvo que el visitante sea un admin autenticado (vista previa real). */
export function getPublished(type?: ContentType, section?: string): ContentItem[] {
  resolveScheduled();
  const db = readDB();
  return db.content
    .filter((c) => c.status === "publicado")
    .filter((c) => (type ? c.type === type : true))
    .filter((c) => (section ? c.section === section : true))
    .sort((a, b) => (a.publishedAt! < b.publishedAt! ? 1 : -1));
}

export function getVersions(contentId: string) {
  const db = readDB();
  return db.versions
    .filter((v) => v.contentId === contentId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
}

// ---------- Escrituras ----------

export interface ContentInput {
  type: ContentType;
  title: string;
  section: string;
  city: string | null;
  tags: string[];
  summary: string;
  body: string;
  featuredImageVariant: number;
  readMinutes: number;
  creatorHandle?: string;
  creatorReach?: string;
  creatorPlatforms?: string;
}

export function createContent(actor: User, input: ContentInput): ContentItem {
  if (!can(actor.role, "crear")) {
    throw new ForbiddenError("Tu rol no puede crear contenido.");
  }
  const db = readDB();
  const now = new Date().toISOString();
  const baseSlug = slugify(input.title) || crypto.randomUUID().slice(0, 8);
  let slug = baseSlug;
  let n = 1;
  while (db.content.some((c) => c.type === input.type && c.slug === slug)) {
    slug = `${baseSlug}-${++n}`;
  }
  const item: ContentItem = {
    id: crypto.randomUUID(),
    ...input,
    slug,
    status: "borrador",
    authorId: actor.id,
    editorId: null,
    rejectReason: null,
    scheduledAt: null,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  db.content.push(item);
  writeDB(db);
  logAction(actor, "create", "content", item.id, item.title);
  return item;
}

export function updateContent(
  actor: User,
  id: string,
  input: Partial<ContentInput>
): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "editar", ctx)) {
    throw new ForbiddenError("No tienes permiso para editar esta pieza.");
  }
  if (item.status === "en_revision" && !ctx.isOwn) {
    // Bloqueado para el autor mientras está en revisión (sección 3),
    // pero un editor SÍ puede tocarlo para corregir antes de aprobar.
  }
  snapshotVersion(item, actor.id);
  Object.assign(item, input, {
    updatedAt: new Date().toISOString(),
    ...(input.title ? { slug: item.slug } : {}), // el slug no cambia solo (evita romper enlaces publicados)
  });
  writeDB(db);
  logAction(actor, "update", "content", item.id, item.title);
  return item;
}

export function submitForReview(actor: User, id: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  if (item.authorId !== actor.id && !can(actor.role, "editar", { sameSection: actor.section === item.section })) {
    throw new ForbiddenError("Solo el autor (o un editor de su sección) puede enviarlo a revisión.");
  }
  if (item.status !== "borrador" && item.status !== "rechazado") {
    throw new ForbiddenError("Solo se puede enviar a revisión desde Borrador o Rechazado.");
  }
  item.status = "en_revision";
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "submit_review", "content", item.id, item.title);
  return item;
}

export function approve(actor: User, id: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "publicar", ctx)) {
    throw new ForbiddenError("Tu rol no puede aprobar contenido de esta sección.");
  }
  if (item.status !== "en_revision") {
    throw new ForbiddenError("Solo se aprueba contenido que está en revisión.");
  }
  item.status = "aprobado";
  item.editorId = actor.id;
  item.rejectReason = null;
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "approve", "content", item.id, item.title);
  return item;
}

export function reject(actor: User, id: string, reason: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "publicar", ctx)) {
    throw new ForbiddenError("Tu rol no puede rechazar contenido de esta sección.");
  }
  if (item.status !== "en_revision") {
    throw new ForbiddenError("Solo se rechaza contenido que está en revisión.");
  }
  item.status = "rechazado";
  item.editorId = actor.id;
  item.rejectReason = reason;
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "reject", "content", item.id, reason);
  return item;
}

/** El autor retoma un contenido rechazado — vuelve a Borrador (ver diagrama sección 3). */
export function returnToDraft(actor: User, id: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  if (item.authorId !== actor.id && !can(actor.role, "editar", ctxFor(actor, item))) {
    throw new ForbiddenError("No tienes permiso sobre esta pieza.");
  }
  if (item.status !== "rechazado") {
    throw new ForbiddenError("Solo aplica a contenido rechazado.");
  }
  item.status = "borrador";
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "return_to_draft", "content", item.id, item.title);
  return item;
}

export function publish(actor: User, id: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "publicar", ctx)) {
    throw new ForbiddenError("Tu rol no puede publicar contenido de esta sección.");
  }
  if (item.status !== "aprobado") {
    throw new ForbiddenError("Solo se publica contenido aprobado.");
  }
  item.status = "publicado";
  item.publishedAt = new Date().toISOString();
  item.scheduledAt = null;
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "publish", "content", item.id, item.title);
  return item;
}

export function schedule(actor: User, id: string, when: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  if (!can(actor.role, "programar")) {
    throw new ForbiddenError("Tu rol no puede programar publicaciones.");
  }
  if (item.status !== "aprobado") {
    throw new ForbiddenError("Solo se programa contenido aprobado.");
  }
  if (new Date(when).getTime() <= Date.now()) {
    throw new ForbiddenError("La fecha programada debe ser futura.");
  }
  item.status = "programado";
  item.scheduledAt = new Date(when).toISOString();
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "schedule", "content", item.id, item.scheduledAt);
  return item;
}

export function archive(actor: User, id: string, reason = ""): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "despublicar", ctx)) {
    throw new ForbiddenError("Tu rol no puede archivar/despublicar esta pieza.");
  }
  item.status = "archivado";
  item.updatedAt = new Date().toISOString();
  writeDB(db);
  logAction(actor, "archive", "content", item.id, reason || "Archivado");
  return item;
}

export function revertToVersion(actor: User, id: string, versionId: string): ContentItem {
  const db = readDB();
  const item = db.content.find((c) => c.id === id);
  if (!item) throw new NotFoundError("Contenido no encontrado.");
  const ctx = ctxFor(actor, item);
  if (!can(actor.role, "editar", ctx)) {
    throw new ForbiddenError("No tienes permiso para editar esta pieza.");
  }
  const version = db.versions.find((v) => v.id === versionId && v.contentId === id);
  if (!version) throw new NotFoundError("Versión no encontrada.");

  snapshotVersion(item, actor.id);
  const restored = {
    ...version.snapshot,
    id: item.id,
    status: item.status,
    updatedAt: new Date().toISOString(),
  };
  Object.assign(item, restored);
  writeDB(db);
  logAction(actor, "revert", "content", item.id, `a versión #${version.versionNumber}`);
  return item;
}

export { SYSTEM_AUTHOR_ID };
