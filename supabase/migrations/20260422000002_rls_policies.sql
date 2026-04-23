-- ============================================================================
-- CanchaYa — Row Level Security
-- ============================================================================
-- Catálogos (countries, sports, amenities) son public-read sin RLS.
-- Venues/courts/reviews son read-public (solo active=true para non-owners).
-- Owners ven/editan sus propios venues. Players ven lo suyo.
-- ============================================================================

-- ── catálogos: RLS off (lectura pública) ────────────────────────────────────
alter table public.countries       enable row level security;
alter table public.sports          enable row level security;
alter table public.amenities       enable row level security;

create policy "countries: public read" on public.countries
  for select using (active = true);
create policy "sports: public read" on public.sports
  for select using (active = true);
create policy "amenities: public read" on public.amenities
  for select using (true);

-- Catálogos solo se editan por admin
create policy "countries: admin write" on public.countries
  for all using (public.is_admin()) with check (public.is_admin());
create policy "sports: admin write" on public.sports
  for all using (public.is_admin()) with check (public.is_admin());
create policy "amenities: admin write" on public.amenities
  for all using (public.is_admin()) with check (public.is_admin());

-- ── resto con RLS ───────────────────────────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.venues               enable row level security;
alter table public.venue_sports         enable row level security;
alter table public.venue_amenities      enable row level security;
alter table public.business_hours       enable row level security;
alter table public.venue_closures       enable row level security;
alter table public.courts               enable row level security;
alter table public.price_rules          enable row level security;
alter table public.bookings             enable row level security;
alter table public.booking_participants enable row level security;
alter table public.open_matches         enable row level security;
alter table public.reviews              enable row level security;
alter table public.products             enable row level security;
alter table public.sales                enable row level security;
alter table public.chat_messages        enable row level security;

-- ── helpers ─────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.owns_venue(venue uuid)
returns boolean language sql stable as $$
  select exists (select 1 from public.venues where id = venue and owner_id = auth.uid());
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
-- Lectura pública minimal (id, name, avatar, stats); columnas sensibles (email/phone/birth_date)
-- requieren row-policies que validen ownership. Para MVP leemos todo el row pero ocultamos
-- columnas sensibles en el cliente vía vistas cuando haga falta.
create policy "profiles: public read" on public.profiles
  for select using (true);

create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── venues ──────────────────────────────────────────────────────────────────
create policy "venues: public read active" on public.venues
  for select using (active = true or owner_id = auth.uid() or public.is_admin());

create policy "venues: owner write" on public.venues
  for all using (owner_id = auth.uid() or public.is_admin())
         with check (owner_id = auth.uid() or public.is_admin());

-- ── venue_sports ────────────────────────────────────────────────────────────
create policy "venue_sports: public read" on public.venue_sports
  for select using (true);

create policy "venue_sports: owner write" on public.venue_sports
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── venue_amenities ─────────────────────────────────────────────────────────
create policy "venue_amenities: public read" on public.venue_amenities
  for select using (true);

create policy "venue_amenities: owner write" on public.venue_amenities
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── business_hours ──────────────────────────────────────────────────────────
create policy "business_hours: public read" on public.business_hours
  for select using (true);

create policy "business_hours: owner write" on public.business_hours
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── venue_closures ──────────────────────────────────────────────────────────
create policy "venue_closures: public read" on public.venue_closures
  for select using (true);

create policy "venue_closures: owner write" on public.venue_closures
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── courts ──────────────────────────────────────────────────────────────────
create policy "courts: public read" on public.courts
  for select using (active = true or public.owns_venue(venue_id) or public.is_admin());

create policy "courts: owner write" on public.courts
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── price_rules ─────────────────────────────────────────────────────────────
create policy "price_rules: public read" on public.price_rules
  for select using (true);

create policy "price_rules: owner write" on public.price_rules
  for all using (
    exists (select 1 from public.courts c where c.id = court_id and public.owns_venue(c.venue_id))
    or public.is_admin()
  ) with check (
    exists (select 1 from public.courts c where c.id = court_id and public.owns_venue(c.venue_id))
    or public.is_admin()
  );

-- ── bookings ────────────────────────────────────────────────────────────────
create policy "bookings: stakeholders read" on public.bookings
  for select using (
    host_id = auth.uid()
    or exists (select 1 from public.booking_participants bp where bp.booking_id = id and bp.user_id = auth.uid())
    or exists (select 1 from public.courts c where c.id = court_id and public.owns_venue(c.venue_id))
    or public.is_admin()
  );

create policy "bookings: host insert" on public.bookings
  for insert with check (host_id = auth.uid());

create policy "bookings: host + owner update" on public.bookings
  for update using (
    host_id = auth.uid()
    or exists (select 1 from public.courts c where c.id = court_id and public.owns_venue(c.venue_id))
    or public.is_admin()
  );

-- ── booking_participants ────────────────────────────────────────────────────
create policy "booking_participants: stakeholders read" on public.booking_participants
  for select using (
    user_id = auth.uid()
    or public.participates_in_booking(booking_id)
    or exists (
      select 1 from public.bookings b
      join public.courts c on c.id = b.court_id
      where b.id = booking_id and public.owns_venue(c.venue_id)
    )
    or public.is_admin()
  );

create policy "booking_participants: self join" on public.booking_participants
  for insert with check (user_id = auth.uid());

create policy "booking_participants: self leave" on public.booking_participants
  for delete using (user_id = auth.uid() or public.is_admin());

-- ── open_matches ────────────────────────────────────────────────────────────
create policy "open_matches: public read open" on public.open_matches
  for select using (status = 'open' or public.participates_in_booking(booking_id) or public.is_admin());

create policy "open_matches: host write" on public.open_matches
  for all using (public.participates_in_booking(booking_id) or public.is_admin())
         with check (public.participates_in_booking(booking_id) or public.is_admin());

-- ── reviews ─────────────────────────────────────────────────────────────────
create policy "reviews: public read" on public.reviews
  for select using (true);

-- Un usuario puede reviewar una booking en la que participó y está 'done'.
create policy "reviews: participants insert after done" on public.reviews
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.status = 'done'
        and (b.host_id = auth.uid() or exists (
          select 1 from public.booking_participants bp
          where bp.booking_id = b.id and bp.user_id = auth.uid()
        ))
    )
  );

create policy "reviews: self update or delete" on public.reviews
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reviews: self delete" on public.reviews
  for delete using (user_id = auth.uid() or public.is_admin());

-- ── products ────────────────────────────────────────────────────────────────
create policy "products: owner read+write" on public.products
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── sales ───────────────────────────────────────────────────────────────────
create policy "sales: owner read+write" on public.sales
  for all using (public.owns_venue(venue_id) or public.is_admin())
         with check (public.owns_venue(venue_id) or public.is_admin());

-- ── chat_messages ───────────────────────────────────────────────────────────
create policy "chat: participants read" on public.chat_messages
  for select using (
    public.participates_in_booking(booking_id)
    or exists (
      select 1 from public.bookings b
      join public.courts c on c.id = b.court_id
      where b.id = booking_id and public.owns_venue(c.venue_id)
    )
    or public.is_admin()
  );

create policy "chat: participants insert" on public.chat_messages
  for insert with check (
    user_id = auth.uid() and public.participates_in_booking(booking_id) and kind = 'user'
  );
