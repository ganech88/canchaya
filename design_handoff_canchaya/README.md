# Handoff: CanchaYa — App de reserva de canchas

## Overview

**CanchaYa** es un marketplace de reserva de canchas deportivas (fútbol 5/8/11, pádel, tenis) con dos lados:

1. **App móvil (Android)** para jugadores: descubrir canchas cercanas, reservar, pagar, publicar "partidos abiertos" cuando faltan jugadores, chat del partido.
2. **Dashboard web** para dueños de complejos: calendario, gestión de canchas, analytics de reservas / bebidas / ingresos, configuración del negocio.

Mercado objetivo: **Latinoamérica** (ES-AR, pesos argentinos como moneda de referencia).

## About the Design Files

Los archivos adjuntos son **referencias de diseño creadas en HTML/React** — prototipos estáticos que muestran el look & feel y la estructura de la información deseada. **No son código de producción para copiar tal cual.**

La tarea es **recrear estos diseños en el stack que corresponda**. Si todavía no hay codebase, recomiendo:

- **App móvil:** React Native + Expo (cross-platform, rápido de iterar) o Flutter.
- **Dashboard web dueño:** Next.js 14+ (App Router) + TypeScript + Tailwind.
- **Backend:** Supabase (Auth + Postgres + Realtime + Storage) o Firebase. Alternativa self-hosted: Node/Fastify + Postgres + Prisma.
- **Mapas:** Mapbox GL o Google Maps Platform.
- **Pagos:** Mercado Pago (LATAM) + Stripe para cuentas internacionales.
- **Notificaciones push:** Expo Push / OneSignal / Firebase Cloud Messaging.

## Fidelity

**High-fidelity (hifi).** Los mocks usan colores, tipografía, espaciado y jerarquías finales. La intención estética es **editorial sports magazine** — grids fuertes, números gigantes tipo titular, tipografía display condensada, dominantes neutros + un acento saturado.

Recrear pixel-perfect donde sea razonable; cuando el codebase tenga un sistema ya existente, mantener la **personalidad editorial** (ver sección Design Tokens) aunque se traduzca a componentes del sistema.

---

## Design Tokens

### Colores (modo claro — default)

| Token | Hex | Uso |
|---|---|---|
| `--cy-bg` | `#f2ede1` | Fondo global (crema cálido) |
| `--cy-paper` | `#faf6ea` | Superficies / cards |
| `--cy-ink` | `#0d0d0d` | Texto principal, bordes, fills dark |
| `--cy-ink-2` | `#2a2a2a` | Texto secundario |
| `--cy-muted` | `#6b6557` | Texto terciario / metadatos |
| `--cy-line` | `#0d0d0d` | Bordes (2px en cards, 1.5px en divisores) |
| `--cy-accent` | `#c6ff1a` | Lima eléctrico — CTA, highlights |
| `--cy-accent-2` | `#e8ff5e` | Lima claro |
| `--cy-red` | `#ff3b1f` | Titulares de sección, alertas, badges hot |
| `--cy-field` | `#0a3d1f` | Verde césped (placeholders de cancha) |
| `--cy-sand` | `#e6dfcd` | Fondo placeholders / disabled |

### Modo oscuro

Invierte `--cy-bg`→`#0b0b0b`, `--cy-paper`→`#141414`, `--cy-ink`→`#faf6ea`. Acento lima se mantiene.

### Tipografía (Google Fonts)

| Rol | Fuente | Uso |
|---|---|---|
| **Display** | `Archivo Black` | Titulares gigantes, números de KPI. `letter-spacing: -0.02em`, `line-height: 0.9`, `text-transform: uppercase` |
| **Condensed** | `Bebas Neue` | Subtítulos de sección, labels de cancha |
| **UI / body** | `Space Grotesk` (400/500/600/700) | Texto de interfaz general |
| **Mono** | `JetBrains Mono` (400/500/700) | Metadatos, fechas, precios, badges, "§ SECCIÓN", data numérica |

### Estilos de tipografía editorial

