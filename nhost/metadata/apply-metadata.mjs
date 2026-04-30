// Aplica relationships + permissions de Hasura al proyecto Nhost.
// Requiere NHOST_SUBDOMAIN, NHOST_REGION, NHOST_ADMIN_SECRET en env.
// Idempotente: ignora errores "already exists" por si re-corre.
//
// Uso:
//   NHOST_ADMIN_SECRET='...' node nhost/metadata/apply-metadata.mjs

const subdomain = process.env.NHOST_SUBDOMAIN || 'nqcsdeicmgstgjuikqxn'
const region = process.env.NHOST_REGION || 'sa-east-1'
const adminSecret = process.env.NHOST_ADMIN_SECRET
if (!adminSecret) {
  console.error('Missing NHOST_ADMIN_SECRET')
  process.exit(1)
}

const endpoint = `https://${subdomain}.hasura.${region}.nhost.run/v1/metadata`

async function call(args) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
    },
    body: JSON.stringify(args),
  })
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  return { status: res.status, body }
}

const tbl = (name) => ({ schema: 'public', name })
const SESSION_USER = 'X-Hasura-User-Id'

// ── Object relationships (FK-based) ─────────────────────────────────────────
const objectRels = [
  ['profiles',             'country',          'country_id'],
  ['venues',               'owner',            'owner_id'],
  ['venues',               'country',          'country_id'],
  ['venue_sports',         'venue',            'venue_id'],
  ['venue_sports',         'sport',            'sport_id'],
  ['venue_amenities',      'venue',            'venue_id'],
  ['venue_amenities',      'amenity',          'amenity_id'],
  ['business_hours',       'venue',            'venue_id'],
  ['venue_closures',       'venue',            'venue_id'],
  ['courts',               'venue',            'venue_id'],
  ['courts',               'sport',            'sport_id'],
  ['price_rules',          'court',            'court_id'],
  ['bookings',             'court',            'court_id'],
  ['bookings',             'host',             'host_id'],
  ['booking_participants', 'booking',          'booking_id'],
  ['booking_participants', 'user',             'user_id'],
  ['open_matches',         'booking',          'booking_id'],
  ['reviews',              'venue',            'venue_id'],
  ['reviews',              'user',             'user_id'],
  ['reviews',              'booking',          'booking_id'],
  ['products',             'venue',            'venue_id'],
  ['sales',                'venue',            'venue_id'],
  ['sales',                'booking',          'booking_id'],
  ['chat_messages',        'booking',          'booking_id'],
  ['chat_messages',        'user',             'user_id'],
  ['sports',               'parent',           'parent_id'],
]

// ── Array relationships (inverse FKs) ───────────────────────────────────────
const arrayRels = [
  // countries
  ['countries', 'profiles', 'profiles', 'country_id'],
  ['countries', 'venues',   'venues',   'country_id'],
  // sports
  ['sports',    'venue_sports', 'venue_sports', 'sport_id'],
  ['sports',    'courts',       'courts',       'sport_id'],
  ['sports',    'children',     'sports',       'parent_id'],
  // amenities
  ['amenities', 'venue_amenities', 'venue_amenities', 'amenity_id'],
  // profiles
  ['profiles',  'venues',               'venues',               'owner_id'],
  ['profiles',  'bookings',             'bookings',             'host_id'],
  ['profiles',  'booking_participations', 'booking_participants', 'user_id'],
  ['profiles',  'reviews',              'reviews',              'user_id'],
  ['profiles',  'chat_messages',        'chat_messages',        'user_id'],
  // venues
  ['venues',    'sports_offered',  'venue_sports',     'venue_id'],
  ['venues',    'amenities',       'venue_amenities',  'venue_id'],
  ['venues',    'business_hours',  'business_hours',   'venue_id'],
  ['venues',    'closures',        'venue_closures',   'venue_id'],
  ['venues',    'courts',          'courts',           'venue_id'],
  ['venues',    'reviews',         'reviews',          'venue_id'],
  ['venues',    'products',        'products',         'venue_id'],
  ['venues',    'sales',           'sales',            'venue_id'],
  // courts
  ['courts',    'price_rules',     'price_rules',      'court_id'],
  ['courts',    'bookings',        'bookings',         'court_id'],
  // bookings
  ['bookings',  'participants',    'booking_participants', 'booking_id'],
  ['bookings',  'open_match',      'open_matches',     'booking_id'],
  ['bookings',  'reviews',         'reviews',          'booking_id'],
  ['bookings',  'sales',           'sales',            'booking_id'],
  ['bookings',  'chat_messages',   'chat_messages',    'booking_id'],
]

