import type { CanchaYaClient } from '@canchaya/db'

interface ProfileRow {
  id: string
  name: string
  email: string
}

/**
 * Idempotente: si ya existe el profile del user logueado, no hace nada.
 * Si no, lo crea. Reemplaza el trigger on_auth_user_created (Nhost no permite
 * triggers en auth.users). Mismo helper que el de web pero importable acá.
 */
export async function ensureProfileMobile(
  nhost: CanchaYaClient,
  fallbackName?: string,
): Promise<ProfileRow | null> {
  const session = nhost.getUserSession()
  const user = session?.user
  if (!user) return null

  const userId = user.id
  const email = user.email ?? ''
  if (!email) throw new Error('Sesión sin email — no se puede crear profile')
  const displayName = user.displayName || fallbackName || email.split('@')[0]

  const checkRes = await nhost.graphql.request<{ profiles_by_pk: ProfileRow | null }>({
    query: `query CheckProfile($id: uuid!) { profiles_by_pk(id: $id) { id name email } }`,
    variables: { id: userId },
  })
  if (checkRes.body.errors?.length) {
    throw new Error(checkRes.body.errors.map((e) => e.message).join('; '))
  }
  if (checkRes.body.data?.profiles_by_pk) return checkRes.body.data.profiles_by_pk

  const insertRes = await nhost.graphql.request<{ insert_profiles_one: ProfileRow }>({
    query: `mutation CreateProfile($id: uuid!, $name: String!, $email: String!) {
      insert_profiles_one(object: { id: $id, name: $name, email: $email }) { id name email }
    }`,
    variables: { id: userId, name: displayName, email },
  })
  if (insertRes.body.errors?.length) {
    throw new Error(insertRes.body.errors.map((e) => e.message).join('; '))
  }
  return insertRes.body.data?.insert_profiles_one ?? null
}
