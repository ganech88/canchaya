-- ============================================================================
-- CanchaYa — Row Level Security
-- ============================================================================
-- Política general:
--   - `player` puede leer venues/courts públicos, sus propias bookings, y chat de partidos donde está.
--   - `owner` puede leer/escribir venues/courts/products/sales/bookings de SUS venues.
--   - `admin` ve todo (bypass).
-- Todas las tablas con RLS enabled; el anon key no ve nada sin auth.
-- ============================================================================

alter table public.profiles             enable row level security;
alter table public.venues               enable row level security;
alter table public.courts               enable row level security;
alter table public.price_rules          enable row level security;
alter table public.bookings             enable row level security;
alter table public.booking_participants enable row level security;
alter table public.open_matches         enable row level security;
alter table public.products             enable row level security;
alter table public.sales                enable row level security;
alter table public.chat_messages        enable row level security;

-- ── helpers ─────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_venue(venue uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.venues where id = venue and owner_id = auth.uid()
  );
$$;

create or replace function public.participates_in_booking(b uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.bookings where id = b and host_id = auth.uid()
    union all
    select 1 from public.booking_participants where booking_id = b and user_id = auth.uid()
  );
$$;

-- ── profiles ────────────────────────────────────────────────────────────────
create policy "profiles: self read" on public.profiles
  for select using (id = auth.uid() or is_admin());

create policy "profiles: public minimal read" on public.profiles
  for select using (true);
-- NOTA: el select anterior expone id/name/avatar/stats. Si se quiere ocultar email/phone,
-- en vez de columnas sensibles directas conviene usar una vista o column privileges.

create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── venues ──────────────────────────────────────────────────────────────────
create policy "venues: public read active" on public.venues
  for select using (active = true or owner_id = auth.uid() or is_admin());

create policy "venues: owner write" on public.venues
  for all using (owner_id = auth.uid() or is_admin())
         with check (owner_id = auth.uid() or is_admin());

-- ── courts ──────────────────────────────────────────────────────────────────
create policy "courts: public read" on public.courts
  for select using (
    active = true
    or owns_venue(venue_id)
    or is_admin()
  );

create policy "courts: owner write" on public.courts
  for all using (owns_venue(venue_id) or is_admin())
         with check (owns_venue(venue_id) or is_admin());

-- ── price_rules ─────────────────────────────────────────────────────────────
create policy "price_rules: public read" on public.price_rules
  for select using (true);

create policy "price_rules: owner write" on public.price_rules
  for all using (
    exists (
      select 1 from public.courts c
      where c.id = court_id and owns_venue(c.venue_id)
    ) or is_admin()
  )
  with check (
    exists (
      select 1 from public.courts c
      where c.id = court_id and owns_venue(c.venue_id)
    ) or is_admin()
  );

-- ── bookings ────────────────────────────────────────────────────────────────
create policy "bookings: host + participants + venue owner read" on public.bookings
  for select using (
    host_id = auth.uid()
    or exists (select 1 from public.booking_participants bp where bp.booking_id = id and bp.user_id = auth.uid())
    or exists (select 1 from public.courts c where c.id = court_id and owns_venue(c.venue_id))
    or is_admin()
  );

create policy "bookings: host insert" on public.bookings
  for insert with check (host_id = auth.uid());

create policy "bookings: host + owner update" on public.bookings
  for update using (
    host_id = auth.uid()
    or exists (select 1 from public.courts c where c.id = court_id and owns_venue(c.venue_id))
    or is_admin()
  );

-- ── booking_participants ────────────────────────────────────────────────────
create policy "booking_participants: visible to booking stakeholders" on public.booking_participants
  for select using (
    user_id = auth.uid()
    or participates_in_booking(booking_id)
    or exists (
      select 1 from public.bookings b
      join public.courts c on c.id = b.court_id
      where b.id = booking_id and owns_venue(c.venue_id)
    )
    or is_admin()
  );

create policy "booking_participants: self join" on public.booking_participants
  for insert with check (user_id = auth.uid());

create policy "booking_participants: self leave" on public.booking_participants
  for delete using (user_id = auth.uid() or is_admin());

-- ── open_matches ────────────────────────────────────────────────────────────
create policy "open_matches: public read open" on public.open_matches
  for select using (status = 'open' or participates_in_booking(booking_id) or is_admin());

create policy "open_matches: host write" on public.open_matches
  for all using (participates_in_booking(booking_id) or is_admin())
         with check (participates_in_booking(booking_id) or is_admin());

-- ── products ────────────────────────────────────────────────────────────────
create policy "products: owner read+write" on public.products
  for all using (owns_venue(venue_id) or is_admin())
         with check (owns_venue(venue_id) or is_admin());

-- ── sales ───────────────────────────────────────────────────────────────────
create policy "sales: owner read+write" on public.sales
  for all using (owns_venue(venue_id) or is_admin())
         with check (owns_venue(venue_id) or is_admin());

-- ── chat_messages ───────────────────────────────────────────────────────────
create policy "chat: participants read" on public.chat_messages
  for select using (
    participates_in_booking(booking_id)
    or exists (
      select 1 from public.bookings b
      join public.courts c on c.id = b.court_id
      where b.id = booking_id and owns_venue(c.venue_id)
    )
    or is_admin()
  );

create policy "chat: participants insert" on public.chat_messages
  for insert with check (
    user_id = auth.uid() and participates_in_booking(booking_id) and kind = 'user'
  );
