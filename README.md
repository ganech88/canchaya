# CanchaYa

Marketplace de reserva de canchas deportivas (fútbol, pádel, tenis) para LATAM.

- **App móvil** (jugadores) — Expo SDK 52 + React Native + NativeWind
- **Dashboard web** (dueños de complejos) — Next.js 15 (App Router) + Tailwind
- **Backend** — Supabase (Postgres + Auth + Realtime + Storage)
- **Pagos** — Mercado Pago (a integrar)
- **Mapas** — Mapbox (a integrar)

Personalidad visual: *editorial sports magazine* — grids fuertes, números display gigantes, mono para metadatos, dominante crema + acento lima. Ver `design_handoff_canchaya/README.md`.

## Estructura

```
canchaya/
├── apps/
│   ├── mobile/          # Expo + RN + NativeWind
│   └── web/             # Next.js 15 + Tailwind
├── packages/
│   ├── ui/              # Design tokens + Tailwind preset + primitives (web & native)
│   ├── db/              # Cliente Supabase tipado
│   └── config/          # tsconfig base
├── supabase/
│   ├── migrations/      # SQL
│   ├── seed.sql
│   └── config.toml
└── design_handoff_canchaya/   # Mocks originales (no tocar)
```

## Quickstart

```bash
# Instalar
pnpm install

# Levantar Supabase local (requiere Docker)
pnpm supabase start

# Generar types TS desde el schema local
pnpm db:types

# App mobile
pnpm mobile dev

# Dashboard web
pnpm web dev
```

## Env

Copiar `.env.example` a `.env` en la raíz y a cada app (`apps/mobile/.env`, `apps/web/.env.local`). Los valores los da `supabase status` cuando corras Supabase local, o el dashboard del proyecto remoto.

## Supabase remoto

**Estado actual (2026-04-22):** el free tier de la org `DSF` está en el tope (2 proyectos activos: `consorcio` + `legalia`). El intento de crear `canchaya` remoto fue rechazado. Opciones:

1. Pausar `consorcio` o `legalia` desde el [dashboard](https://supabase.com/dashboard) y correr `scripts/create-supabase-project.sh`.
2. Upgrade de la org a Pro.
3. **Mientras tanto**: correr todo local con `supabase start` (Docker requerido).

Cuando el proyecto remoto esté creado, linkear:

```bash
pnpm supabase link --project-ref <REF>
pnpm db:push
pnpm db:types
```

## Stack de decisiones clave

- **NativeWind v4** para compartir el vocabulario de Tailwind entre web y RN.
- **Tokens en TS** (`packages/ui/src/tokens`) que se consumen como preset de Tailwind en ambos apps.
- **Primitives dobles** (`packages/ui/src/native/*` vs `packages/ui/src/web/*`) — comparten tokens y className, primitives de plataforma distintos (`View` vs `div`).
- **RLS desde el día 1** — todas las tablas con políticas, el `anon` key no ve nada sin sesión.