// ── Permissions ─────────────────────────────────────────────────────────────
// Helpers
const ownVenueFilter = { venue: { owner_id: { _eq: SESSION_USER } } }
const ownCourtVenueFilter = { court: { venue: { owner_id: { _eq: SESSION_USER } } } }
const stakeholderBookingFilter = {
  _or: [
    { host_id: { _eq: SESSION_USER } },
    { participants: { user_id: { _eq: SESSION_USER } } },
    { court: { venue: { owner_id: { _eq: SESSION_USER } } } },
  ],
}

const permissions = []

function selectAll(role, table, filter = {}, columns = '*') {
  permissions.push({
    type: 'pg_create_select_permission',
    args: {
      source: 'default',
      table: tbl(table),
      role,
      permission: { columns, filter, allow_aggregations: true },
    },
  })
}

function insertPerm(role, table, check, columns) {
  permissions.push({
    type: 'pg_create_insert_permission',
    args: {
      source: 'default',
      table: tbl(table),
      role,
      permission: { columns, check },
    },
  })
}

function updatePerm(role, table, filter, check = filter, columns = []) {
  permissions.push({
    type: 'pg_create_update_permission',
    args: {
      source: 'default',
      table: tbl(table),
      role,
      permission: { columns, filter, check },
    },
  })
}

function deletePerm(role, table, filter) {
  permissions.push({
    type: 'pg_create_delete_permission',
    args: {
      source: 'default',
      table: tbl(table),
      role,
      permission: { filter },
    },
  })
}

// === Catalogs (public + user read; admin writes) ===========================
for (const role of ['public', 'user']) {
  selectAll(role, 'countries', { active: { _eq: true } })
  selectAll(role, 'sports',    { active: { _eq: true } })
  selectAll(role, 'amenities', {})
}

// === Profiles ===============================================================
// public: lectura mínima (sin email/phone/birth_date)
selectAll('public', 'profiles', {}, [
  'id', 'name', 'avatar_url', 'level', 'gender',
  'stats_matches', 'stats_goals', 'stats_rating', 'created_at',
])
// user: ve todo, puede insertar/actualizar el suyo
selectAll('user', 'profiles', {})
insertPerm('user', 'profiles',
  { id: { _eq: SESSION_USER } },
  ['id', 'name', 'email', 'phone', 'avatar_url', 'gender', 'birth_date', 'level', 'bio', 'country_id'],
)
updatePerm('user', 'profiles',
  { id: { _eq: SESSION_USER } },
  { id: { _eq: SESSION_USER } },
  ['name', 'phone', 'avatar_url', 'gender', 'birth_date', 'level', 'bio', 'country_id'],
)

// === Venues =================================================================
selectAll('public', 'venues', { active: { _eq: true } })
selectAll('user',   'venues', { _or: [{ active: { _eq: true } }, { owner_id: { _eq: SESSION_USER } }] })
insertPerm('user', 'venues',
  { owner_id: { _eq: SESSION_USER } },
  ['name', 'slug', 'description', 'address', 'city', 'latitude', 'longitude', 'geohash',
   'phone', 'photos', 'logo_url', 'background_url', 'country_id', 'owner_id',
   'deposit_percent', 'cancellation_hours_notice', 'has_recording'],
)
updatePerm('user', 'venues',
  { owner_id: { _eq: SESSION_USER } },
  { owner_id: { _eq: SESSION_USER } },
  ['name', 'description', 'address', 'city', 'latitude', 'longitude', 'geohash',
   'phone', 'photos', 'logo_url', 'background_url', 'active',
   'deposit_percent', 'cancellation_hours_notice', 'has_recording'],
)

// === venue_sports / venue_amenities (joins, lectura pública) ================
for (const t of ['venue_sports', 'venue_amenities']) {
  selectAll('public', t, {})
  selectAll('user',   t, {})
  insertPerm('user', t, ownVenueFilter, [
    t === 'venue_sports' ? 'sport_id' : 'amenity_id',
    'venue_id',
  ])
  deletePerm('user', t, ownVenueFilter)
}

