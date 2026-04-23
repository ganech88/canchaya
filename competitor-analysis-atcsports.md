# Análisis competitivo: atcsports.io (Alquila Tu Cancha) → CanchaYa

> Brief generado a partir de navegación end-to-end del sitio de la competencia (resultados, venue, checkout, home, /matches, /reservas, /profile) y de la inspección de `window.__NEXT_DATA__` en cada página. El objetivo es identificar features y patrones para incorporar a CanchaYa, priorizando por valor para el jugador y por viabilidad técnica.
>
> Formato por feature: **Esto tienen** / **Esto queremos para CanchaYa** / **Por qué**.

---

## Stack y arquitectura observados

- **Next.js (pages router) con SSR**. `buildId: 6gb0aSTwbjdsDgT2UX_Si`. Las páginas de resultados y venue vienen renderizadas server-side con todos los slots de cancha embebidos en `__NEXT_DATA__.props.pageProps.bookingsBySport`. Esto tiene impacto en SEO y en TTFB percibido.
- **Storage de assets en S3**: `alquilatucancha-public.s3.sa-east-1.amazonaws.com` (region `sa-east-1`). Logos, backgrounds e íconos de amenities y deportes.
- **Telemetría**: Mixpanel + GA4 (`G-PTXHNLF12H`).
- **Soporte**: Intercom Messenger embebido.
- **Geo**: usan **geohash** (ej. `placeId=69y71zhtp`) en lugar de lat/lng crudos en URLs y joins. Cada club expone `geohash` y `location.lat/lng`.
- **Multi-tenant por país**: Argentina, Perú, Chile, EE.UU., Uruguay, Panamá, México, Colombia, Costa Rica. Cada `country` lleva `currency` y `currency_code`.
- **Dinero como integer cents** (`{ cents: 12500, currency: "ARS" }`). Bien para evitar floats y para multi-moneda.

---

## Features priorizadas (top 10 para empujar a CanchaYa)

### 1. Búsqueda por horario + deporte + ubicación con SSR y URL compartible

- **Esto tienen**: `/results?horario=22:00&tipoDeporte=7&dia=2026-04-23&placeId=<geohash>&locationName=...`. La URL es la fuente de verdad: día, hora, deporte y zona geográfica. SSR devuelve los resultados ya pintados en HTML, con breadcrumbs (`Pádel en Hurlingham`).
- **Esto queremos para CanchaYa**: replicar el patrón de URL canónica con esos cuatro parámetros (más sportIds múltiples, opcional). SSR/SSG por ciudad+deporte para SEO.
- **Por qué**: la mayoría del tráfico orgánico va a queries tipo "pádel en \[barrio\] a las 22hs". Sin URL parametrizada y SSR no se compite por esas keywords. Además habilita compartir resultados por WhatsApp con preview.

### 2. Slots de cancha como objetos atómicos con `duration`, `start`, `court_id`, `price`

- **Esto tienen**: `bookings: [{ duration, start (ISO con offset), price: {cents,currency}, court_id }]`. El backend devuelve directamente los slots disponibles, no la grilla horaria a calcular en el cliente.
- **Esto queremos para CanchaYa**: que el endpoint de búsqueda devuelva slots ya disponibles, con duración variable (60/90/120). El front no tiene que armar la grilla.
- **Por qué**: el cliente no debe conocer la grilla horaria de cada club ni las reglas de bloqueo. Esto simplifica enormemente la lógica de UI y permite que el backend aplique reglas (mantenimiento, torneos, reservas en curso) sin que el front lo sepa.

### 3. Modelo de seña (anticipo 50%) con cancelación 24h

- **Esto tienen**: el checkout cobra solo el 50% como seña ("Anticipo: $X / Saldo a abonar en el club: $Y"). Política de cancelación: reintegro si se cancela con +24h de anticipación.
- **Esto queremos para CanchaYa**: definir explícitamente el modelo. Recomiendo seña parametrizable por club (default 50%, override por venue). Política de cancelación visible en checkout y email.
- **Por qué**: baja la fricción de la conversión (el jugador paga menos upfront), y los clubes no rechazan la integración porque siguen cobrando el grueso en cancha. La política clara reduce disputas y chargebacks.

### 4. Fee de servicio con sponsorship (modelo de monetización)

