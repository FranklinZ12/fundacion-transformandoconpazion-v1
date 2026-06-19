-- ============================================================
-- MODULO CLUB DEPORTIVO - FUNDACION TCP
-- Ejecutar en Supabase SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.sports_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sports_user_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.sports_categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create table if not exists public.sports_athletes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete set null,
  category_id uuid not null references public.sports_categories(id) on delete restrict,
  full_name text not null,
  birth_date date,
  height_cm numeric(6,2),
  weight_kg numeric(6,2),
  physical_status text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

alter table public.sports_athletes add column if not exists user_id uuid references public.profiles(id) on delete set null;
create unique index if not exists idx_sports_athletes_user_unique on public.sports_athletes(user_id) where user_id is not null;

create table if not exists public.sports_trainings (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.sports_categories(id) on delete cascade,
  weekday int not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.sports_matches (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.sports_categories(id) on delete cascade,
  match_date timestamptz not null,
  opponent text not null,
  location text,
  status text not null default 'programado' check (status in ('programado','jugado','cancelado')),
  created_at timestamptz not null default now()
);

create table if not exists public.sports_finance (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.sports_athletes(id) on delete cascade,
  period text not null,
  balance numeric(10,2) not null default 0,
  status text not null default 'paz_y_salvo' check (status in ('paz_y_salvo','deuda')),
  notes text,
  updated_at timestamptz not null default now(),
  unique (athlete_id, period)
);

create index if not exists idx_sports_athletes_category on public.sports_athletes(category_id);
create index if not exists idx_sports_matches_category_date on public.sports_matches(category_id, match_date);
create index if not exists idx_sports_trainings_category on public.sports_trainings(category_id);
create index if not exists idx_sports_finance_athlete on public.sports_finance(athlete_id);

insert into public.sports_categories(code, name)
values
  ('libre', 'Libre'),
  ('sub12', 'Sub 12'),
  ('sub15', 'Sub 15'),
  ('sub21', 'Sub 21')
on conflict (code) do nothing;

alter table public.sports_categories enable row level security;
alter table public.sports_user_categories enable row level security;
alter table public.sports_athletes enable row level security;
alter table public.sports_trainings enable row level security;
alter table public.sports_matches enable row level security;
alter table public.sports_finance enable row level security;

create or replace function public.sports_is_admin()
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

create or replace function public.sports_has_category(cat_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.sports_user_categories suc
    where suc.user_id = auth.uid()
      and suc.category_id = cat_id
  );
$$;

-- categorias
drop policy if exists sports_categories_select on public.sports_categories;
create policy sports_categories_select
on public.sports_categories for select
to authenticated
using (true);

-- asignaciones
drop policy if exists sports_user_categories_select_own_or_admin on public.sports_user_categories;
create policy sports_user_categories_select_own_or_admin
on public.sports_user_categories for select
to authenticated
using (user_id = auth.uid() or public.sports_is_admin());

drop policy if exists sports_user_categories_manage_admin on public.sports_user_categories;
create policy sports_user_categories_manage_admin
on public.sports_user_categories for all
to authenticated
using (public.sports_is_admin())
with check (public.sports_is_admin());

-- deportistas
drop policy if exists sports_athletes_select_scoped on public.sports_athletes;
create policy sports_athletes_select_scoped
on public.sports_athletes for select
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id));

drop policy if exists sports_athletes_manage_scoped on public.sports_athletes;
create policy sports_athletes_manage_scoped
on public.sports_athletes for all
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id))
with check (public.sports_is_admin() or public.sports_has_category(category_id));

-- entrenamientos
drop policy if exists sports_trainings_select_scoped on public.sports_trainings;
create policy sports_trainings_select_scoped
on public.sports_trainings for select
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id));

drop policy if exists sports_trainings_manage_scoped on public.sports_trainings;
create policy sports_trainings_manage_scoped
on public.sports_trainings for all
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id))
with check (public.sports_is_admin() or public.sports_has_category(category_id));

-- partidos
drop policy if exists sports_matches_select_scoped on public.sports_matches;
create policy sports_matches_select_scoped
on public.sports_matches for select
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id));

drop policy if exists sports_matches_manage_scoped on public.sports_matches;
create policy sports_matches_manage_scoped
on public.sports_matches for all
to authenticated
using (public.sports_is_admin() or public.sports_has_category(category_id))
with check (public.sports_is_admin() or public.sports_has_category(category_id));

-- estado financiero (valida contra categoria del deportista)
drop policy if exists sports_finance_select_scoped on public.sports_finance;
create policy sports_finance_select_scoped
on public.sports_finance for select
to authenticated
using (
  public.sports_is_admin() or exists (
    select 1
    from public.sports_athletes a
    where a.id = athlete_id
      and public.sports_has_category(a.category_id)
  )
);

drop policy if exists sports_finance_manage_scoped on public.sports_finance;
create policy sports_finance_manage_scoped
on public.sports_finance for all
to authenticated
using (
  public.sports_is_admin() or exists (
    select 1
    from public.sports_athletes a
    where a.id = athlete_id
      and public.sports_has_category(a.category_id)
  )
)
with check (
  public.sports_is_admin() or exists (
    select 1
    from public.sports_athletes a
    where a.id = athlete_id
      and public.sports_has_category(a.category_id)
  )
);
