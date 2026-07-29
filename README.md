# PAT — Next.js (port del prototipo)

Este proyecto es un port a **Next.js 14 (App Router) + TypeScript** del
prototipo de un solo archivo `index.html` entregado por Renzo. Sigue el
`README-HOWARD.md` original punto por punto. Este archivo documenta
**cómo** se hizo el port y qué falta.

## Instalación

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Qué se portó

Cada ruta del prototipo (`#/algo`) es ahora una ruta real de Next.js
(`/algo`), como pedía el encargo:

| Prototipo (`#/...`) | Next.js |
|---|---|
| `#/` | `app/page.tsx` |
| `#/actualidad` | `app/actualidad/page.tsx` |
| `#/articulo/:id` | `app/articulo/[id]/page.tsx` |
| `#/tendencias` | `app/tendencias/page.tsx` |
| `#/talento`, `#/talento/:id` | `app/talento/page.tsx`, `app/talento/[id]/page.tsx` |
| `#/mente-real` | `app/mente-real/page.tsx` |
| `#/mente-real/chat` | `app/mente-real/chat/page.tsx` |
| `#/ayuda` | `app/ayuda/page.tsx` |
| `#/marcas` | `app/marcas/page.tsx` |
| `#/comunidad` | `app/comunidad/page.tsx` |
| `#/pronto/*` | `app/pronto/[slug]/page.tsx` |

Header sticky, ticker, mobile bottom nav, FAB y footer son componentes
compartidos en `components/`, montados desde `app/layout.tsx`.

## Decisiones de implementación

- **CSS**: el sistema de diseño del prototipo (`app/globals.css`) se
  portó **tal cual**, variable por variable y clase por clase, en vez
  de reescribirlo como utilidades de Tailwind. Es deliberado: ese CSS
  ya resuelve grids asimétricos, el ticker, el chat y el protocolo de
  crisis con precisión, y reescribirlo en utilidades habría sido
  puro riesgo de introducir diferencias visuales sin ganar nada.
  `tailwind.config.ts` sí trae los tokens de la sección 3 del README
  (`pat-*`, `mr-*`, tipografías) para que **componentes nuevos** que
  se construyan de aquí en adelante tengan la paleta a mano.
- **Datos**: todo el contenido de muestra (`NAV`, `ARTS`, `TAL`,
  `TREND`, `LINES`, `SCRIPT`, etc.) vive en `lib/data.ts`, tipado.
  Es el primer candidato a moverse a un CMS (ver sección 8 del
  README original, paso 2).
- **Placeholders de foto**: `components/Placeholder.tsx` reproduce
  el duotono CSS (`.ph`) del prototipo. Sigue siendo un placeholder,
  no la solución final — ver sección 7 del README original.

## Lo que exige más cuidado (no tocar sin leer el README original)

- **`components/ChatWidget.tsx`**: el chat es enteramente guionado
  (`SCRIPT` / `FALLBACK` en `lib/data.ts`). **No hay ningún cliente
  de LLM conectado y no debe conectarse uno** sin que existan (a)
  revisión de profesionales de salud mental, (b) protocolo de
  escalamiento a humano, (c) concepto legal. El protocolo de crisis
  (`RISK` regex) abre una pantalla completa (`.crisis`), nunca un
  mensaje más del hilo — no lo conviertas en banner.
- **Conversaciones no persistidas**: el estado del chat vive
  únicamente en memoria de React (`useState`). No hay tabla de
  mensajes ni endpoint que las reciba. No agregar persistencia sin
  revisar la sección 5 del README original — son datos sensibles de
  salud de menores.
- **`components/JoinForm.tsx`**: implementa el age gate de la Ley
  1581 de 2012. El checkbox de autorización **no está premarcado**.
  Falta conectar el submit a un backend real (hoy solo cambia el
  texto del botón) y cargar GA4 / Meta Pixel / TikTok Pixel
  **después** de ese consentimiento, no antes.
- **`app/ayuda/page.tsx` y `lib/data.ts` (`LINES`, `LINES_REG`)**:
  los números de las líneas de ayuda son los del prototipo.
  Deben validarse con las secretarías de salud antes de publicar y
  revisarse cada 6 meses.
- **Amarillo**: sigue siendo el único color de marca, y sigue sin
  usarse dentro de Mente Real (excepto el logo del header) por el
  mismo motivo que en el prototipo: es el registro de urgencia y
  hype, no el que necesita alguien con ansiedad a las 2 a.m.

## Lo que falta (a propósito, ver sección 2 del README original)

Checkout, pasarela de pagos, subastas, panel administrativo,
comisiones y LLM en vivo **no están implementados**. Las rutas
`#/pronto/*` quedan como stubs (`app/pronto/[slug]/page.tsx`) — no
completarlas por iniciativa propia.

## Siguiente paso sugerido

Backend real: Postgres/Supabase con roles `usuario` · `creador` ·
`marca` · `admin`, CMS para Actualidad/Mente Real, y el formulario de
Comunidad conectado a un endpoint que dispare el correo de
autorización a acudientes. Deploy en Render, como indica la sección 3
del README original.
