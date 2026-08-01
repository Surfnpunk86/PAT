import type { ContentItem } from "./types";
import type { Article, Talent } from "@/lib/data";
import { readDB } from "./store";

// Los componentes públicos (Card, TalCard, páginas de Actualidad/
// Talento) ya existían con los tipos de lib/data.ts antes del CMS.
// En vez de reescribirlos, se adapta ContentItem a esa misma forma
// — así el CMS se integra sin duplicar componentes de UI.

export function toArticle(item: ContentItem): Article {
  const db = readDB();
  const author = db.users.find((u) => u.id === item.authorId);
  return {
    id: item.slug,
    cat: item.section,
    t: item.title,
    r: item.readMinutes,
    a: author?.name || "Redacción PAT",
    d: (item.publishedAt ? new Date(item.publishedAt) : new Date(item.updatedAt))
      .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
      .toUpperCase(),
    s: item.summary,
    v: item.featuredImageVariant,
  };
}

export function toTalent(item: ContentItem): Talent {
  return {
    id: item.slug,
    n: item.title,
    h: item.creatorHandle || "",
    c: item.tags,
    p: item.creatorPlatforms || "",
    r: item.creatorReach || "",
    v: item.featuredImageVariant,
    b: item.city || "",
  };
}
