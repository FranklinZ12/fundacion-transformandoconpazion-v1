# Auth, Roles, Permisos y CMS — Fundación TCP

> **Estado:** Diseño / Pendiente de implementación  
> **Stack elegido:** Supabase (PostgreSQL + Auth + Storage) + NextAuth.js v5  
> **Por qué Supabase:**
> - Los roles y permisos son datos relacionales — SQL es más limpio y predecible que Firestore NoSQL
> - **Row Level Security (RLS)** impone permisos a nivel de base de datos, no solo en código de aplicación
> - Un solo servicio cubre: Auth + base de datos + almacenamiento de imágenes
> - `@supabase/ssr` tiene integración oficial con Next.js App Router
> - Free tier generoso (500 MB DB, 1 GB Storage, 50 k MAU)
> - Open source — puede auto-hostearse si la fundación lo necesita en el futuro
> - Sin SDK de Admin separado — misma librería en cliente y servidor

---

## 1. Visión general

La plataforma requiere un panel de administración (`/admin`) donde personas de la fundación puedan:

1. **Iniciar sesión** con correo y contraseña.
2. **Gestionar usuarios** (solo el Líder): aprobar solicitudes, asignar roles y permisos.
3. **Editar contenido** del sitio sin tocar código: textos, imágenes, logos de secciones clave.

```
Visitante público  →  ve el sitio normal (sin login)
Usuario registrado →  acceso básico al panel (solo lectura)
Editor             →  puede editar contenido del sitio
Líder              →  puede editar contenido + gestionar usuarios
```

---

## 2. Roles

| Rol | Código | Descripción |
|-----|--------|-------------|
| Líder | `leader` | Rol supremo. Aprueba registros, asigna roles y permisos a otros usuarios. Puede editar cualquier contenido. |
| Editor | `editor` | Puede editar las secciones que le fueron habilitadas. No gestiona usuarios. |
| Miembro | `member` | Acceso de solo lectura al panel. No puede editar ni gestionar. |

> El primer usuario `leader` se crea manualmente desde Firebase Console (o con un script de seed). A partir de ahí, el Líder crea y aprueba los demás desde el panel.

---

## 3. Permisos de contenido

Cada usuario puede tener uno o varios permisos de edición. El Líder los asigna de forma granular.

| Permiso | Código | Sección editable |
|---------|--------|-----------------|
| Editar inicio | `edit:home` | Hero, cards de procesos destacados, textos de bienvenida |
| Editar organización | `edit:org` | Misión, visión, valores, principios (`/nosotros/organizacion`) |
| Editar equipo | `edit:team` | Fotos, nombres, cargos de los miembros (`/nosotros/equipo`) |
| Editar voluntarios | `edit:donations` | Textos e imágenes de voluntariado y donaciones (`/nosotros/voluntario-y-donaciones`) |
| Editar procesos | `edit:processes` | Descripción, logo, imágenes de cada proceso (`/procesos/[slug]`) |
| Gestionar usuarios | `manage:users` | Solo el Líder. Aprobar, suspender, asignar roles. |

Un usuario `editor` puede tener `["edit:home", "edit:processes"]` pero no `manage:users`.  
Un usuario `leader` tiene implícitamente **todos los permisos**.

---

## 4. Flujo de registro y aprobación

```
1. Nuevo usuario visita /admin/register
2. Rellena: nombre, correo, contraseña, motivo de acceso
3. Se crea la cuenta en Firebase Auth con estado pendiente
4. Se guarda en Firestore: { uid, name, email, role: 'member', permissions: [], status: 'pending' }
5. El Líder recibe notificación (email o badge en el panel)
6. El Líder entra a /admin/usuarios → ve la solicitud pendiente
7. El Líder aprueba → selecciona rol y permisos → guarda
8. Firestore se actualiza: { status: 'approved', role: 'editor', permissions: [...] }
9. El usuario ya puede acceder al panel con sus permisos
```

Si el Líder rechaza, el status queda `rejected` y el usuario no puede hacer login al panel.

---

## 5. Esquema de base de datos en Supabase (PostgreSQL)

Supabase crea automáticamente la tabla `auth.users`. El resto lo definimos nosotros.

### Tabla `public.profiles`

Extiende el usuario de Supabase Auth con rol, permisos y estado de aprobación.