- **Eyebrow / sección:** `JetBrains Mono`, 10px, `letter-spacing: .2em`, `text-transform: uppercase`, color `--cy-red`, prefijo `§ `.
- **Titular principal:** `Archivo Black`, 40-110px según contexto, `line-height: 0.9`.
- **Dividers:** `border-top: 4px solid var(--cy-line)` (thick) o `2px` (normal) o `1px` (en listas).

### Sistema de espaciado

No hay escala rígida — estilo editorial, ritmo respiratorio. Valores típicos: `6, 8, 10, 12, 14, 16, 20, 28`.

### Bordes y cards

- Cards: `border: 2px solid var(--cy-line)`, **sin border-radius** (look editorial).
- Chips: `border: 1.5px solid`, padding `4px 10px`, mono 10px.
- Buttons: `border: 2px solid`, sin radius, padding `14px 18px`.

### Iconografía

SVGs inline minimalistas stroke-based (stroke-width 2). Ver `components-shared.jsx` → objeto `Icon` para el set completo: search, mapPin, clock, arrow, chev, bolt, plus, filter, star, ball, padel, back, heart, home, map, user, chat, close, menu, trend.

### Placeholders de imagen

Patrón rayado diagonal (`repeating-linear-gradient 45deg`) + label mono. Variantes:
- `.field` — verde cancha con grid
- `.accent` — lima
- `.dark` — negro
- default — arena/crema

**En producción, reemplazar con fotos reales** de las canchas, perfiles, etc.

---

## Arquitectura de pantallas

### Lado USUARIO (app móvil Android, 360×740)

1. **Home / Descubrimiento** (`ScreenHome`): masthead tipo revista, hero "JUGÁ CERCA.", búsqueda, chips de deporte, card destacada, promo "partido abierto", lista "cerca tuyo", bottom nav.
2. **Búsqueda + filtros** (`ScreenSearch`): barra de búsqueda activa, panel de filtros (deporte/precio/horario/extras), contador de resultados, lista.
3. **Mapa** (`ScreenMap`): mapa full-screen con pins de precio, FAB de recentrar, bottom sheet de preview.
4. **Detalle + calendario** (`ScreenDetail`): hero image, stats del complejo, strip de días, grid de turnos con estado disponible/ocupado/seleccionado, breakdown de precio, CTA de pago.
5. **Partido abierto** (`ScreenOpenMatch`): crear convocatoria — cancha ya reservada, grid de jugadores (8/10), nivel, aporte por jugador, alcance estimado, CTA "publicar".
6. **Popup "¿te sumás?"** (`ScreenPopup`): overlay modal al recibir una convocatoria cerca — título "FALTAN DOS.", stats (aporte/distancia/cupo), CTAs "ahora no" / "me sumo".
7. **Perfil** (`ScreenProfile`): avatar + identidad, stats (partidos/goles/rating), breakdown por deporte, historial.
8. **Chat del partido** (`ScreenChat`): header del partido, info pinneada (ubicación + aporte), mensajes con eventos de sistema (pagos recibidos, jugador se unió), input.

### Lado DUEÑO (web, 1280×820 en Chrome)

1. **Dashboard** (`OwnerDashboard`): 4 KPIs, agenda del día (timeline de turnos), canchas en vivo, alertas (stock bajo, recurrencias), ranking de bebidas, gráfico de ingresos 30d.
2. **Calendario semanal** (`OwnerCalendar`): grid 7 días × 10 horas con bloques de reserva coloreados por estado, toggle día/semana/mes, footer de stats.
3. **Canchas** (`OwnerCourts`): grid de cards (6 canchas), foto + status + precio + ocupación 30d + CTAs editar/tarifas, tabs por deporte.
4. **Detalle de reserva** (`OwnerBookingDetail`): ficha de la reserva (hora/duración/cancha/personas), breakdown económico, historial de eventos, sidebar con titular (cliente recurrente), nota interna, grid de participantes.
5. **Analytics bebidas** (`OwnerDrinks`): 4 KPIs (ingreso/unidades/ticket/margen), top 8 productos con barras, mix por categoría (segmented bar), insight card, lista de reposición, heatmap día×hora.
6. **Configuración** (`OwnerSettings`): nav lateral de secciones, formulario de negocio, deportes ofrecidos, comodidades con toggles, zona de peligro.