// === business_hours / venue_closures =======================================
for (const t of ['business_hours', 'venue_closures']) {
  selectAll('public', t, {})
  selectAll('user',   t, {})
  const cols = t === 'business_hours'
    ? ['venue_id', 'day_of_week', 'open_time', 'close_time']
    : ['venue_id', 'starts_at', 'ends_at', 'reason']
  insertPerm('user', t, ownVenueFilter, cols)
  updatePerm('user', t, ownVenueFilter, ownVenueFilter, cols)
  deletePerm('user', t, ownVenueFilter)
}

// === Courts =================================================================
selectAll('public', 'courts', { active: { _eq: true } })
selectAll('user',   'courts', {
  _or: [{ active: { _eq: true } }, { venue: { owner_id: { _eq: SESSION_USER } } }],
})
insertPerm('user', 'courts',
  { venue: { owner_id: { _eq: SESSION_USER } } },
  ['venue_id', 'sport_id', 'name', 'surface', 'covered', 'base_price_cents', 'capacity', 'photos'],
)
updatePerm('user', 'courts',
  { venue: { owner_id: { _eq: SESSION_USER } } },
  { venue: { owner_id: { _eq: SESSION_USER } } },
  ['name', 'surface', 'covered', 'base_price_cents', 'capacity', 'photos', 'active'],
)
deletePerm('user', 'courts', { venue: { owner_id: { _eq: SESSION_USER } } })

// === price_rules ============================================================
selectAll('public', 'price_rules', {})
selectAll('user',   'price_rules', {})
insertPerm('user', 'price_rules',
  ownCourtVenueFilter,
  ['court_id', 'day_of_week', 'hour_start', 'hour_end', 'price_cents', 'discount_rule'],
)
updatePerm('user', 'price_rules',
  ownCourtVenueFilter,
  ownCourtVenueFilter,
  ['day_of_week', 'hour_start', 'hour_end', 'price_cents', 'discount_rule'],
)
deletePerm('user', 'price_rules', ownCourtVenueFilter)

// === Bookings ===============================================================
selectAll('user', 'bookings', stakeholderBookingFilter)
insertPerm('user', 'bookings',
  { host_id: { _eq: SESSION_USER } },
  ['court_id', 'host_id', 'starts_at', 'ends_at', 'total_cents', 'deposit_cents', 'balance_cents',
   'cancellation_hours_notice', 'party_size', 'notes', 'has_recording',
   'payment_provider', 'external_payment_id'],
)
updatePerm('user', 'bookings',
  {
    _or: [
      { host_id: { _eq: SESSION_USER } },
      { court: { venue: { owner_id: { _eq: SESSION_USER } } } },
    ],
  },
  {
    _or: [
      { host_id: { _eq: SESSION_USER } },
      { court: { venue: { owner_id: { _eq: SESSION_USER } } } },
    ],
  },
  ['status', 'party_size', 'notes', 'cancelled_at', 'cancelled_reason',
   'payment_provider', 'external_payment_id', 'payment_status', 'total_cents',
   'deposit_cents', 'balance_cents'],
)

// === booking_participants ===================================================
selectAll('user', 'booking_participants', {
  _or: [
    { user_id: { _eq: SESSION_USER } },
    { booking: { host_id: { _eq: SESSION_USER } } },
    { booking: { court: { venue: { owner_id: { _eq: SESSION_USER } } } } },
  ],
})
insertPerm('user', 'booking_participants',
  { user_id: { _eq: SESSION_USER } },
  ['booking_id', 'user_id'],
)
updatePerm('user', 'booking_participants',
  { user_id: { _eq: SESSION_USER } },
  { user_id: { _eq: SESSION_USER } },
  ['paid_amount_cents', 'paid_at'],
)
deletePerm('user', 'booking_participants', { user_id: { _eq: SESSION_USER } })

// === open_matches ===========================================================
selectAll('public', 'open_matches', { status: { _eq: 'open' } })
selectAll('user', 'open_matches', {
  _or: [
    { status: { _eq: 'open' } },
    { booking: { host_id: { _eq: SESSION_USER } } },
    { booking: { participants: { user_id: { _eq: SESSION_USER } } } },
  ],
})
insertPerm('user', 'open_matches',
  { booking: { host_id: { _eq: SESSION_USER } } },
  ['booking_id', 'spots_total', 'level', 'price_per_player_cents',
   'visible_radius_km', 'gender_filter', 'age_min', 'age_max', 'expires_at'],
)
updatePerm('user', 'open_matches',
  { booking: { host_id: { _eq: SESSION_USER } } },
  { booking: { host_id: { _eq: SESSION_USER } } },
  ['spots_total', 'spots_filled', 'level', 'price_per_player_cents',
   'visible_radius_km', 'gender_filter', 'age_min', 'age_max', 'status', 'expires_at'],
)