```sql
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default 'member'   check (role in ('leader', 'editor', 'member')),
  permissions text[] not null default '{}',    -- e.g. '{edit:home,edit:processes}'
  status      text not null default 'pending'  check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz default now(),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz
);

-- Solo el propio usuario puede leer su perfil, escritura solo desde el servidor
alter table public.profiles enable row level security;

create policy "usuario lee su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "servidor escribe perfiles"
  on public.profiles for all
  using (false)       -- bloquea cliente
  with check (false); -- solo Admin API / Service Role Key puede escribir
```

### Tabla `public.site_content`

Almacena el contenido editable del sitio. Una fila por sección.

```sql
create table public.site_content (
  id         text primary key,       -- e.g. 'home', 'org', 'team', 'proceso:jovemp'
  section    text not null,          -- 'home' | 'org' | 'team' | 'donations' | 'process'
  data       jsonb not null,         -- contenido libre según la sección
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id)
);

-- Lectura pública (el sitio lee el contenido sin login)
create policy "lectura publica de contenido"
  on public.site_content for select
  using (true);

-- Escritura solo desde el servidor (service role key)
create policy "servidor escribe contenido"
  on public.site_content for all
  using (false)
  with check (false);
```

### Tabla `public.audit_log`

Registro de quién editó qué y cuándo.

```sql
create table public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id),
  action      text not null,         -- 'content.update' | 'user.approve' | 'user.reject'
  target_id   text,                  -- id del recurso afectado
  payload     jsonb,                 -- snapshot del cambio
  created_at  timestamptz default now()
);
```

---

## 6. Arquitectura de rutas en Next.js

```
app/
  admin/
    layout.js           → layout protegido (verifica sesión + role)
    page.js             → dashboard (redirect a /admin/inicio)
    login/
      page.js           → formulario de login
    register/
      page.js           → formulario de registro (solicitud)
    usuarios/
      page.js           → lista de usuarios (solo leader)
      [uid]/
        page.js         → detalle/edición de usuario
    contenido/
      page.js           → selector de sección a editar
      home/
        page.js         → editor de inicio (requiere edit:home)
      organizacion/
        page.js         → editor de org (requiere edit:org)
      equipo/
        page.js         → editor de equipo (requiere edit:team)
      donaciones/
        page.js         → editor de donaciones (requiere edit:donations)
      procesos/
        page.js         → lista de procesos editables
        [slug]/
          page.js       → editor de proceso (requiere edit:processes)
```

---

## 7. Protección de rutas — Middleware

El archivo `middleware.js` en la raíz protege todo `/admin/*`. Usa la sesión de Supabase SSR:

```js
// middleware.js
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { /* getAll/setAll helpers */ } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/register";

  if (pathname.startsWith("/admin") && !isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
```

Para verificar permisos dentro de cada page server component:

```js
// app/admin/contenido/procesos/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function EditProcesoPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  if (!hasPermission(profile, "edit:processes")) redirect("/admin");
  // ...
}
```

---

## 8. Helper de permisos — `lib/permissions.js`

```js
const ROLE_PERMISSIONS = {
  leader: ["edit:home", "edit:org", "edit:team", "edit:donations", "edit:processes", "manage:users"],
  editor: [], // permisos explícitos por usuario
  member: [],
};

/**
 * Verifica si un usuario tiene un permiso.
 * El rol 'leader' tiene todos los permisos implícitamente.
 */
export function hasPermission(user, permission) {
  if (!user || user.status !== "approved") return false;
  if (user.role === "leader") return true;
  return user.permissions?.includes(permission) ?? false;
}

/**
 * Devuelve todos los permisos disponibles para asignar.
 */
export const ALL_PERMISSIONS = [
  { code: "edit:home",      label: "Editar Inicio" },
  { code: "edit:org",       label: "Editar Organización" },
  { code: "edit:team",      label: "Editar Equipo" },
  { code: "edit:donations", label: "Editar Voluntariado/Donaciones" },
  { code: "edit:processes", label: "Editar Procesos y Proyectos" },
  { code: "manage:users",   label: "Gestionar Usuarios" },
];
```

---

## 9. Cómo funciona el editor de contenido

El editor usa un **formulario inline** dentro del panel `/admin/contenido/[seccion]`. Al guardar, escribe directamente en la tabla `site_content` usando la **service role key** del servidor (nunca expuesta al cliente). El sitio público lee con la anon key.

### Flujo de edición de un proceso

