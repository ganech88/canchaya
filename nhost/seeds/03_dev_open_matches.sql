-- ============================================================================
-- Dev seed: bookings + open_matches (depende de 02_dev_venues.sql)
-- ============================================================================
-- Crea 4 bookings hosteados por el system user, todos con un open_match attached
-- y status='open'. Idempotente con ON CONFLICT.
-- ============================================================================

-- Bookings hosted by system user (mismo user que owner de venues — dev only)
insert into public.bookings (
  id, court_id, host_id, starts_at, ends_at,
  total_cents, deposit_cents, balance_cents, status, party_size, has_recording, payment_status
) values
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000003',  -- El Potrero F8
   '00000000-0000-0000-0000-000000000001',
   now() + interval '4 hours', now() + interval '5 hours',
   2600000, 1300000, 1300000, 'confirmed', 10, false, 'paid'),

  ('33333333-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000002',  -- Pádel Club Sur
   '00000000-0000-0000-0000-000000000001',
   now() + interval '5 hours', now() + interval '6 hours 30 minutes',
   950000, 380000, 570000, 'confirmed', 4, false, 'paid'),

  ('33333333-0000-0000-0000-000000000003',
   '22222222-0000-0000-0000-000000000001',  -- La Bombonerita F5
   '00000000-0000-0000-0000-000000000001',
   now() + interval '1 day' + interval '20 hours', now() + interval '1 day' + interval '21 hours',
   1800000, 900000, 900000, 'confirmed', 10, false, 'paid'),

  ('33333333-0000-0000-0000-000000000004',
   '22222222-0000-0000-0000-000000000004',  -- Roja Court (pádel)
   '00000000-0000-0000-0000-000000000001',
   now() + interval '6 hours', now() + interval '7 hours 30 minutes',
   1100000, 330000, 770000, 'confirmed', 4, false, 'paid')
on conflict (id) do nothing;

-- Open matches
insert into public.open_matches (
  id, booking_id, spots_total, spots_filled, level, price_per_player_cents,
  visible_radius_km, gender_filter, age_min, age_max, status, expires_at
) values
  ('44444444-0000-0000-0000-000000000001',
   '33333333-0000-0000-0000-000000000001',
   10, 8, 'intermedio', 260000, 5, 'any', null, null, 'open',
   now() + interval '3 hours'),

  ('44444444-0000-0000-0000-000000000002',
   '33333333-0000-0000-0000-000000000002',
   4, 3, 'avanzado', 240000, 5, 'f', 25, 40, 'open',
   now() + interval '4 hours'),

  ('44444444-0000-0000-0000-000000000003',
   '33333333-0000-0000-0000-000000000003',
   10, 5, 'principiante', 180000, 5, 'any', null, null, 'open',
   now() + interval '20 hours'),

  ('44444444-0000-0000-0000-000000000004',
   '33333333-0000-0000-0000-000000000004',
   4, 2, 'intermedio', 280000, 5, 'm', null, null, 'open',
   now() + interval '5 hours')
on conflict (id) do nothing;
