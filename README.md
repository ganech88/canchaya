# CanchaYa

Marketplace de reserva de canchas deportivas (fútbol, pádel, tenis) para LATAM.

- **App móvil** (jugadores) — Expo SDK 52 + React Native + NativeWind
- **Dashboard web** (dueños de complejos) — Next.js 15 (App Router) + Tailwind
- **Backend** — Nhost (Postgres + Hasura GraphQL + Auth + Storage + Functions)
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
│   ├── db/              # Cliente Nhost tipado
│   └── config/          # tsconfig base
├── nhost/
│   └── migrations/      # SQL aplicado vía Hasura admin endpoint
└── design_handoff_canchaya/   # Mocks originales (no tocar)
```

## Quickstart

```bash
# Instalar
pnpm install

# Setear env vars del proyecto Nhost (mirar .env.example)
cp .env.example .env

# App mobile
pnpm mobile dev

# Dashboard web
pnpm web dev
```

## Env

Copiar `.env.example` a `.env` en la raíz y a cada app (`apps/mobile/.env`, `apps/web/.env.local`). Los valores vienen del dashboard del proyecto Nhost (Settings → General).

## Nhost remoto

Proyecto activo: `nqcsdeicmgstgjuikqxn` en región `sa-east-1` (São Paulo). El schema (17 tablas) ya fue aplicado y trackeado en Hasura.

Para ver el schema o aplicar cambios:
- **Dashboard:** https://app.nhost.io/orgs/vhdijhkaajlyfcuhkcne/projects/nqcsdeicmgstgjuikqxn
- **Hasura console:** https://nqcsdeicmgstgjuikqxn.hasura.sa-east-1.nhost.run (con admin secret)
- **Migrations:** SQL en `nhost/migrations/default/`. Se aplican vía `POST /v2/query` con `run_sql` y header `x-hasura-admin-secret`.

> Postgis no está disponible en free tier (requiere superuser). Por ahora `venues.location` se modeló como `latitude`/`longitude` numeric. Re-habilitar al upgrade.

### Codegen GraphQL

Los types del schema y de cada query se generan introspeccionando el endpoint Hasura:

```bash
# Setear admin secret + endpoint en packages/db/.env (ver .env.example)
cd packages/db
pnpm codegen          # one-off
pnpm codegen:watch    # watch mode
```

Output: `packages/db/src/__generated__/{schema,operations}.ts`. Los re-exporta `index.ts`, así que `import { ... } from '@canchaya/db'` ya los ve. Por ahora los types manuales de `src/types.ts` siguen siendo la fuente de verdad — el codegen los complementa con tipos exactos por operación.

## Stack de decisiones clave

- **NativeWind v4** para compartir el vocabulario de Tailwind entre web y RN.
- **Tokens en TS** (`packages/ui/src/tokens`) que se consumen como preset de Tailwind en ambos apps.
- **Primitives dobles** (`packages/ui/src/native/*` vs `packages/ui/src/web/*`) — comparten tokens y className, primitives de plataforma distintos (`View` vs `div`).
- **Hasura permissions en vez de RLS** — los permisos por rol/tabla viven en metadata Hasura, no en SQL. Pendiente de configurar para roles `user`, `owner`, `admin`, `public`.
