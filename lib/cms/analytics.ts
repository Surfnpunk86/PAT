import type { ContentItem } from "./types";

// ============================================================
// Sección 6.7 y 8: analíticas por pieza/autor/ciudad. No hay un
// pipeline de tracking real conectado en este entorno. Estos
// números son deterministas (mismo id → mismo número siempre) para
// que la UI del panel se pueda construir y probar ya mismo; el
// reemplazo natural es leer de la tabla de eventos real cuando
// exista (Postgres, sección 7) o de un proveedor tipo Plausible.
// ============================================================

function seededNumber(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (h % (max - min));
}

export function mockViews(item: ContentItem): number {
  return seededNumber(item.id, 120, 42000);
}

export function mockAvgReadPct(item: ContentItem): number {
  return seededNumber(item.id + "r", 34, 92);
}

export function mockShares(item: ContentItem): number {
  return seededNumber(item.id + "s", 2, 900);
}
