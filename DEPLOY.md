# Deploy · CanchaYa

Tres entornos: **dev local**, **preview Vercel** (web) y **build Android** (mobile).

---

## 1 · Ver la web local

```bash
pnpm --filter @canchaya/web dev
```

Abre en http://localhost:3000. Navegá `/`, `/results`, `/venues/la-bombonerita`, `/matches`, `/login`, `/owner/dashboard`.

La web arranca **sin Nhost** — los screens se nutren de mocks de `src/data/*`. El form de `/login` muestra el aviso "demo · no configurado" hasta que setees `NEXT_PUBLIC_NHOST_SUBDOMAIN` y `NEXT_PUBLIC_NHOST_REGION`.

---

## 2 · Deploy a Vercel

**Requisito:** cuenta en [vercel.com](https://vercel.com) conectada a GitHub.

### Setup inicial (una vez)

1. Ir a https://vercel.com/new
2. **Import Git Repository** → seleccionar `ganech88/canchaya`
3. En el formulario:
   - **Project Name:** `canchaya` (o el que prefieras — cambia la URL)
   - **Framework Preset:** Vercel debería autodetectar Next.js (si no, elegir **Next.js**)
   - **Root Directory:** dejá **vacío** (la config vive en `/vercel.json` de la raíz)
   - **Build & Output Settings:** no toques nada (ya están en `vercel.json`)
4. **Environment Variables** → agregar las del proyecto Nhost:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_NHOST_SUBDOMAIN` | `nqcsdeicmgstgjuikqxn` (o el subdomain del proyecto) |
   | `NEXT_PUBLIC_NHOST_REGION` | `sa-east-1` |

   *(Si no están seteadas, el form de auth muestra el aviso "demo · no configurado" y deshabilita el submit, en vez de tirar error.)*

5. Click **Deploy**. En ~2-3 minutos la URL queda disponible: `https://canchaya.vercel.app` (o similar).

### Deploys automáticos

Cada push a `main` deploya automáticamente. Para preview de otras branches, Vercel crea URLs únicas.

### Rotar credenciales de Nhost

Si cambia el subdomain (proyecto recreado) o se rota el admin secret:

1. En el dashboard de Nhost → Settings → General copiar el subdomain.
2. En Vercel → Project Settings → **Environment Variables** → editar.
3. Redeploy (automatic desde "Deployments" → "Redeploy").

---

## 3 · Descargar la app Android

### Opción A — Expo Go (la más rápida, 5 minutos)

Ideal para **probar el layout** sin esperar un build. No genera APK descargable, pero abre la app dentro de Expo Go.

1. Bajar **Expo Go** desde Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent
2. En tu PC, correr:
   ```bash
   pnpm --filter @canchaya/mobile dev
   ```
3. Escanear el **QR** que aparece en la terminal con la cámara del celular. Se abre Expo Go con la app.

**Limitaciones:** el celular y la PC deben estar en la **misma red WiFi**. Si no funciona, usar tunnel: `pnpm --filter @canchaya/mobile dev -- --tunnel`.

---

### Conectar el APK al banner web

Una vez que EAS Build termina, te da una URL del artefacto tipo
`https://expo.dev/artifacts/eas/xxxxx.apk`. Esa URL es descargable directo
desde cualquier device Android.

Para que el banner "Instalar" en la web y la página `/app` apunten ahí:

1. En **Vercel** → project settings → Environment Variables → agregar:
   ```
   NEXT_PUBLIC_ANDROID_APK_URL=https://expo.dev/artifacts/eas/xxxxx.apk
   ```
2. Redeploy (automático al próximo push, o manual desde Deployments).
3. Cualquier visitante Android ve ahora el botón "Instalar" activo y la página
   `/app` tiene el botón "Descargar APK" como primario.

---

### Opción B — APK descargable con EAS Build (20–30 minutos)

Esta sí genera un `.apk` que podés **descargar, instalar y compartir** con otros.

**Requisito:** cuenta en [expo.dev](https://expo.dev) (gratis).

#### Setup (una vez)

```bash
# Instalar EAS CLI globalmente
pnpm add -g eas-cli

# Login
eas login
```

#### Configurar el proyecto

```bash
cd apps/mobile
eas build:configure
```

La primera vez te va a pedir link a tu cuenta y genera un project ID. Guardalo.

#### Primer build (preview)

```bash
cd apps/mobile
eas build --platform android --profile preview
```

- EAS te pide confirmar las credenciales del keystore — dejá que EAS las genere automáticamente (**"Generate new keystore"**).
- El build corre en los servidores de Expo. **20–30 minutos** la primera vez; los siguientes son más rápidos por el cache.
- Cuando termina, te da una URL tipo `https://expo.dev/accounts/tu-usuario/projects/canchaya/builds/<id>`. Abrila desde el celular y hacés click en **Install**. Listo, APK instalado.

#### Perfiles disponibles

| Perfil | Qué hace | Cuándo usar |
|---|---|---|
| `development` | APK con dev client — necesita Metro corriendo para refrescar cambios | Desarrollo con iteración rápida |
| `preview` | APK standalone — se instala y corre sin Metro. La app ejecuta el bundle compilado al momento del build | Compartir con testers, probar en real |
| `production` | `.aab` (Android App Bundle) optimizado para Google Play Store | Release oficial |

#### Actualizar la app sin rebuild

Con `eas-update` podés pushear cambios de JS/assets sin rebuildar el APK:

```bash
cd apps/mobile
eas update --branch preview --message "Fix en ScreenHome"
```

(Requiere que el APK haya sido built con el plugin `expo-updates`. Se agrega después si hace falta.)

---

## Variables de entorno

### `apps/web`
- `NEXT_PUBLIC_NHOST_SUBDOMAIN`
- `NEXT_PUBLIC_NHOST_REGION`
- `NHOST_ADMIN_SECRET` (solo server actions / route handlers — nunca al cliente)
- `NEXT_PUBLIC_ANDROID_APK_URL` (opcional) — URL directa del APK. Si está, el banner de
  Android y la página `/app` linkean directo al archivo; si no, `/app` muestra
  instrucciones de Expo Go como fallback.

### `apps/mobile`
- `EXPO_PUBLIC_NHOST_SUBDOMAIN`
- `EXPO_PUBLIC_NHOST_REGION`
- `EXPO_PUBLIC_MAPBOX_TOKEN` (opcional, todavía no integrado)

### Nhost Functions (server-side, set en dashboard Nhost → Settings → Env Vars)
- `MP_ACCESS_TOKEN` — APP_USR-... del marketplace de Mercado Pago
- `MP_WEBHOOK_SECRET` — secret para validar firma del webhook MP (TODO: validación)
- `APP_URL` — `https://canchaya.vercel.app` (para back_urls + notification_url)
- `APP_DEEP_LINK` — `canchaya://` (scheme del mobile para redirect post-pago)

*(Los env vars con prefix `NEXT_PUBLIC_` / `EXPO_PUBLIC_` son inline-eados en el bundle y visibles al cliente. El `NHOST_ADMIN_SECRET` nunca lleva prefix — solo backend.)*

---

## Backend Nhost: aplicar cambios

El proyecto Nhost ya está activo en `nqcsdeicmgstgjuikqxn.sa-east-1`. Para aplicar cambios al schema, permissions o seeds:

### Schema (SQL)

```bash
# Aplicar una migration nueva (idempotente con IF NOT EXISTS / ON CONFLICT)
node -e "
const fs = require('fs');
const sql = fs.readFileSync('nhost/migrations/default/<NEW_FILE>.sql', 'utf8');
fetch('https://nqcsdeicmgstgjuikqxn.hasura.sa-east-1.nhost.run/v2/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': process.env.NHOST_ADMIN_SECRET },
  body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql } }),
}).then(r => r.text()).then(console.log);
"
```

### Permissions + relationships

```bash
NHOST_ADMIN_SECRET='...' node nhost/metadata/apply-metadata.mjs
```

Idempotente — re-correr es no-op.

### Seeds (catálogos + dev data)

```bash
# Mismo patrón que schema, apuntando a nhost/seeds/<file>.sql
```

### Functions (Mercado Pago)

Las functions en `nhost/functions/` se deployan via Nhost CLI:

```bash
npm install -g nhost
nhost login --pat <PAT>
nhost link --subdomain nqcsdeicmgstgjuikqxn
nhost deploy
```

Antes de deployar: setear `MP_ACCESS_TOKEN` y demás env vars en el dashboard (Settings → Environment Variables).

---

## Troubleshooting

- **Vercel dice "No Next.js version detected"** → asegurarse de que el `Root Directory` esté vacío (no `apps/web`).
- **El build de Vercel tarda mucho** → el primer build puede tardar 3-5 min por la instalación de deps. Los siguientes usan cache.
- **Expo Go no carga la app** → probar con `--tunnel`, o asegurarse de que ambos estén en la misma WiFi.
- **EAS Build falla con "keystore not configured"** → correr `eas credentials` y elegir "generate new keystore".
- **APK instalado pero no abre** → revisar Logcat (ADB) o usar `eas build --profile development` con Metro para ver errores.