- **Esto tienen**: en checkout aparece un "Costo de servicio: $250" cubierto por la marca **Tifox** (logo presente). Es decir: en vez de cobrarle al jugador, Tifox paga por estar visible en el flujo de reserva.
- **Esto queremos para CanchaYa**: explorar este modelo como alternativa o complemento al fee tradicional. Sponsor branding en el flujo de checkout o en banners por ciudad.
- **Por qué**: convierte un punto de fricción (fee al usuario) en un canal de monetización adicional sin lastimar conversión. Especialmente atractivo para marcas de pádel/fútbol que ya invierten en el segmento.

### 5. Match-making / Comunidades con segmentación por género, edad y nivel

- **Esto tienen**: sección **/matches** donde un jugador publica/se suma a un partido. Antes de entrar pide género (M/F) y fecha de nacimiento (modal bloqueante), y maneja un **nivel de juego** locked (gestionado por soporte, no auto-asignado).
- **Esto queremos para CanchaYa**: feature de comunidad/matchmaking. Filtros por género, rango etario, nivel y deporte. Nivel propuesto inicialmente como auto-declarado y validado por reportes/algoritmo (no esperar a tener equipo de soporte).
- **Por qué**: dispara retención y network effects. La búsqueda de cancha es transaccional; los matches generan engagement recurrente y tráfico social (WhatsApp/IG). Es la diferenciación más fuerte que vimos vs. un agregador puro.

### 6. Beelup: grabación automática de partidos como feature de venue

- **Esto tienen**: flag `has_beelup` por club. En checkout aparece toggle "¿Querés grabar tu partido?" como add-on. La página de venue muestra badge cuando aplica.
- **Esto queremos para CanchaYa**: integración con un partner de grabación (Beelup, MatchVision, o similar) o feature flag para clubes que ya tengan cámaras instaladas. Add-on opcional con upcharge.
- **Por qué**: es una excusa para upsell + diferenciación dura. Marketing self-serve (los partidos grabados se comparten en redes con marca CanchaYa en el overlay).

### 7. Catálogo amplio de deportes (22+) con metadata estructurada

- **Esto tienen**: 22+ deportes con metadata (`{ value, display, svgResource, order, playersMax, playersMin, defaultDuration, parent, children }`). Pádel id=7, default 90 min, 2-4 jugadores. Fútbol con jerarquía padre/hijos por variantes (F5/F7/F8/F11).
- **Esto queremos para CanchaYa**: modelar deporte como entidad con metadata equivalente. Soportar jerarquía (deporte → subvariante).
- **Por qué**: hoy si CanchaYa solo soporta pádel y fútbol crudo, escalar a tenis/básquet/vóley se vuelve refactor. Definir la metadata desde el inicio evita migraciones dolorosas más adelante.

### 8. Amenities, rating y horarios de atención por club (incluyendo feriados)

- **Esto tienen**: cada club expone `amenities: [{id, name, icon_url}]`, `rating: {stars, count}`, `business_hours: [{day_of_week, open_time, close_time}]` con `day_of_week` en código (`SU`/`MO`/.../`HO` para holiday). También `business_hours_for_given_date` ya resuelto.
- **Esto queremos para CanchaYa**: estructura idéntica. Amenities como tabla normalizada con íconos. Horarios con soporte de feriados y excepciones por fecha.
- **Por qué**: amenities (estacionamiento, vestuario, parrilla, bar) son drivers de elección. Rating con count visible es señal social. El soporte de feriados evita el bug clásico de mostrar disponibilidad en días no laborables.

### 9. Permalinks SEO-friendly y breadcrumbs

- **Esto tienen**: cada club tiene `permalink` (slug humano) usado en `/venues/<permalink>`. Breadcrumbs: `Inicio > Pádel > Hurlingham > <Club>`.
- **Esto queremos para CanchaYa**: slugs por club y por ciudad, breadcrumbs structured data (schema.org/BreadcrumbList).
- **Por qué**: Google Sport queries por nombre de club son altísimas (alguien busca "club tal pádel reservar"). Sin permalink + structured data no aparecen como first result.

### 10. Multi-país desde el modelo de datos

- **Esto tienen**: `location.zone.country` con `id`, `name`, `code`, `currency`, `currency_code`. Selector de país en home. La misma plataforma sirve 9 países.
- **Esto queremos para CanchaYa**: si está en roadmap salir de Argentina, modelar país/moneda/timezone desde ya. Si no lo está, al menos no asumir ARS hardcoded.
- **Por qué**: postergar la abstracción de país/moneda obliga a refactors caros cuando llega el primer cliente fuera. Tener `country.code` y `currency_code` desde el día 1 cuesta poco.

