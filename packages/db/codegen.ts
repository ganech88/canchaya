// GraphQL codegen — introspecta el schema de Hasura y genera types.
//
// Uso:
//   pnpm --filter @canchaya/db codegen           # one-off
//   pnpm --filter @canchaya/db codegen:watch     # watch mode
//
// Env requeridas (copiar a packages/db/.env o exportar antes de correr):
//   NHOST_GRAPHQL_URL          — e.g. https://<sub>.graphql.<region>.nhost.run/v1
//   NHOST_ADMIN_SECRET         — Hasura admin secret
//
// Output:
//   src/__generated__/schema.ts   — todos los types del schema (Query/Mutation/Subscription roots)
//   src/__generated__/operations.ts — types específicos para los queries en src/queries.ts
//
// Uso post-codegen: importar types de '@canchaya/db/generated' (re-exportados en index.ts).

import type { CodegenConfig } from '@graphql-codegen/cli'

const url = process.env.NHOST_GRAPHQL_URL
const adminSecret = process.env.NHOST_ADMIN_SECRET

if (!url || !adminSecret) {
  console.error(
    '[codegen] Missing NHOST_GRAPHQL_URL or NHOST_ADMIN_SECRET. Setear .env y reintentar.',
  )
  process.exit(1)
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [url]: {
        headers: {
          'x-hasura-admin-secret': adminSecret,
        },
      },
    },
  ],
  // Leer los queries inline en src/queries.ts y src/owner.ts para generar
  // types específicos de cada operación.
  documents: ['src/queries.ts', 'src/owner.ts'],
  generates: {
    'src/__generated__/schema.ts': {
      plugins: ['typescript'],
      config: {
        skipTypename: false,
        scalars: {
          uuid: 'string',
          timestamptz: 'string',
          numeric: 'number',
          bigint: 'number',
          jsonb: 'unknown',
          date: 'string',
          time: 'string',
          smallint: 'number',
        },
      },
    },
    'src/__generated__/operations.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: './schema',
      },
      plugins: ['typescript-operations'],
      config: {
        skipTypename: true,
      },
    },
  },
}

export default config
