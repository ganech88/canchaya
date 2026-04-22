-- ============================================================================
-- CanchaYa — initial schema
-- ============================================================================
-- Modelo basado en el handoff (README):
--   User · Venue · Court · PriceRule · Booking · BookingParticipant
--   OpenMatch · Product · Sale · ChatMessage
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ── Enums ────────────────────────────────────────────────────────────────────
create type sport          as enum ('futbol5', 'futbol8', 'futbol11', 'padel', 'tenis');
create type user_role      as enum ('player', 'owner', 'admin');
create type booking_status as enum ('pending', 'confirmed', 'paid', 'cancelled', 'done');
create type payment_status as enum ('pending', 'processing', 'paid', 'failed', 'refunded');
create type match_level    as enum ('principiante', 'intermedio', 'avanzado', 'profesional');
create type open_match_status as enum ('open', 'filled', 'expired', 'cancelled');
create type product_category as enum ('bebida', 'comida', 'alquiler', 'otro');

-- ── profiles (extiende auth.users) ───────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role    not null default 'player',
  name        text         not null,
  phone       text,
  email       text         not null,
  avatar_url  text,
  level       match_level,
  bio         text,
  stats_matches int         not null default 0,
  stats_goals   int         not null default 0,
  stats_rating  numeric(3,2) not null default 0,
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);
create index on public.profiles (role);

-- ── venues (complejos) ───────────────────────────────────────────────────────
create table public.venues (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles(id) on delete restrict,
  name         text not null,
  slug         text not null unique,
  description  text,
  address      text not null,
  city         text,
  location     geography(point, 4326),
  sports       sport[] not null default '{}',
  amenities    text[]  not null default '{}',
  photos       text[]  not null default '{}',
  phone        text,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on public.venues using gist (location);
create index on public.venues (owner_id);

-- ── courts ───────────────────────────────────────────────────────────────────
create table public.courts (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete cascade,
  name        text not null,
  sport       sport not null,
  surface     text,          -- 'sintético', 'cemento', 'cristal', etc.
  covered     boolean not null default false,
  base_price  numeric(10,2) not null,
  capacity    int,
  photos      text[] not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index on public.courts (venue_id);
create index on public.courts (sport);

-- ── price rules (precios variables por día/horario) ─────────────────────────
create table public.price_rules (
  id            uuid primary key default gen_random_uuid(),
  court_id      uuid not null references public.courts(id) on delete cascade,
  day_of_week   smallint not null check (day_of_week between 0 and 6),  -- 0=domingo
  hour_start    smallint not null check (hour_start  between 0 and 23),
  hour_end      smallint not null check (hour_end    between 1 and 24),
  price         numeric(10,2) not null,
  discount_rule text,   -- ej. "2x1 los martes", libre
  created_at    timestamptz not null default now(),
  check (hour_end > hour_start)
);
create index on public.price_rules (court_id, day_of_week);

-- ── bookings (reservas) ──────────────────────────────────────────────────────
create table public.bookings (
  id                   uuid primary key default gen_random_uuid(),
  court_id             uuid not null references public.courts(id) on delete restrict,
  host_id              uuid not null references public.profiles(id) on delete restrict,
  starts_at            timestamptz not null,
  ends_at              timestamptz not null,
  total                numeric(10,2) not null,
  status               booking_status not null default 'pending',
  party_size           int not null default 1,
  notes                text,
  payment_provider     text,              -- 'mercado_pago' | 'stripe' | null
  external_payment_id  text,
  payment_status       payment_status not null default 'pending',
  cancelled_at         timestamptz,
  cancelled_reason     text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index on public.bookings (court_id, starts_at);
create index on public.bookings (host_id);
create index on public.bookings (status);

-- Evita doble-reserva del mismo court en el mismo timeslot (solo si no cancelado)
create unique index bookings_court_no_overlap
  on public.bookings (court_id, starts_at)
  where status in ('pending', 'confirmed', 'paid');

-- ── booking participants (split payments) ────────────────────────────────────
create table public.booking_participants (
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  paid_amount  numeric(10,2) not null default 0,
  paid_at      timestamptz,
  joined_at    timestamptz not null default now(),
  primary key (booking_id, user_id)
);
create index on public.booking_participants (user_id);

-- ── open matches (partidos abiertos) ─────────────────────────────────────────
create table public.open_matches (
  id                 uuid primary key default gen_random_uuid(),
  booking_id         uuid not null unique references public.bookings(id) on delete cascade,
  spots_total        int not null check (spots_total > 0),
  spots_filled       int not null default 0,
  level              match_level not null,
  price_per_player   numeric(10,2) not null,
  visible_radius_km  numeric(5,2) not null default 5,
  status             open_match_status not null default 'open',
  expires_at         timestamptz not null,
  created_at         timestamptz not null default now(),
  check (spots_filled <= spots_total)
);
create index on public.open_matches (status, expires_at);

-- ── products (bebidas/comida/alquiler en el complejo) ────────────────────────
create table public.products (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  name       text not null,
  category   product_category not null,
  price      numeric(10,2) not null,
  cost       numeric(10,2),
  stock      int not null default 0,
  stock_min  int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.products (venue_id);

-- ── sales (ventas de productos) ──────────────────────────────────────────────
create table public.sales (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete restrict,
  booking_id  uuid references public.bookings(id) on delete set null,
  items       jsonb not null,   -- [{product_id, qty, unit_price}]
  total       numeric(10,2) not null,
  paid_at     timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index on public.sales (venue_id, paid_at desc);
create index on public.sales (booking_id);

-- ── chat messages (chat del partido) ─────────────────────────────────────────
create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  text        text,
  kind        text not null default 'user', -- 'user' | 'system'
  meta        jsonb,                         -- eventos: {type:'paid', amount:3000, user_id:...}
  created_at  timestamptz not null default now()
);
create index on public.chat_messages (booking_id, created_at);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.tg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.tg_touch_updated_at();
create trigger venues_touch before update on public.venues
  for each row execute function public.tg_touch_updated_at();
create trigger bookings_touch before update on public.bookings
  for each row execute function public.tg_touch_updated_at();

-- ── helpers ──────────────────────────────────────────────────────────────────
-- Auto-crear profile al registrarse en auth.users.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'player')
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