---

## Features secundarias notables (no top, pero anotables)

### Filtros e interacción en /results

- Filtro por **deporte** (chip seleccionado, se actualiza la URL).
- Filtro por **horario** (slot picker).
- Filtro por **fecha** (calendar picker, máx ~14 días adelante).
- Filtro por **placeId/locationName** (autocomplete con Google Places, devuelve geohash).
- Resultados ordenados por proximidad (no se ve toggle de orden alternativo).
- Cards de club con: logo, nombre, rating, distancia, amenities top, slots disponibles inline.

### Página de venue (`/venues/<permalink>`)

- Galería de fotos del club.
- Mapa embebido (probablemente Google Maps).
- Lista expandida de amenities con íconos.
- Grilla de canchas y horarios disponibles.
- Sección "Reseñas" con estrellas + texto.
- Botón "Llamar" con `tel:` directo.

### Checkout (`/checkout/<club_id>`)

- Resumen: club, cancha, deporte, fecha/hora, duración.
- Toggle de Beelup (si aplica).
- Datos del jugador (pre-llenados si está logueado).
- Forma de pago: tarjeta + alternativos según país (probable MercadoPago en AR).
- Línea de "Costo de servicio" con sponsor.
- T&C y política de cancelación visibles.

### Home

- Hero con buscador (deporte + ciudad + fecha/hora).
- "Soy hincha de" — selector de equipos para personalizar contenido. Es un gancho emocional inteligente; se podría usar para campañas y push.
- Sección "Software para clubes" — la versión B2B del producto. Marketplace de dos lados explícito.
- Carruseles por deporte y por ciudad.

### /reservas (mis reservas)

- Lista de reservas activas y pasadas.
- Botón cancelar (con regla de 24h).
- Link a comprobante.

### /profile

- Datos personales editables.
- **Nivel de juego** (locked, "Contactá a soporte para modificar"). Probablemente lo manejan con score interno + intervención manual.
- Historial.

---

## Patrones técnicos a robar

1. **`__NEXT_DATA__` como single source of truth para SSR**: simplifica testing (snapshot de pageProps).
2. **Money como integer cents + currency_code**: evita bugs clásicos de floats; multi-moneda gratis.
3. **Geohash en URLs**: corto, ordenable, prefijo = proximidad. Mejor que lat/lng en URL pública.
4. **Day-of-week como código de 2 letras (SU/MO/.../HO)**: incluye `HO` (holiday) como ciudadano de primera. Evita lookup separado de feriados.
5. **`business_hours_for_given_date` precomputado en backend**: el front no tiene que evaluar reglas.
6. **Slots como objetos atómicos** (no grilla): el backend decide qué se ofrece, el front solo pinta.
7. **Permalinks por club** generados de forma consistente y estables (URL no cambia si rebrandean el nombre).

---

## Anti-patrones / cosas que NO copiaríamos

- **Modal bloqueante de género + DOB en /matches antes de poder navegar**: hostil. Mejor ofrecer el filtro como opcional o pedirlo solo cuando el jugador intenta unirse a un match.
- **Nivel de juego "locked, contactá soporte"**: no escala. Mejor combinación de auto-declarado + ajuste algorítmico (estilo Elo simple).
- **404 con imagen humorística pero sin links útiles**: la página de error no ofrece búsqueda ni "volver a inicio".
- **Falta de orden alternativo en resultados** (precio asc/desc, rating): muchos usuarios buscan barato primero.
- **Fee de servicio fijo $250** sin transparencia de a qué corresponde (cuando no hay sponsor que lo cubra): genera fricción. Si vamos a cobrar, etiquetarlo claramente.

---

## Gap analysis sugerido para Claude Code

Dividido en buckets de prioridad. Cada item entendido como "verificar si existe en CanchaYa, si no, evaluar implementación".

### P0 — fundacionales (si no están, frenan todo)

- [ ] Modelo de slots atómicos (`duration`, `start`, `court_id`, `price.cents`)
- [ ] Money como `{ cents, currency }` en toda la API
- [ ] URL canónica de búsqueda con SSR/SSG
- [ ] Modelo de país/moneda/timezone desde la entidad club
- [ ] `business_hours` con soporte de feriados

### P1 — diferenciadores claros

