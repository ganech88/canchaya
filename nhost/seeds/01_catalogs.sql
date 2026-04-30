-- ============================================================================
-- CanchaYa — seed data (catálogos + dev samples)
-- ============================================================================
-- Se corre con `supabase db reset`. No incluye venues/courts: esos dependen
-- de auth.users (owner_id). Cuando haya un owner signed-up, correr
-- `supabase/seed-dev.sql` para poblar.
-- ============================================================================

-- ── Countries (LATAM) ───────────────────────────────────────────────────────
insert into public.countries (id, code, name, currency, timezone, phone_code, is_default) values
  (1,  'AR', 'Argentina',   'ARS', 'America/Argentina/Buenos_Aires', '+54', true),
  (2,  'MX', 'México',      'MXN', 'America/Mexico_City',            '+52', false),
  (3,  'CL', 'Chile',       'CLP', 'America/Santiago',               '+56', false),
  (4,  'UY', 'Uruguay',     'UYU', 'America/Montevideo',             '+598', false),
  (5,  'PE', 'Perú',        'PEN', 'America/Lima',                   '+51', false),
  (6,  'CO', 'Colombia',    'COP', 'America/Bogota',                 '+57', false),
  (7,  'BR', 'Brasil',      'BRL', 'America/Sao_Paulo',              '+55', false),
  (8,  'PY', 'Paraguay',    'PYG', 'America/Asuncion',               '+595', false),
  (9,  'EC', 'Ecuador',     'USD', 'America/Guayaquil',              '+593', false),
  (10, 'BO', 'Bolivia',     'BOB', 'America/La_Paz',                 '+591', false),
  (11, 'VE', 'Venezuela',   'VES', 'America/Caracas',                '+58', false),
  (12, 'CR', 'Costa Rica',  'CRC', 'America/Costa_Rica',             '+506', false),
  (13, 'PA', 'Panamá',      'PAB', 'America/Panama',                 '+507', false)
on conflict (id) do nothing;

-- ── Sports ──────────────────────────────────────────────────────────────────
-- Jerarquía: Fútbol es padre de F5/F7/F8/F11. El resto son top-level.
insert into public.sports (id, code, name, parent_id, default_duration, players_min, players_max, order_index, icon) values
  (1, 'futbol',    'Fútbol',     null, 60, 10, 22, 1, 'ball'),
  (2, 'futbol_5',  'Fútbol 5',   1,    60, 10, 10, 2, 'ball'),
  (3, 'futbol_7',  'Fútbol 7',   1,    60, 14, 14, 3, 'ball'),
  (4, 'futbol_8',  'Fútbol 8',   1,    60, 16, 16, 4, 'ball'),
  (5, 'futbol_11', 'Fútbol 11',  1,    90, 22, 22, 5, 'ball'),
  (6, 'padel',     'Pádel',      null, 90,  2,  4, 6, 'padel'),
  (7, 'tenis',     'Tenis',      null, 90,  2,  4, 7, 'ball'),
  (8, 'basquet',   'Básquet',    null, 60,  6, 10, 8, 'ball'),
  (9, 'voley',     'Vóley',      null, 60, 10, 12, 9, 'ball')
on conflict (id) do nothing;

-- ── Amenities ───────────────────────────────────────────────────────────────
insert into public.amenities (code, name, icon, order_index) values
  ('parking',         'Estacionamiento',   'parking',    1),
  ('changing_rooms',  'Vestuarios',        'locker',     2),
  ('showers',         'Duchas',            'shower',     3),
  ('bar',             'Bar / Kiosco',      'bar',        4),
  ('wifi',            'WiFi',              'wifi',       5),
  ('parrilla',        'Parrilla',          'flame',      6),
  ('lighting',        'Iluminación',       'bolt',       7),
  ('covered',         'Techada',           'roof',       8),
  ('rental',          'Alquiler de equipo','equipment',  9),
  ('accessible',      'Accesible',         'accessible', 10),
  ('coaching',        'Profesores',        'user',       11),
  ('tournament',      'Torneos',           'trophy',     12)
on conflict (code) do nothing;
