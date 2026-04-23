-- ============================================================================
-- CanchaYa — schema inicial (consolidado post-análisis de atcsports)
-- ============================================================================
-- Cambios notables vs. draft original:
--   • Catálogos normalizados: countries, sports (jerárquico), amenities.
--   • venues.sports[] → tabla de join venue_sports.
--   • venues.amenities[] → tabla de join venue_amenities.
--   • Money como integer cents. Currency a nivel de country/venue.
--   • business_hours + venue_closures (feriados / cierres ad-hoc).
--   • reviews con aggregates denormalizados en venues.
--   • Seña/balance en bookings + cancellation_hours_notice por venue.
--   • profiles: gender + birth_date para matchmaking.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ── Enums ────────────────────────────────────────────────────────────────────
create type user_role         as enum ('player', 'owner', 'admin');
create type booking_status    as enum ('pending', 'confirmed', 'paid', 'cancelled', 'done');
create type payment_status    as enum ('pending', 'processing', 'paid', 'failed', 'refunded');
create type match_level       as enum ('principiante', 'intermedio', 'avanzado', 'profesional');
create type open_match_status as enum ('open', 'filled', 'expired', 'cancelled');
create type product_category  as enum ('bebida', 'comida', 'alquiler', 'otro');
create type gender_option     as enum ('m', 'f', 'x', 'prefiero_no_decir');
create type gender_filter     as enum ('any', 'm', 'f');
create type day_of_week_code  as enum ('MO','TU','WE','TH','FR','SA','SU','HO');

-- ── countries (catálogo LATAM, default AR) ──────────────────────────────────
create table public.countries (
  id          smallint primary key,
  code        char(2)   unique not null,    -- ISO 3166-1 alpha-2
  name        text      not null,
  currency    char(3)   not null,            -- ISO 4217
  timezone    text      not null,
  phone_code  text      not null,            -- '+54'
  active      boolean   not null default true,
  is_default  boolean   not null default false
);
create unique index countries_one_default on public.countries (is_default) where is_default = true;

-- ── sports (jerárquico — Fútbol → F5/F7/F8/F11) ─────────────────────────────
create table public.sports (
  id                smallint primary key,
  code              text       unique not null,
  name              text       not null,
  parent_id         smallint   references public.sports(id) on delete restrict,
  default_duration  smallint   not null,                  -- minutos
  players_min       smallint   not null,
  players_max       smallint   not null,
  order_index       smallint   not null default 0,
  icon              text,
  active            boolean    not null default true
);
create index on public.sports (parent_id);
create index on public.sports (order_index);

-- ── amenities (catálogo compartido con iconos) ──────────────────────────────
create table public.amenities (
  id          smallserial primary key,
  code        text unique not null,
  name        text not null,
  icon        text,
  order_index smallint not null default 0
);

-- ── profiles (extiende auth.users) ──────────────────────────────────────────
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           user_role    not null default 'player',
  country_id     smallint     references public.countries(id),
  name           text         not null,
  phone          text,
  email          text         not null,
  avatar_url     text,
  gender         gender_option,
  birth_date     date,
  level          match_level,
  bio            text,
  stats_matches  int          not null default 0,
  stats_goals    int          not null default 0,
  stats_rating   numeric(3,2) not null default 0,          -- rating agregado 0-5
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);
create index on public.profiles (role);
create index on public.profiles (country_id);

-- ── venues (complejos) ──────────────────────────────────────────────────────
create table public.venues (
  id                         uuid primary key default gen_random_uuid(),
  owner_id                   uuid not null references public.profiles(id) on delete restrict,
  country_id                 smallint not null references public.countries(id),
  name                       text not null,
  slug                       text not null unique,                   -- permalink
  description                text,
  address                    text not null,
  city                       text,
  location                   geography(point, 4326),
  geohash                    text,
  phone                      text,
  photos                     text[] not null default '{}',
  logo_url                   text,
  background_url             text,
  active                     boolean not null default true,
  -- Políticas por venue
  deposit_percent            smallint not null default 50 check (deposit_percent between 0 and 100),
  cancellation_hours_notice  smallint not null default 24 check (cancellation_hours_notice >= 0),
  -- Feature flags por venue
  has_recording              boolean not null default false,         -- Beelup-like
  -- Rating agregado (actualizado por trigger de reviews)
  rating_stars               numeric(3,2) not null default 0,
  rating_count               int not null default 0,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);
create index on public.venues using gist (location);
create index on public.venues (owner_id);
create index on public.venues (country_id);
create index on public.venues (geohash);

-- ── venue_sports (qué deportes se ofrecen) ──────────────────────────────────
create table public.venue_sports (
  venue_id  uuid      not null references public.venues(id) on delete cascade,
  sport_id  smallint  not null references public.sports(id) on delete restrict,
  primary key (venue_id, sport_id)
);