// === reviews ================================================================
selectAll('public', 'reviews', {})
selectAll('user',   'reviews', {})
insertPerm('user', 'reviews',
  { user_id: { _eq: SESSION_USER }, booking: { status: { _eq: 'done' } } },
  ['venue_id', 'user_id', 'booking_id', 'stars', 'text'],
)
updatePerm('user', 'reviews',
  { user_id: { _eq: SESSION_USER } },
  { user_id: { _eq: SESSION_USER } },
  ['stars', 'text'],
)
deletePerm('user', 'reviews', { user_id: { _eq: SESSION_USER } })

// === products / sales (sólo dueños del venue) ==============================
for (const t of ['products', 'sales']) {
  selectAll('user', t, ownVenueFilter)
  insertPerm('user', t, ownVenueFilter,
    t === 'products'
      ? ['venue_id', 'name', 'category', 'price_cents', 'cost_cents', 'stock', 'stock_min']
      : ['venue_id', 'booking_id', 'items', 'total_cents', 'paid_at'],
  )
  updatePerm('user', t, ownVenueFilter, ownVenueFilter,
    t === 'products'
      ? ['name', 'category', 'price_cents', 'cost_cents', 'stock', 'stock_min', 'active']
      : ['items', 'total_cents'],
  )
  deletePerm('user', t, ownVenueFilter)
}

// === chat_messages ==========================================================
selectAll('user', 'chat_messages', {
  _or: [
    { booking: { host_id: { _eq: SESSION_USER } } },
    { booking: { participants: { user_id: { _eq: SESSION_USER } } } },
    { booking: { court: { venue: { owner_id: { _eq: SESSION_USER } } } } },
  ],
})
insertPerm('user', 'chat_messages',
  {
    user_id: { _eq: SESSION_USER },
    _or: [
      { booking: { host_id: { _eq: SESSION_USER } } },
      { booking: { participants: { user_id: { _eq: SESSION_USER } } } },
    ],
  },
  ['booking_id', 'user_id', 'text', 'kind', 'meta'],
)

// ── Build the bulk request ──────────────────────────────────────────────────
const objectRelOps = objectRels.map(([table, rel, col]) => ({
  type: 'pg_create_object_relationship',
  args: {
    source: 'default',
    table: tbl(table),
    name: rel,
    using: { foreign_key_constraint_on: col },
  },
}))

const arrayRelOps = arrayRels.map(([fromTable, rel, toTable, fkCol]) => ({
  type: 'pg_create_array_relationship',
  args: {
    source: 'default',
    table: tbl(fromTable),
    name: rel,
    using: { foreign_key_constraint_on: { column: fkCol, table: tbl(toTable) } },
  },
}))

// ── Apply: relationships first, then permissions, ignoring "already exists" ──
async function applyOne(op, label) {
  const res = await call(op)
  if (res.status === 200) {
    return { ok: true }
  }
  const errMsg =
    typeof res.body === 'string'
      ? res.body
      : (res.body.error || res.body.code || JSON.stringify(res.body))
  const bodyStr = typeof res.body === 'string' ? res.body : JSON.stringify(res.body)
  if (/already exists|already defined|same name|conflict/i.test(bodyStr)) {
    return { ok: true, skipped: true }
  }
  return { ok: false, error: errMsg, body: res.body, label }
}

async function run() {
  let okRels = 0, skipRels = 0, failRels = 0
  for (const op of [...objectRelOps, ...arrayRelOps]) {
    const label = `${op.type}: ${op.args.table.name}.${op.args.name}`
    const r = await applyOne(op, label)
    if (r.ok && !r.skipped) okRels++
    else if (r.skipped) skipRels++
    else { failRels++; console.error('FAIL', label, r.error) }
  }

  let okPerms = 0, skipPerms = 0, failPerms = 0
  for (const op of permissions) {
    const label = `${op.type}: ${op.args.table.name} (${op.args.role})`
    const r = await applyOne(op, label)
    if (r.ok && !r.skipped) okPerms++
    else if (r.skipped) skipPerms++
    else { failPerms++; console.error('FAIL', label, r.error) }
  }

  console.log(`\nRelationships: ${okRels} created, ${skipRels} skipped, ${failRels} failed`)
  console.log(`Permissions:   ${okPerms} created, ${skipPerms} skipped, ${failPerms} failed`)
  if (failRels + failPerms > 0) process.exit(1)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
