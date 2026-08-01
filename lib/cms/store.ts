import fs from "fs";
import path from "path";
import type { DB, User, ContentItem } from "./types";
import { ARTS, MR_ARTS, TAL } from "@/lib/data";

// ============================================================
// CAPA DE DATOS DEL CMS.
//
// Esto es un almacén en un archivo JSON en disco. Es intencional
// y suficiente para desarrollar, probar y demostrar el módulo
// completo (roles, workflow, versionado, auditoría) sin depender
// de un servicio externo.
//
// EN PRODUCCIÓN (Render): la sección 7 del documento pide
// PostgreSQL. Cuando se levante esa base, esta es la ÚNICA pieza
// que hay que reemplazar — todas las funciones de más abajo
// (readDB/writeDB) tienen la misma firma que tendría un cliente
// de Postgres, y ningún otro archivo del CMS (rbac.ts, auth.ts,
// content.ts, ni las páginas de /admin) necesita cambiar más que
// las llamadas a estas dos funciones.
//
// LIMITACIÓN CONOCIDA: en el plan gratuito de Render el disco es
// efímero — se reinicia en cada deploy. Para persistencia real en
// producción hay que (a) usar un Render Disk persistente, o (b)
// migrar a Postgres. No usar este store tal cual en producción con
// datos reales de usuarios.
// ============================================================

const DB_PATH = path.join(process.cwd(), "data", "cms-db.json");
const SYSTEM_AUTHOR_ID = "u-redaccion-pat";

function emptyDB(): DB {
  return {
    users: [],
    sessions: [],
    invites: [],
    content: [],
    versions: [],
    auditLog: [],
    settings: {
      sections: [
        "Cultura joven",
        "Bienestar",
        "Emprendimiento",
        "Ciudad",
        "Redes",
        "Música",
        "Moda",
        "Tecnología",
        "Mente Real",
        "Talento",
      ],
      cities: [
        "Barranquilla",
        "Bogotá",
        "Medellín",
        "Cali",
        "Cartagena",
        "Internacional",
      ],
      inviteEmailTemplate:
        "Hola {{nombre}},\n\nTe estamos invitando a colaborar como {{rol}} de People Are Talking" +
        "{{ciudad}}. Crea tu contraseña aquí para activar tu cuenta:\n{{link}}\n\nEste enlace expira en 7 días.\n\n— Equipo editorial PAT",
    },
  };
}

// Semilla inicial: un Super Admin (para poder entrar el día uno) +
// el usuario sistema "Redacción PAT" (autor de todo el contenido
// heredado del prototipo) + todo el contenido que YA existe en
// lib/data.ts, importado como contenido "publicado" para que el
// admin arranque reflejando exactamente lo que hoy se ve en el
// portal.
function seed(): DB {
  const db = emptyDB();
  const now = new Date().toISOString();

  const superAdmin: User = {
    id: "u-super-admin",
    name: "Renzo (Super Admin)",
    email: "admin@pat.com",
    // bcrypt de "ChangeMe123!" — CAMBIAR de inmediato tras el primer login.
    passwordHash:
      "$2b$10$0SxDDEGRYgt5l88OIvvKqeoThWHrEi/bf/ehfJZrMh2lN26DeQbie",
    role: "super_admin",
    city: null,
    section: null,
    bio: "Fundador — control editorial y de producto de PAT.",
    avatarVariant: 1,
    university: null,
    socials: "",
    status: "activo",
    createdAt: now,
  };

  const redaccion: User = {
    id: SYSTEM_AUTHOR_ID,
    name: "Redacción PAT",
    email: "redaccion@pat.com",
    passwordHash: null,
    role: "editor_jefe",
    city: null,
    section: null,
    bio: "Autoría por defecto del contenido heredado del portal.",
    avatarVariant: 1,
    university: null,
    socials: "",
    status: "activo",
    createdAt: now,
  };

  db.users.push(superAdmin, redaccion);

  let i = 0;
  for (const a of ARTS) {
    db.content.push(articleToContent(a, "noticia", "Cultura joven", now, i++));
  }
  for (const a of MR_ARTS) {
    db.content.push({
      id: `c-mr-${slugify(a.t)}`,
      type: "noticia",
      title: a.t,
      slug: slugify(a.t),
      section: "Mente Real",
      city: null,
      tags: [a.c],
      summary: a.t,
      body: "Contenido de muestra migrado desde el prototipo. Reemplazar por el texto real.",
      featuredImageVariant: a.v,
      readMinutes: a.r,
      status: "publicado",
      authorId: SYSTEM_AUTHOR_ID,
      editorId: SYSTEM_AUTHOR_ID,
      rejectReason: null,
      scheduledAt: null,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }
  for (const t of TAL) {
    db.content.push({
      id: `c-tal-${t.id}`,
      type: "creador",
      title: t.n,
      slug: t.id,
      section: "Talento",
      city: t.b,
      tags: t.c,
      summary: `${t.h} · ${t.p}`,
      body: "Ficha de muestra migrada desde el prototipo. Reemplazar por la bio real.",
      featuredImageVariant: t.v,
      readMinutes: 0,
      status: "publicado",
      authorId: SYSTEM_AUTHOR_ID,
      editorId: SYSTEM_AUTHOR_ID,
      rejectReason: null,
      scheduledAt: null,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      creatorHandle: t.h,
      creatorReach: t.r,
      creatorPlatforms: t.p,
    });
  }

  db.auditLog.push({
    id: "log-seed",
    actorId: null,
    actorName: "Sistema",
    action: "seed",
    resourceType: "db",
    resourceId: "-",
    meta: "Base de datos inicializada con contenido heredado del prototipo.",
    createdAt: now,
  });

  return db;
}

function articleToContent(
  a: { id: string; cat: string; t: string; r: number; a: string; d: string; s: string; v: number },
  type: ContentItem["type"],
  fallbackSection: string,
  now: string,
  order: number
): ContentItem {
  return {
    id: `c-art-${a.id}`,
    type,
    title: a.t,
    slug: a.id,
    section: a.cat || fallbackSection,
    city: null,
    tags: [a.cat],
    summary: a.s,
    body: a.s,
    featuredImageVariant: a.v,
    readMinutes: a.r,
    status: "publicado",
    authorId: SYSTEM_AUTHOR_ID,
    editorId: SYSTEM_AUTHOR_ID,
    rejectReason: null,
    scheduledAt: null,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readDB(): DB {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const db = seed();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    return db;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    const db = seed();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    return db;
  }
}

export function writeDB(db: DB) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export { SYSTEM_AUTHOR_ID };