-- ── venue_amenities ──────────────────────────────────────────────────────────
create table public.venue_amenities (
  venue_id     uuid      not null references public.venues(id) on delete cascade,
  amenity_id   smallint  not null references public.amenities(id) on delete restrict,
  primary key (venue_id, amenity_id)
);

-- ── business_hours (con soporte de feriados via day_of_week='HO') ───────────
create table public.business_hours (
  id           bigserial primary key,
  venue_id     uuid not null references public.venues(id) on delete cascade,
  day_of_week  day_of_week_code not null,
  open_time    time not null,
  close_time   time not null,
  check (close_time > open_time)
);
create unique index business_hours_unique on public.business_hours (venue_id, day_of_week, open_time);
create index on public.business_hours (venue_id);

-- ── venue_closures (cierres ad-hoc / mantenimiento por fecha) ───────────────
create table public.venue_closures (
  id          bigserial primary key,
  venue_id    uuid not null references public.venues(id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index on public.venue_closures (venue_id, starts_at);

-- ── courts ──────────────────────────────────────────────────────────────────
create table public.courts (
  id                uuid primary key default gen_random_uuid(),
  venue_id          uuid not null references public.venues(id) on delete cascade,
  sport_id          smallint not null references public.sports(id) on delete restrict,
  name              text not null,
  surface           text,
  covered           boolean not null default false,
  base_price_cents  integer not null check (base_price_cents >= 0),
  capacity          int,
  photos            text[] not null default '{}',
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);
create index on public.courts (venue_id);
create index on public.courts (sport_id);

-- ── price_rules (precios variables por día/horario) ─────────────────────────
create table public.price_rules (
  id            uuid primary key default gen_random_uuid(),
  court_id      uuid not null references public.courts(id) on delete cascade,
  day_of_week   smallint not null check (day_of_week between 0 and 6),   -- 0=domingo
  hour_start    smallint not null check (hour_start between 0 and 23),
  hour_end      smallint not null check (hour_end between 1 and 24),
  price_cents   integer  not null check (price_cents >= 0),
  discount_rule text,
  created_at    timestamptz not null default now(),
  check (hour_end > hour_start)
);
create index on public.price_rules (court_id, day_of_week);

-- ── bookings (reservas) ─────────────────────────────────────────────────────
create table public.bookings (
  id                          uuid primary key default gen_random_uuid(),
  court_id                    uuid not null references public.courts(id) on delete restrict,
  host_id                     uuid not null references public.profiles(id) on delete restrict,
  starts_at                   timestamptz not null,
  ends_at                     timestamptz not null,
  total_cents                 integer not null check (total_cents >= 0),
  deposit_cents               integer not null default 0 check (deposit_cents >= 0),
  balance_cents               integer not null default 0 check (balance_cents >= 0),
  -- snapshot de la política de cancelación al momento de la reserva
  cancellation_hours_notice   smallint not null default 24,
  status                      booking_status not null default 'pending',
  party_size                  int not null default 1,
  notes                       text,
  has_recording               boolean not null default false,           -- opt-in si el venue lo ofrece
  payment_provider            text,                                     -- 'mercado_pago' | 'stripe' | null
  external_payment_id         text,
  payment_status              payment_status not null default 'pending',
  cancelled_at                timestamptz,
  cancelled_reason            text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  check (ends_at > starts_at),
  check (deposit_cents + balance_cents >= total_cents - 1)  -- tolerancia 1 centavo por redondeo
);
create index on public.bookings (court_id, starts_at);
create index on public.bookings (host_id);
create index on public.bookings (status);
create unique index bookings_court_no_overlap
  on public.bookings (court_id, starts_at)
  where status in ('pending', 'confirmed', 'paid');

-- ── booking_participants (split payments) ───────────────────────────────────
create table public.booking_participants (
  booking_id        uuid not null references public.bookings(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  paid_amount_cents integer not null default 0 check (paid_amount_cents >= 0),
  paid_at           timestamptz,
  joined_at         timestamptz not null default now(),
  primary key (booking_id, user_id)
);
create index on public.booking_participants (user_id);

-- ── open_matches (partidos abiertos + filtros de comunidad) ─────────────────
create table public.open_matches (
  id                      uuid primary key default gen_random_uuid(),
  booking_id              uuid not null unique references public.bookings(id) on delete cascade,
  spots_total             int not null check (spots_total > 0),
  spots_filled            int not null default 0,
  level                   match_level not null,
  price_per_player_cents  integer not null check (price_per_player_cents >= 0),
  visible_radius_km       numeric(5,2) not null default 5,
  -- Filtros de comunidad (opcionales — 'any' + null = sin restricción)
  gender_filter           gender_filter not null default 'any',
  age_min                 smallint check (age_min is null or age_min >= 0),
  age_max                 smallint check (age_max is null or age_max >= age_min),
  status                  open_match_status not null default 'open',
  expires_at              timestamptz not null,
  created_at              timestamptz not null default now(),
  check (spots_filled <= spots_total)
);
create index on public.open_matches (status, expires_at);

-- ── reviews (del venue por parte de hosts/participants) ─────────────────────
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete set null,
  stars       smallint not null check (stars between 1 and 5),
  text        text,
  created_at  timestamptz not null default now()
);
-- 1 review por (user, booking) — evita spam
create unique index reviews_unique_per_booking on public.reviews (user_id, booking_id) where booking_id is not null;
create index on public.reviews (venue_id, created_at desc);

-- ── products (bebidas/comida/alquiler del complejo) ─────────────────────────
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete cascade,
  name        text not null,
  category    product_category not null,
  price_cents integer not null check (price_cents >= 0),
  cost_cents  integer,
  stock       int not null default 0,
  stock_min   int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index on public.products (venue_id);

-- ── sales (ventas de productos) ─────────────────────────────────────────────
create table public.sales (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete restrict,
  booking_id  uuid references public.bookings(id) on delete set null,
  items       jsonb not null,                               -- [{product_id, qty, unit_price_cents}]
  total_cents integer not null check (total_cents >= 0),
  paid_at     timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index on public.sales (venue_id, paid_at desc);
create index on public.sales (booking_id);

-- ── chat_messages (chat del partido) ────────────────────────────────────────
create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  text        text,
  kind        text not null default 'user',                 -- 'user' | 'system'
  meta        jsonb,                                         -- {type:'paid', amount_cents:..., user_id:...}
  created_at  timestamptz not null default now()
);
create index on public.chat_messages (booking_id, created_at);

-- ── updated_at trigger ──────────────────────────────────────────────────────
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

-- ── handle_new_user: crea profile con country default al signup ─────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_country_id smallint;
begin
  select id into v_country_id from public.countries where is_default = true limit 1;
  insert into public.profiles (id, name, email, role, country_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'player'),
    v_country_id
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── reviews → venues rating aggregates ──────────────────────────────────────
create or replace function public.tg_refresh_venue_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v uuid;
begin
  v := coalesce(new.venue_id, old.venue_id);
  update public.venues
  set rating_stars = coalesce((select round(avg(stars)::numeric, 2) from public.reviews where venue_id = v), 0),
      rating_count = coalesce((select count(*) from public.reviews where venue_id = v), 0)
  where id = v;
  return coalesce(new, old);
end; $$;

create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.tg_refresh_venue_rating();

-- ── available slots (helper que reemplaza la grilla del cliente) ────────────
-- Devuelve los slots disponibles para una cancha en una fecha y duración dadas.
-- NO considera price_rules aún (v1 usa base_price_cents); se extiende en seguimiento.
create or replace function public.available_slots(
  p_court_id uuid,
  p_date     date,
  p_duration_minutes smallint default 60
)
returns table (
  start_at   timestamptz,
  end_at     timestamptz,
  price_cents integer
)
language plpgsql
stable
as $$
declare
  v_tz         text;
  v_open_time  time;
  v_close_time time;
  v_dow_code   day_of_week_code;
  v_base_price integer;
  v_venue_id   uuid;
  v_slot_start timestamptz;
  v_slot_end   timestamptz;
begin
  select c.base_price_cents, c.venue_id into v_base_price, v_venue_id
  from public.courts c where c.id = p_court_id and c.active = true;
  if v_venue_id is null then return; end if;

  select co.timezone into v_tz
  from public.venues v join public.countries co on co.id = v.country_id
  where v.id = v_venue_id;

  v_dow_code := case extract(isodow from p_date)::int
    when 1 then 'MO' when 2 then 'TU' when 3 then 'WE' when 4 then 'TH'
    when 5 then 'FR' when 6 then 'SA' when 7 then 'SU' end;

  select open_time, close_time into v_open_time, v_close_time
  from public.business_hours
  where venue_id = v_venue_id and day_of_week = v_dow_code
  order by open_time limit 1;

  if v_open_time is null then return; end if;

  v_slot_start := (p_date + v_open_time) at time zone v_tz;

  while v_slot_start + (p_duration_minutes || ' minutes')::interval
        <= (p_date + v_close_time) at time zone v_tz loop
    v_slot_end := v_slot_start + (p_duration_minutes || ' minutes')::interval;

    -- ¿choca con una reserva?
    if not exists (
      select 1 from public.bookings b
      where b.court_id = p_court_id
        and b.status in ('pending','confirmed','paid')
        and b.starts_at < v_slot_end and b.ends_at > v_slot_start
    ) and not exists (
      -- ¿choca con un cierre del venue?
      select 1 from public.venue_closures c
      where c.venue_id = v_venue_id
        and c.starts_at < v_slot_end and c.ends_at > v_slot_start
    ) then
      start_at := v_slot_start;
      end_at   := v_slot_end;
      price_cents := v_base_price;
      return next;
    end if;

    v_slot_start := v_slot_start + '30 minutes'::interval;  -- cadencia de 30'
  end loop;
  return;
end; $$;