---

## Interacciones & Behavior

### Críticas para implementar

- **Geolocalización en tiempo real** (usuario): listar canchas por distancia, filtrar por radio.
- **Popup de partido abierto**: push notification push cuando un partido dentro de X km empieza a buscar jugadores. Necesita geofencing + pub/sub.
- **Calendario con disponibilidad real-time**: WebSocket/Supabase Realtime para que dos usuarios no reserven el mismo turno.
- **Pagos split**: dividir un turno entre N jugadores; cada uno paga su parte. Mercado Pago Split Payments o flujo custom.
- **Chat del partido**: canal por partido, mensajes de sistema para eventos (pagos, join/leave).
- **Bloqueo de turno** (dueño): cerrar huecos manualmente (mantenimiento, evento privado).

### Animaciones

- Transiciones entre pantallas del mobile: slide horizontal 240ms `cubic-bezier(.2,.7,.3,1)`.
- Popup: fade + scale-in del dialog 180ms, overlay fade 200ms.
- Botones: `scale(0.97)` en active, 100ms.
- Heatmap: hover para ver tooltip con valor exacto.

### Estados que faltan diseñar (pedir al diseñador o improvisar)

- Loading / skeleton screens
- Empty states (sin reservas, sin canchas cerca)
- Error states (pago fallido, sin conexión)
- Onboarding (primera vez)
- Login / registro
- Detalle de partido abierto desde el punto de vista del que se suma

---

## Data model sugerido

```
User { id, name, phone, email, avatar, level, stats: { matches, goals, rating } }
Venue { id, name, owner_id, address, lat, lng, sports[], amenities[], photos[], description }
Court { id, venue_id, name, sport, surface, covered, base_price, active }
PriceRule { court_id, day_of_week, hour_start, hour_end, price, discount_rule }
Booking { id, court_id, starts_at, ends_at, total, status: pending|confirmed|paid|cancelled|done, party_size, notes }
BookingParticipant { booking_id, user_id, paid_amount, paid_at }
OpenMatch { id, booking_id, spots_total, spots_filled, level, price_per_player, visible_radius_km, expires_at }
Product { venue_id, name, category, price, stock }
Sale { venue_id, booking_id?, items[], total, paid_at }
ChatMessage { booking_id, from_user_id, text, system?, created_at }
```

---

## Archivos incluidos

- `CanchaYa.html` — entry point. Monta todo dentro de `<DesignCanvas>`. Incluye el panel de Tweaks.
- `styles.css` — tokens, componentes reutilizables (chips, botones, placeholders), modo oscuro.
- `components-shared.jsx` — `Icon`, `Chip`, `MastheadMobile`, `BottomNav`, `CourtType`, `Rating`.
- `user-screens.jsx` — las 8 pantallas del usuario (ver sección Arquitectura).
- `owner-screens.jsx` — las 6 pantallas del dueño (ver sección Arquitectura).
- `design-canvas.jsx`, `android-frame.jsx`, `browser-window.jsx` — **no recrear**, son solo para presentar los diseños en el canvas.

Para ver los diseños: abrir `CanchaYa.html` en un navegador. Pan/zoom con trackpad, click en cualquier artboard para enfocarlo, ←/→ para navegar entre variantes.

---

## Recomendaciones para el implementador

1. **Setear los tokens CSS primero** — copiar la sección de `:root` de `styles.css` tal cual, adaptando a Tailwind theme / styled-components / lo que use el stack.
2. **Construir primero los átomos** — Chip, Button (ink/accent/ghost), Field, Masthead, Placeholder — antes de armar pantallas.
3. **Mobile-first** — la app usuario es el 70% del producto, empezar por ahí.
4. **Respetar la personalidad editorial** — bordes sólidos (NO rounded), números gigantes, mono para metadatos, dominante neutra + acento lima. El look se pierde si se redondean las cards o se usan sombras.
5. **Contenido en español rioplatense** — copiar tal cual los textos (ej: "Jugá cerca", "Te sumás", "$2.6K", "p/u").
