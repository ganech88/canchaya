-- ============================================================================
-- Dev helpers — invocables sólo con admin secret.
-- ============================================================================
-- Email verification está habilitada por default en Nhost free tier.
-- Para desactivarla globalmente: dashboard → Settings → Auth → Sign-in methods
-- → "Require email verification" off.
--
-- Como alternativa para dev, esta función marca un user como verificado
-- usando el admin secret (NO trackearla en Hasura — sólo SQL admin).
-- ============================================================================

create or replace function public.dev_mark_verified(p_email text)
returns table (id uuid, email text, email_verified boolean)
language sql
security definer
set search_path = public
as $$
  update auth.users
  set email_verified = true
  where email::text = p_email
  returning id, email::text, email_verified;
$$;

comment on function public.dev_mark_verified(text) is
  'Dev-only: marca un user como email_verified=true. Llamar vía:
   POST /v2/query con run_sql + admin secret:
   SELECT * FROM dev_mark_verified(''user@example.com'');';
