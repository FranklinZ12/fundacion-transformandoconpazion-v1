-- ============================================================
-- MIGRACIONES — Fundación TCP
-- Ejecutar en Supabase Dashboard → SQL Editor
-- Orden: ejecutar cada bloque en secuencia
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. TABLA: profiles
--    Extiende auth.users con rol, permisos y estado de aprobación
-- ────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default 'member'
                check (role in ('leader', 'editor', 'member')),
  permissions text[] not null default '{}',
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now(),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- El usuario puede leer su propio perfil
create policy "usuario lee su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- El líder puede leer todos los perfiles (para el panel de usuarios)
-- Nota: esta policy la maneja el service role key en el servidor,
-- no se expone al cliente. La dejamos aquí documentada pero la
-- escritura siempre va por service role.

-- ────────────────────────────────────────────────────────────
-- 2. TABLA: site_content
--    Contenido editable del sitio. Una fila por sección.
-- ────────────────────────────────────────────────────────────

create table if not exists public.site_content (
  id         text primary key,
  section    text not null,
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.site_content enable row level security;

-- Lectura pública (el sitio sin login puede leer el contenido)
create policy "lectura publica de contenido"
  on public.site_content for select
  using (true);

-- Escritura solo desde el servidor via service role key (no policy de cliente)


-- ────────────────────────────────────────────────────────────
-- 3. TABLA: audit_log
--    Registro de quién cambió qué y cuándo
-- ────────────────────────────────────────────────────────────

create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id),
  action     text not null,
  target_id  text,
  payload    jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- Solo lectura para el propio usuario (el líder verá todo via service role)
create policy "usuario lee su propio audit"
  on public.audit_log for select
  using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. FUNCIÓN: crear perfil automáticamente al registrarse
--    Se dispara con el trigger de abajo cada vez que un usuario
--    se crea en auth.users
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, role, permissions, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'member',
    '{}',
    'pending'
  );
  return new;
end;
$$;

-- Trigger: se ejecuta tras cada INSERT en auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 5. SEED: primer usuario líder
--    Ejecutar DESPUÉS de que el líder se registre normalmente.
--    Reemplazar 'EMAIL_DEL_LIDER@ejemplo.com' con el email real.
-- ────────────────────────────────────────────────────────────

-- update public.profiles
-- set role = 'leader', status = 'approved'
-- where id = (
--   select id from auth.users where email = 'EMAIL_DEL_LIDER@ejemplo.com'
-- );


-- ────────────────────────────────────────────────────────────
-- 6. STORAGE: bucket para imágenes del sitio
-- ────────────────────────────────────────────────────────────

-- Crear en Supabase Dashboard → Storage → New bucket
-- Nombre: site-images
-- Public: true (las imágenes del sitio son públicas)
--
-- O via SQL:
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Política: lectura pública
create policy "lectura publica imagenes"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Escritura solo desde el servidor (service role key)
-- No se crea policy de insert/update para el cliente
