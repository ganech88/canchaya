-- ============================================================================
-- CanchaYa — seed data (dev)
-- ============================================================================
-- Correr con: supabase db reset
-- Asume que hay dos usuarios en auth.users creados via signup (owner + player).
-- Acá solo insertamos lo que no depende de auth (venues, courts, products genéricos).
-- Para llenar con datos realistas, crear usuarios desde Studio primero.
-- ============================================================================

-- Este seed queda vacío por ahora a propósito — los inserts de venues requieren owner_id
-- (uuid real de auth.users). Cuando tengamos al primer owner signed-up, volcamos las 4 canchas
-- del mock (LA BOMBONERITA, PÁDEL CLUB SUR, EL POTRERO, ROJA COURT) desde un script.

-- Ejemplo de cómo quedaría (comentado):
-- insert into public.venues (owner_id, name, slug, address, city, sports, amenities, active)
-- values
--   ('<OWNER_UUID>', 'La Bombonerita', 'la-bombonerita', 'Palermo, CABA', 'Buenos Aires',
--    array['futbol5','futbol8']::sport[], array['parrilla','vestuarios','estacionamiento'], true);
