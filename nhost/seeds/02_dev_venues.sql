-- ============================================================================
-- Dev seed: venues + courts (owned by un system user)
-- ============================================================================
-- Crea un user "system" en auth.users con un UUID fijo, su profile con role=owner,
-- y 6 venues con sus courts. Idempotente: re-correr no duplica.
-- ============================================================================

-- ── System owner ────────────────────────────────────────────────────────────
do $$
declare
  v_system_id constant uuid := '00000000-0000-0000-0000-000000000001';
begin
  -- auth.users (Nhost-managed, pero podemos insertar con admin)
  insert into auth.users (id, email, display_name, locale, email_verified, default_role, password_hash)
  values (v_system_id, 'system@canchaya.local', 'System Owner', 'es', true, 'owner', '$2a$10$dev.placeholder.hash')
  on conflict (id) do nothing;

  -- Profile asociado
  insert into public.profiles (id, name, email, role, country_id)
  values (
    v_system_id,
    'CanchaYa Dev',
    'system@canchaya.local',
    'owner',
    (select id from public.countries where is_default = true limit 1)
  )
  on conflict (id) do nothing;
end $$;

-- ── Venues ──────────────────────────────────────────────────────────────────
-- IDs fijos para que sean idempotentes y los slugs estables (los mocks ya los usan).
insert into public.venues (
  id, owner_id, country_id, name, slug, description, address, city,
  latitude, longitude, phone, photos, deposit_percent, cancellation_hours_notice,
  has_recording, rating_stars, rating_count, active
) values
  ('11111111-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'La Bombonerita', 'la-bombonerita',
   'Cinco canchas de F5 en el corazón de Palermo. Parrilla, vestuarios y bar abiertos al público.',
   'Av. Santa Fe 4521, Palermo', 'Palermo',
   -34.5836, -58.4222, '+54 11 4778-1234', '{}',
   50, 24, true, 4.9, 284, true),

  ('11111111-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'Pádel Club Sur', 'padel-club-sur',
   'Cuatro canchas de pádel cubiertas. Profes los fines de semana, alquiler de paletas.',
   'Av. Rivadavia 5800, Caballito', 'Caballito',
   -34.6189, -58.4392, '+54 11 4901-5678', '{}',
   40, 12, false, 4.7, 142, true),

  ('11111111-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'El Potrero', 'el-potrero',
   'Tres canchas de F8 y una de F11. Recording disponible. Parrilla los sábados.',
   'Av. Corrientes 4900, Villa Crespo', 'Villa Crespo',
   -34.5972, -58.4392, '+54 11 4856-7890', '{}',
   50, 24, true, 4.8, 398, true),

  ('11111111-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'Roja Court', 'roja-court',
   'Pádel + tenis. Coaching personalizado disponible.',
   'Cabildo 2456, Belgrano', 'Belgrano',
   -34.5650, -58.4567, '+54 11 4783-2345', '{}',
   30, 24, false, 4.6, 87, true),

  ('11111111-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'Norte Arena', 'norte-arena',
   'Cancha de básquet techada + cancha de vóley. Vestuarios con ducha.',
   'Av. del Libertador 18000, San Isidro', 'San Isidro',
   -34.4708, -58.5128, '+54 11 4747-9012', '{}',
   50, 48, false, 4.5, 64, true),

  ('11111111-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000001',
   (select id from public.countries where code = 'AR'),
   'Club San Fernando', 'club-san-fernando',
   'Pádel + F5. Estacionamiento amplio y parrilla.',
   'Ruta 8 km 26, Hurlingham', 'Hurlingham',
   -34.5895, -58.6403, '+54 11 4663-4567', '{}',
   40, 24, false, 4.4, 52, true)
on conflict (id) do nothing;

-- ── Courts ──────────────────────────────────────────────────────────────────
-- Una cancha por venue para arrancar; los mocks de UI no muestran detalle por cancha.
insert into public.courts (
  id, venue_id, sport_id, name, surface, covered, base_price_cents, capacity, active
) values
  ('22222222-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001',
   (select id from public.sports where code = 'futbol_5'),
   'Cancha 1', 'sintético', false, 1800000, 10, true),

  ('22222222-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000002',
   (select id from public.sports where code = 'padel'),
   'Cancha A', 'cemento', true, 950000, 4, true),

  ('22222222-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000003',
   (select id from public.sports where code = 'futbol_8'),
   'Cancha grande', 'césped', false, 2600000, 16, true),

  ('22222222-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000004',
   (select id from public.sports where code = 'padel'),
   'Cancha 1', 'cemento', false, 1100000, 4, true),

  ('22222222-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000005',
   (select id from public.sports where code = 'basquet'),
   'Cancha central', 'parquet', true, 1500000, 10, true),

  ('22222222-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000006',
   (select id from public.sports where code = 'padel'),
   'Cancha cubierta', 'cemento', true, 1200000, 4, true)
on conflict (id) do nothing;

-- ── venue_amenities (joins) ─────────────────────────────────────────────────
-- Asignamos amenities por venue usando los codes del catálogo.
insert into public.venue_amenities (venue_id, amenity_id)
select v.id, a.id
from (values
  ('11111111-0000-0000-0000-000000000001', '{parking,bar,showers}'::text[]),
  ('11111111-0000-0000-0000-000000000002', '{parking,bar}'::text[]),
  ('11111111-0000-0000-0000-000000000003', '{parrilla,changing_rooms,parking}'::text[]),
  ('11111111-0000-0000-0000-000000000004', '{parking,coaching}'::text[]),
  ('11111111-0000-0000-0000-000000000005', '{changing_rooms,showers,bar}'::text[]),
  ('11111111-0000-0000-0000-000000000006', '{parking,parrilla}'::text[])
) as map(venue_id, codes)
join public.venues v on v.id = map.venue_id::uuid
join public.amenities a on a.code = any(map.codes)
on conflict do nothing;

-- ── venue_sports ────────────────────────────────────────────────────────────
insert into public.venue_sports (venue_id, sport_id)
select c.venue_id, c.sport_id
from public.courts c
on conflict do nothing;
