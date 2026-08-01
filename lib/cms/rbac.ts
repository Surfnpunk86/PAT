import type { Role } from "./types";

// ============================================================
// RBAC — modelado como matriz rol × acción (sección 7 del
// documento: "modelar permisos como matriz rol × acción ×
// recurso, no hardcodear if role === admin"). Para ajustar quién
// puede hacer qué, se edita ESTA tabla — no hay ifs de rol
// desperdigados por las páginas ni por content.ts.
// ============================================================

type Scope = boolean | "seccion" | "limitado" | "propias" | "engagement" | "bloqueo";

export interface RolePerms {
  crearBorrador: boolean;
  editarPropio: boolean;
  editarOtros: Scope;
  publicar: Scope;
  programar: boolean;
  despublicarArchivar: Scope;
  gestionarUsuarios: Scope;
  verAnaliticas: Scope;
}

export const ROLE_MATRIX: Record<Role, RolePerms> = {
  super_admin: {
    crearBorrador: true,
    editarPropio: true,
    editarOtros: true,
    publicar: true,
    programar: true,
    despublicarArchivar: true,
    gestionarUsuarios: true, // todos los roles
    verAnaliticas: true, // global
  },
  editor_jefe: {
    crearBorrador: true,
    editarPropio: true,
    editarOtros: true,
    publicar: true,
    programar: true,
    despublicarArchivar: true,
    gestionarUsuarios: "limitado", // solo corresponsales/redactores
    verAnaliticas: true, // global
  },
  editor_seccion: {
    crearBorrador: true,
    editarPropio: true,
    editarOtros: "seccion",
    publicar: "seccion",
    programar: true,
    despublicarArchivar: "seccion",
    gestionarUsuarios: false,
    verAnaliticas: "seccion",
  },
  corresponsal: {
    crearBorrador: true,
    editarPropio: true,
    editarOtros: false,
    publicar: false, // envía a revisión
    programar: false,
    despublicarArchivar: false,
    gestionarUsuarios: false,
    verAnaliticas: "propias",
  },
  social_media: {
    crearBorrador: false,
    editarPropio: false,
    editarOtros: false,
    publicar: false,
    programar: true, // solo contenido ya aprobado
    despublicarArchivar: false,
    gestionarUsuarios: false,
    verAnaliticas: "engagement",
  },
  auditor_legal: {
    crearBorrador: false,
    editarPropio: false,
    editarOtros: false,
    publicar: false,
    programar: false,
    despublicarArchivar: "bloqueo", // bloqueo por incumplimiento
    gestionarUsuarios: false,
    verAnaliticas: true, // global
  },
};

export type Action =
  | "crear"
  | "editar"
  | "publicar"
  | "programar"
  | "despublicar"
  | "gestionar_usuarios"
  | "ver_analiticas";

export interface Ctx {
  isOwn?: boolean;
  sameSection?: boolean;
  targetRole?: Role;
}

/**
 * Puerta única de permisos. Todas las mutaciones del CMS pasan por
 * aquí — content.ts y las Server Actions de /admin llaman a can()
 * antes de tocar el store, nunca comparan el rol directamente.
 */
export function can(role: Role, action: Action, ctx: Ctx = {}): boolean {
  const p = ROLE_MATRIX[role];

  switch (action) {
    case "crear":
      return p.crearBorrador;

    case "editar": {
      if (ctx.isOwn) return p.editarPropio || scopeAllows(p.editarOtros, ctx);
      return scopeAllows(p.editarOtros, ctx);
    }

    case "publicar":
      return scopeAllows(p.publicar, ctx);

    case "programar":
      return p.programar;

    case "despublicar":
      return scopeAllows(p.despublicarArchivar, ctx);

    case "gestionar_usuarios": {
      if (p.gestionarUsuarios === true) return true;
      if (p.gestionarUsuarios === "limitado") {
        // Editor en Jefe: solo puede gestionar corresponsales/redactores.
        return ctx.targetRole === "corresponsal" || ctx.targetRole === undefined;
      }
      return false;
    }

    case "ver_analiticas":
      return p.verAnaliticas !== false;

    default:
      return false;
  }
}

function scopeAllows(scope: Scope, ctx: Ctx): boolean {
  if (scope === true) return true;
  if (scope === false) return false;
  if (scope === "seccion") return !!ctx.sameSection;
  if (scope === "bloqueo") return true; // el auditor solo puede archivar/bloquear, ver despublicar en content.ts
  return false;
}

/** Alcance con el que un rol ve analíticas — usado por la página de Analíticas. */
export function analyticsScope(role: Role): Scope {
  return ROLE_MATRIX[role].verAnaliticas;
}
