# PAT — Panel de Administración de Contenidos (CMS)

Implementación de `PAT-Modulo-Administracion-Contenidos.md` integrada
directamente sobre el proyecto Next.js del portal. No es una maqueta:
es un backend real (roles, sesiones, workflow editorial, versionado,
auditoría) conectado al mismo store que ahora alimenta el sitio
público — publicar desde `/admin` se refleja en el portal sin rebuild.

## Cómo entrar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000/admin/login`.

**Usuario semilla (Super Admin):**
- correo: `admin@pat.com`
- contraseña: `ChangeMe123!`

Cámbiala apenas entres — no hay pantalla de "cambiar contraseña" propia
todavía (ver pendientes más abajo); mientras tanto, invita a un Super
Admin nuevo con tu contraseña real y da de baja este usuario semilla.

## Qué es real y qué es demo en esta versión

| Pieza | Estado |
|---|---|
| Roles y matriz de permisos (sección 2) | **Real.** `lib/cms/rbac.ts`, una sola tabla — no hay `if role === admin` sueltos. |
| Flujo editorial (sección 3) | **Real.** Borrador → revisión → aprobado → programado/publicado → archivado, con rechazo y bloqueo de edición en revisión. |
| Usuarios, invitaciones, sesiones (sección 4) | **Real.** bcrypt, sesiones con expiración y revocación remota, invitación por token (nunca contraseña manual). |
| Versionado y reversión (sección 5.2) | **Real.** Cada edición guarda un snapshot; se puede revertir. |
| Vista previa del portal real (sección 5.2) | **Real.** Un editor autenticado puede abrir `/articulo/:slug` o `/talento/:slug` de una pieza no publicada y ve un aviso "Modo vista previa". |
| Auditoría (sección 4) | **Real.** Cada mutación queda en `auditLog`, visible en el Dashboard. |
| Base de datos | **Demo.** JSON en disco (`lib/cms/store.ts`). Swap a Postgres antes de producción — ver abajo. |
| Envío de correo de invitación | **Demo.** No hay proveedor conectado; el enlace se muestra en pantalla para copiar. `lib/cms/mailer.ts` ya tiene el punto de integración con Resend/SendGrid comentado. |
| Analíticas | **Demo.** Números deterministas por id (`lib/cms/analytics.ts`), no hay tracking real. |
| Editor de texto enriquecido | **Simplificado.** Textarea plano por ahora — el documento no exige uno específico; conectar TipTap/Editor.js es un paso de UI, no de arquitectura. |
| Gestor de medios (Cloudinary/S3) | **Simplificado.** Solo referencia a los 4 placeholders duotono ya existentes — coincide con que la fotografía real sigue pendiente (README-HOWARD.md, sección 7). |

## Dónde vive cada cosa

```
lib/cms/
  types.ts        Todos los tipos: Role, ContentStatus, ContentItem, etc.
  store.ts         Capa de datos (JSON en disco) + seed inicial
  rbac.ts          Matriz de permisos — sección 2 del documento
  auth.ts          Hash de contraseñas, sesiones firmadas, revocación
  content.ts       CRUD + workflow + versionado
  users.ts         Alta/edición/baja de usuarios
  invites.ts       Invitaciones por token
  mailer.ts        Stub de correo — punto de integración con Resend
  audit.ts         Registro de auditoría
  analytics.ts      Métricas simuladas
  adapters.ts       ContentItem -> tipos que ya usaban Card/TalCard
  actions.ts        Todas las Server Actions del panel (login, workflow, etc.)

app/admin/
  admin.css                        Estilos del panel
  (auth)/login/                    Login (público)
  (auth)/invitacion/[token]/       Aceptar invitación (público)
  (protected)/layout.tsx           Exige sesión válida
  (protected)/page.tsx             Dashboard
  (protected)/contenidos/          Listado, crear, editar/workflow
  (protected)/usuarios/            Invitar, roles, estados
  (protected)/calendario/          Programación
  (protected)/medios/              Biblioteca de medios (simplificada)
  (protected)/analiticas/          Analíticas (según alcance del rol)
  (protected)/configuracion/       Secciones, ciudades, plantilla de invitación

components/admin/
  AdminShell, LoginForm, AcceptInviteForm, ContentForm, InviteForm,
  RoleBadge, StatusPill
```

El sitio público (`app/(site)/`) ahora lee de `lib/cms/content.ts` en
vez de los arrays estáticos de `lib/data.ts`: `getPublished()` para
listados, `getContentBySlug()` para el detalle. `lib/data.ts` sigue
existiendo — es la fuente de la semilla inicial (`store.ts` migra
`ARTS`, `MR_ARTS` y `TAL` al store del CMS la primera vez que corre).

Por qué el sitio público y `/admin` tienen layouts separados: el grupo
de rutas `app/(site)/` lleva el header/footer/nav del portal; `/admin`
vive fuera de ese grupo a propósito — es una herramienta interna, no
una página del portal.

## Antes de producción

1. **Postgres real.** `lib/cms/store.ts` es la única pieza a
   reemplazar — el resto del CMS llama a `readDB()`/`writeDB()`, no a
   `fs` directamente. En el plan gratuito de Render el disco es
   efímero (se reinicia en cada deploy); con el JSON store tal cual,
   perderías usuarios y contenido en cada redeploy.
2. **`SESSION_SECRET`** en las variables de entorno de Render — sin
   esto, las sesiones se firman con un secreto de desarrollo público
   en este repo.
3. **Correo transaccional real** (Resend/SendGrid) en `mailer.ts`
   para que las invitaciones no dependan de copiar un link a mano.
4. **2FA** para Super Admin / Editor en Jefe, como sugiere la sección
   4 del documento — no implementado todavía.
5. Dar de baja o cambiar la contraseña del usuario semilla
   `admin@pat.com`.
6. Revisar si corresponde mover el editor de texto plano a uno
   enriquecido (TipTap/Editor.js) antes de que corresponsales reales
   escriban ahí.

## Cómo probé que funciona

- `npm run build` compila sin errores (30 rutas, incluidas todas las
  de `/admin`).
- Arranqué el servidor en modo producción (`npm run start`) y verifiqué
  por HTTP: `/`, `/actualidad`, `/articulo/:id`, `/talento`,
  `/talento/:id`, `/mente-real` devuelven 200 y ya muestran el
  contenido migrado desde el CMS (verificado con el perfil "Valeria
  Ospina" y el artículo de Generación Z).
- `/admin` sin sesión redirige (307) a `/admin/login`, confirmando que
  el layout protegido bloquea acceso no autenticado.
- Verifiqué de forma aislada que el hash bcrypt sembrado valida
  `ChangeMe123!` y rechaza cualquier otra contraseña, y que la firma
  HMAC de las cookies de sesión valida un token correcto y rechaza uno
  manipulado.
