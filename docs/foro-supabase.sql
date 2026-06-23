-- ============================================================
-- MODULO FORO / TABLERO DE ANUNCIOS - FUNDACION TCP
-- Ejecutar en Supabase SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

-- 1. Tabla de foros (uno por proyecto/proceso)
create table if not exists public.forums (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  coordinator_id uuid references public.profiles(id) on delete set null,
  is_active   boolean not null default true,
  allow_comments boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Migracion: agregar columna allow_comments si no existe
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'forums' and column_name = 'allow_comments'
  ) then
    alter table public.forums add column allow_comments boolean not null default true;
  end if;
end $$;

-- 2. Miembros del foro
create table if not exists public.forum_members (
  id        uuid primary key default gen_random_uuid(),
  forum_id  uuid not null references public.forums(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  status    text not null default 'pending'
              check (status in ('pending','approved','rejected')),
  joined_at timestamptz not null default now(),
  unique(forum_id, user_id)
);

-- 3. Posts / anuncios del foro
create table if not exists public.forum_posts (
  id         uuid primary key default gen_random_uuid(),
  forum_id   uuid not null references public.forums(id) on delete cascade,
  author_id  uuid not null references public.profiles(id),
  title      text not null,
  content    text,
  type       text not null default 'general'
              check (type in ('anuncio','debate','general')),
  is_pinned  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Comentarios en los posts
create table if not exists public.forum_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.forum_posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id),
  content    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indices
create index if not exists idx_forum_members_forum_user on public.forum_members(forum_id, user_id);
create index if not exists idx_forum_members_status on public.forum_members(forum_id, status);
create index if not exists idx_forum_posts_forum on public.forum_posts(forum_id, is_pinned, created_at desc);
create index if not exists idx_forum_comments_post on public.forum_comments(post_id, created_at desc);

-- Habilitar RLS
alter table public.forums enable row level security;
alter table public.forum_members enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;

-- Funciones de ayuda

create or replace function public.forum_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'approved'
      and p.role = 'administrador'
  );
$$;

create or replace function public.forum_is_coordinator(fid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.forums f
    where f.id = fid and f.coordinator_id = auth.uid()
  );
$$;

create or replace function public.forum_is_member(fid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.forum_members fm
    where fm.forum_id = fid
      and fm.user_id = auth.uid()
      and fm.status = 'approved'
  );
$$;

-- POLITICAS

-- forums: lectura publica, escritura solo admin desde servidor

drop policy if exists forums_select_public on public.forums;
create policy forums_select_public
  on public.forums for select
  using (true);

-- forum_members: lectura publica (anonima) para conteos basicos;
--               escritura controlada por server actions con service role.
--               Se permite a usuarios autenticados ver sus propias membresias.

drop policy if exists forum_members_select_public on public.forum_members;
create policy forum_members_select_public
  on public.forum_members for select
  to authenticated
  using (user_id = auth.uid() or public.forum_is_admin() or public.forum_is_coordinator(forum_id));

-- forum_posts: lectura publica

drop policy if exists forum_posts_select_public on public.forum_posts;
create policy forum_posts_select_public
  on public.forum_posts for select
  using (true);

-- forum_comments: lectura publica

drop policy if exists forum_comments_select_public on public.forum_comments;
create policy forum_comments_select_public
  on public.forum_comments for select
  using (true);
