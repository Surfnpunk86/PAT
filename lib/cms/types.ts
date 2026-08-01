// ============================================================
// TIPOS DEL CMS — modelados directamente sobre
// PAT-Modulo-Administracion-Contenidos.md, secciones 2, 3, 4, 5.
// ============================================================

export type Role =
  | "super_admin"
  | "editor_jefe"
  | "editor_seccion"
  | "corresponsal"
  | "social_media"
  | "auditor_legal";

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  editor_jefe: "Editor en Jefe",
  editor_seccion: "Editor de Sección",
  corresponsal: "Corresponsal / Redactor",
  social_media: "Community / Social Media",
  auditor_legal: "Auditor / Legal",
};

export type UserStatus = "activo" | "suspendido" | "inactivo" | "eliminado";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null; // null hasta que acepte la invitación
  role: Role;
  city: string | null;
  section: string | null;
  bio: string;
  avatarVariant: number; // referencia al placeholder duotono (1-4)
  university: string | null; // "universidad/medio de origen"
  socials: string;
  status: UserStatus;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  userAgent: string;
}

export interface Invite {
  token: string;
  email: string;
  role: Role;
  city: string | null;
  section: string | null;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

// Sección 3 — flujo editorial.
export type ContentStatus =
  | "borrador"
  | "en_revision"
  | "aprobado"
  | "programado"
  | "publicado"
  | "rechazado"
  | "archivado";

export const STATUS_LABEL: Record<ContentStatus, string> = {
  borrador: "Borrador",
  en_revision: "En revisión",
  aprobado: "Aprobado",
  programado: "Programado",
  publicado: "Publicado",
  rechazado: "Rechazado",
  archivado: "Archivado / Dado de baja",
};

// Sección 5.1 — tipos de contenido soportados.
export type ContentType =
  | "noticia"
  | "creador"
  | "podcast"
  | "foto"
  | "video"
  | "reportaje";

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  noticia: "Noticia / actualidad",
  creador: "Creador nuevo (ficha de perfil)",
  podcast: "Podcast",
  foto: "Foto (galería)",
  video: "Video",
  reportaje: "Reportaje",
};

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  section: string; // p.ej. "Cultura joven", "Mente Real", "Talento"
  city: string | null; // ciudad de origen del corresponsal
  tags: string[];
  summary: string;
  body: string;
  featuredImageVariant: number; // placeholder duotono 1-4, ver README fotografía
  readMinutes: number;
  status: ContentStatus;
  authorId: string;
  editorId: string | null; // último revisor/editor que actuó
  rejectReason: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Solo para type === 'creador' — campos de la ficha de talento.
  creatorHandle?: string;
  creatorReach?: string;
  creatorPlatforms?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  snapshot: ContentItem;
  editedBy: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  meta: string;
  createdAt: string;
}

export interface DB {
  users: User[];
  sessions: Session[];
  invites: Invite[];
  content: ContentItem[];
  versions: ContentVersion[];
  auditLog: AuditLogEntry[];
  settings: {
    sections: string[];
    cities: string[];
    inviteEmailTemplate: string;
  };
}