```
1. Editor va a /admin/contenido/procesos
2. Ve lista de todos los procesos (slugs)
3. Hace clic en "Editar" en p.ej. "Jovemp"
4. Ve formulario con:
   - Logo actual (puede reemplazar subiendo nueva imagen a Supabase Storage)
   - Descripción (textarea)
   - Pills (lista de tags editables)
   - Cards de servicios (imagen + título + descripción)
5. Hace clic en "Guardar" (Server Action)
6. Server Action escribe en site_content con id = 'proceso:jovemp'
7. Server Action llama revalidateTag('site-content')
8. El sitio público refleja los cambios en la siguiente petición
```

### Actualización del sitio público (ISR + revalidación)

```js
// lib/content.js — lectura pública con caché
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const getProcesoContent = unstable_cache(
  async (slug) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", `proceso:${slug}`)
      .single();
    return data?.data ?? null;
  },
  ["proceso-content"],
  { tags: ["site-content"] }
);
```

```js
// En el Server Action del panel al guardar:
import { revalidateTag } from "next/cache";
// ...guardar en Supabase...
revalidateTag("site-content");
```

---

## 10. Dependencias a instalar

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Variables de entorno a agregar en `.env.local`:

```bash
# Supabase (cliente — puede ser público)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase (servidor — NUNCA exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> **Nota:** No se necesita `nextauth`. Supabase Auth gestiona sesiones nativo con cookies httpOnly via `@supabase/ssr`, sin dependencias adicionales.

---

## 11. Roadmap de implementación

### Fase 1 — Auth base
- [ ] Crear proyecto en [supabase.com](https://supabase.com) (free tier)
- [ ] Correr migraciones SQL: tabla `profiles`, `site_content`, `audit_log` + RLS policies
- [ ] Instalar `@supabase/supabase-js` y `@supabase/ssr`
- [ ] Crear `lib/supabase/client.js` (browser) y `lib/supabase/server.js` (Server Components)
- [ ] Configurar `middleware.js` para proteger `/admin`
- [ ] Página `/admin/login` — formulario con Supabase Auth email/password
- [ ] Página `/admin/register` — crea cuenta + inserta perfil con `status: 'pending'`

### Fase 2 — Gestión de usuarios
- [ ] Seed del primer usuario `leader` (SQL directo en Supabase Dashboard o script)
- [ ] `/admin/usuarios` — lista con filtros (pendiente / aprobado / suspendido)
- [ ] Formulario de aprobación: seleccionar rol + permisos con checkboxes
- [ ] Notificación al líder (email vía EmailJS — ya instalado en el proyecto)

### Fase 3 — Editor de contenido
- [ ] Definir esquema completo de `site_content` (columna `data: jsonb` por sección)
- [ ] Migrar contenido estático actual de `lib/*.js` a Supabase (script de seed SQL/JS)
- [ ] `/admin/contenido/home`
- [ ] `/admin/contenido/organizacion`
- [ ] `/admin/contenido/equipo`
- [ ] `/admin/contenido/donaciones`
- [ ] `/admin/contenido/procesos/[slug]`
- [ ] Subida de imágenes a Supabase Storage con preview y validación MIME/tamaño

### Fase 4 — Sitio público dinámico
- [ ] Actualizar pages públicas para leer desde Firestore (con caché)
- [ ] `revalidateTag` al guardar en el panel
- [ ] Fallback a contenido estático si Firestore falla

### Fase 5 — Pulido
- [ ] Dashboard con estadísticas básicas (usuarios activos, último contenido editado)
- [ ] Historial de cambios por sección (quién editó qué y cuándo)
- [ ] Log de auditoría en Firestore: `audit_log/[id]`

---

## 12. Notas de seguridad

- Las **RLS policies** de Supabase bloquean cualquier escritura directa desde el cliente — toda escritura pasa por Server Actions con la `SUPABASE_SERVICE_ROLE_KEY`, que nunca se expone al navegador.
- La `SUPABASE_SERVICE_ROLE_KEY` nunca debe tener prefijo `NEXT_PUBLIC_`.
- Las rutas de edición deben validar permisos **tanto en middleware como en el server component** (defensa en profundidad).
- El campo `status: 'pending'` impide el acceso aunque el usuario exista en Supabase Auth — la verificación es en `profiles`, no solo en Auth.
- Las imágenes subidas a Supabase Storage deben validar tipo MIME y tamaño máximo en el Server Action antes de aceptarlas.
- Las sesiones de Supabase con `@supabase/ssr` usan cookies httpOnly — no son accesibles desde JavaScript del cliente.
