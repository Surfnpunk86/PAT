"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  findUserByEmail,
  verifyPassword,
  createSession,
  destroySessionCookieValue,
  currentUser,
  COOKIE_NAME,
  SESSION_DAYS,
} from "./auth";
import { logAction } from "./audit";
import * as Content from "./content";
import * as Users from "./users";
import { createInvite, acceptInvite, getInvite } from "./invites";
import { sendMail } from "./mailer";
import type { ContentType, Role } from "./types";

function requireUser() {
  const u = currentUser();
  if (!u) redirect("/admin/login");
  return u;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

// ---------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const email = str(formData, "email");
  const password = str(formData, "password");
  const user = findUserByEmail(email);
  if (!user || !user.passwordHash || user.status !== "activo") {
    return { error: "Correo o contraseña incorrectos." };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { error: "Correo o contraseña incorrectos." };

  const ua = headers().get("user-agent") || "";
  const token = createSession(user.id, ua);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  logAction(user, "login", "user", user.id, "");
  redirect("/admin");
}

export async function logoutAction() {
  const raw = cookies().get(COOKIE_NAME)?.value;
  destroySessionCookieValue(raw);
  cookies().delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function acceptInviteAction(
  token: string,
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const name = str(formData, "name");
  const password = str(formData, "password");
  const password2 = str(formData, "password2");
  const bio = str(formData, "bio");
  const university = str(formData, "university");
  const socials = str(formData, "socials");

  if (!name || !password) return { error: "Nombre y contraseña son obligatorios." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (password !== password2) return { error: "Las contraseñas no coinciden." };

  const result = await acceptInvite(token, name, password, bio, university, socials);
  if (!result.ok) return { error: result.error };
  redirect("/admin/login?activada=1");
}

// ---------------------------------------------------------------
// Contenidos
// ---------------------------------------------------------------

function parseContentForm(formData: FormData): Content.ContentInput {
  return {
    type: str(formData, "type") as ContentType,
    title: str(formData, "title"),
    section: str(formData, "section"),
    city: str(formData, "city") || null,
    tags: str(formData, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    summary: str(formData, "summary"),
    body: str(formData, "body"),
    featuredImageVariant: Number(formData.get("featuredImageVariant") || 1),
    readMinutes: Number(formData.get("readMinutes") || 4),
    creatorHandle: str(formData, "creatorHandle") || undefined,
    creatorReach: str(formData, "creatorReach") || undefined,
    creatorPlatforms: str(formData, "creatorPlatforms") || undefined,
  };
}

export async function createContentAction(_prev: { error?: string } | undefined, formData: FormData) {
  const user = requireUser();
  try {
    const item = Content.createContent(user, parseContentForm(formData));
    revalidatePath("/admin/contenidos");
    redirect(`/admin/contenidos/${item.id}`);
  } catch (e: any) {
    if (e?.digest?.startsWith?.("NEXT_REDIRECT")) throw e;
    return { error: e.message || "No se pudo crear el contenido." };
  }
}

export async function updateContentAction(id: string, _prev: { error?: string } | undefined, formData: FormData) {
  const user = requireUser();
  try {
    Content.updateContent(user, id, parseContentForm(formData));
    revalidatePath(`/admin/contenidos/${id}`);
    revalidatePath("/admin/contenidos");
    return { error: undefined, ok: true };
  } catch (e: any) {
    return { error: e.message || "No se pudo guardar." };
  }
}

async function withWorkflow(id: string, fn: (user: ReturnType<typeof requireUser>) => void) {
  const user = requireUser();
  fn(user);
  revalidatePath(`/admin/contenidos/${id}`);
  revalidatePath("/admin/contenidos");
  revalidatePath("/admin");
  // El contenido publicado/despublicado también puede afectar el portal público.
  revalidatePath("/", "layout");
}

export async function submitForReviewAction(id: string) {
  await withWorkflow(id, (u) => Content.submitForReview(u, id));
}
export async function approveAction(id: string) {
  await withWorkflow(id, (u) => Content.approve(u, id));
}
export async function rejectAction(id: string, formData: FormData) {
  const reason = str(formData, "reason");
  await withWorkflow(id, (u) => Content.reject(u, id, reason));
}
export async function returnToDraftAction(id: string) {
  await withWorkflow(id, (u) => Content.returnToDraft(u, id));
}
export async function publishAction(id: string) {
  await withWorkflow(id, (u) => Content.publish(u, id));
}
export async function scheduleAction(id: string, formData: FormData) {
  const when = str(formData, "scheduledAt");
  await withWorkflow(id, (u) => Content.schedule(u, id, when));
}
export async function archiveAction(id: string, formData: FormData) {
  const reason = str(formData, "reason");
  await withWorkflow(id, (u) => Content.archive(u, id, reason));
}
export async function revertVersionAction(id: string, versionId: string) {
  await withWorkflow(id, (u) => Content.revertToVersion(u, id, versionId));
}

// ---------------------------------------------------------------
// Usuarios / invitaciones
// ---------------------------------------------------------------

export async function inviteUserAction(_prev: { error?: string; link?: string } | undefined, formData: FormData) {
  const user = requireUser();
  const email = str(formData, "email");
  const role = str(formData, "role") as Role;
  const city = str(formData, "city") || null;
  const section = str(formData, "section") || null;
  if (!email || !role) return { error: "Correo y rol son obligatorios." };

  try {
    const token = createInvite(user, email, role, city, section);
    const origin = headers().get("origin") || "";
    const link = `${origin}/admin/invitacion/${token}`;
    await sendMail(email, "Te invitaron a colaborar en PAT", `Crea tu contraseña aquí: ${link}`);
    revalidatePath("/admin/usuarios");
    return { link };
  } catch (e: any) {
    return { error: e.message || "No se pudo crear la invitación." };
  }
}

export async function updateUserRoleAction(userId: string, formData: FormData) {
  const user = requireUser();
  Users.updateUserRole(user, userId, str(formData, "role") as Role);
  revalidatePath("/admin/usuarios");
}

export async function updateUserStatusAction(userId: string, formData: FormData) {
  const user = requireUser();
  Users.updateUserStatus(user, userId, str(formData, "status") as any);
  revalidatePath("/admin/usuarios");
}

export async function forceLogoutAction(userId: string) {
  const user = requireUser();
  Users.forceLogout(user, userId);
  revalidatePath("/admin/usuarios");
}

export async function getInviteToken(token: string) {
  return getInvite(token);
}

// ---------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------

export async function addSectionAction(formData: FormData) {
  const user = requireUser();
  if (user.role !== "super_admin" && user.role !== "editor_jefe") return;
  const name = str(formData, "name");
  if (!name) return;
  const { readDB, writeDB } = await import("./store");
  const db = readDB();
  if (!db.settings.sections.includes(name)) db.settings.sections.push(name);
  writeDB(db);
  logAction(user, "add_section", "settings", name, "");
  revalidatePath("/admin/configuracion");
}

export async function addCityAction(formData: FormData) {
  const user = requireUser();
  if (user.role !== "super_admin" && user.role !== "editor_jefe") return;
  const name = str(formData, "name");
  if (!name) return;
  const { readDB, writeDB } = await import("./store");
  const db = readDB();
  if (!db.settings.cities.includes(name)) db.settings.cities.push(name);
  writeDB(db);
  logAction(user, "add_city", "settings", name, "");
  revalidatePath("/admin/configuracion");
}