- [ ] Seña parametrizable + política de cancelación 24h
- [ ] Permalinks SEO + breadcrumbs structured data
- [ ] Amenities normalizadas con íconos
- [ ] Catálogo amplio de deportes con metadata estructurada (no hardcoded a 2)
- [ ] Rating + count por club, visible en card

### P2 — features de retención y monetización

- [ ] Match-making / comunidades con filtros por nivel/género/edad
- [ ] Sistema de nivel de juego (auto-declarado + ajuste)
- [ ] Add-on de grabación de partidos (Beelup u otro)
- [ ] Modelo sponsor para cubrir fees (sales motion separado)
- [ ] "Soy hincha de" o equivalente para personalización

### P3 — quality of life

- [ ] Filtro por horario, fecha y deporte en results con chips
- [ ] Autocomplete con Google Places → geohash
- [ ] Galería de fotos por venue
- [ ] Mapa embebido en venue
- [ ] Reseñas con texto (no solo rating)
- [ ] Selector de país en home (si aplica multi-país)

---

## Schemas de referencia (extraídos de `__NEXT_DATA__`)

```ts
// Página /results — pageProps
interface ResultsPageProps {
  location: { lat: number; lng: number };
  placeId: string;       // geohash
  locationName: string;
  bookingsBySport: Club[];
  sportIds: number[];
  sportsMetadata: Sport[];
  day: string;           // YYYY-MM-DD
  hour: string;          // HH:mm
  sportOptions: Sport[];
  apiError: any;
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  token: string | null;
  test: any;
}

interface Club {
  id: number;
  name: string;
  state: "online" | "offline";
  logo_url: string;
  background_url: string;
  phone: string;
  location: {
    zone: {
      name: string;
      timezone: string;
      country: { id: number; name: string; code: string; currency: string; currency_code: string };
    };
    name: string;
    lat: number;
    lng: number;
  };
  geohash: string;
  permalink: string;
  rating: { stars: number; count: number };
  sport_ids: number[];
  amenities: { id: number; name: string; icon_url: string }[];
  business_hours: { day_of_week: "SU"|"MO"|"TU"|"WE"|"TH"|"FR"|"SA"|"HO"; open_time: string; close_time: string }[];
  business_hours_for_given_date: { open_time: string; close_time: string } | null;
  has_beelup: boolean;
  has_integration_with_f1: boolean;
  currency: string;
  bookings: Slot[];
}

interface Slot {
  duration: number;            // minutos: 60, 90, 120
  start: string;               // ISO con offset, ej "2026-04-23T22:00:00-03:00"
  price: { cents: number; currency: string };
  court_id: number;
}

interface Sport {
  value: number;       // id
  display: string;     // "Pádel"
  svgResource: string;
  order: number;
  playersMax: number;
  playersMin: number;
  defaultDuration: number;  // minutos
  parent: number | null;
  children: number[];
}
```

---

## Patrones de URL observados

| Pantalla | URL |
|---|---|
| Resultados | `/results?horario=22%3A00&tipoDeporte=7&dia=2026-04-23&placeId=<geohash>&locationName=...` |
| Venue | `/venues/<permalink>?sportIds=7&placeId=<geohash>&dia=2026-04-23&horario=22%3A00` |
| Checkout | `/checkout/<club_id>?day=2026-04-23&court=<court_id>&sport_id=7&duration=60&start=22%3A00&end=23%3A00&is_beelup=false` |
| Mis reservas | `/reservas` |
| Perfil | `/profile` |
| Comunidad | `/matches` |

---

## Recomendación de orden de implementación

1. **Asegurar fundacionales (P0)** — sin esto, lo demás se rompe. En particular: modelo de slots, money cents, business_hours con feriados.
2. **SEO + URLs canónicas (P1)** — gana tráfico orgánico antes de gastar en performance ads.
3. **Amenities, ratings, permalinks (P1)** — son cosméticos pero suben conversión medible.
4. **Match-making (P2)** — el bet más grande de retención. Pensarlo como producto separado dentro del mismo dominio.
5. **Sponsor / Beelup (P2)** — requiere sales motion (B2B) en paralelo al producto.

---

*Brief generado por exploración manual del sitio + inspección de `__NEXT_DATA__`. No incluye instrumentación de su API privada (los endpoints REST quedan invisibles porque la mayoría del data viene server-side renderizado). Si necesitan capturas de pantalla específicas o pruebas más profundas de algún flujo, avisar.*
