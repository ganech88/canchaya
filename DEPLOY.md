# Deploy · CanchaYa

Tres entornos: **dev local**, **preview Vercel** (web) y **build Android** (mobile).

---

## 1 · Ver la web local

```bash
pnpm --filter @canchaya/web dev
```

Abre en http://localhost:3000. Navegá `/`, `/results`, `/venues/la-bombonerita`, `/matches`, `/login`, `/owner/dashboard`.

La web arranca **sin Supabase** — los screens se nutren de mocks de `src/data/*`. El form de `/login` muestra el aviso "demo · no configurado" hasta que linkees el proyecto.

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
4. **Environment Variables** → agregar:

   | Key | Value (por ahora) |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder-key-change-when-ready` |

   *(Estos placeholders evitan que el form de auth tire un error en runtime. Cuando el proyecto Supabase esté activo, los reemplazás con los reales.)*

5. Click **Deploy**. En ~2-3 minutos la URL queda disponible: `https://canchaya.vercel.app` (o similar).

### Deploys automáticos

Cada push a `main` deploya automáticamente. Para preview de otras branches, Vercel crea URLs únicas.

### Cuando Supabase esté activo

1. Conseguir las credenciales del proyecto (dashboard de Supabase → API settings).
2. En Vercel → Project Settings → **Environment Variables** → editar las dos keys.
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
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server actions / route handlers — nunca al cliente)

### `apps/mobile`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

*(Los env vars con prefix `NEXT_PUBLIC_` / `EXPO_PUBLIC_` son inline-eados en el bundle y visibles al cliente. El `SERVICE_ROLE_KEY` nunca lleva prefix — solo backend.)*

---

## Troubleshooting

- **Vercel dice "No Next.js version detected"** → asegurarse de que el `Root Directory` esté vacío (no `apps/web`).
- **El build de Vercel tarda mucho** → el primer build puede tardar 3-5 min por la instalación de deps. Los siguientes usan cache.
- **Expo Go no carga la app** → probar con `--tunnel`, o asegurarse de que ambos estén en la misma WiFi.
- **EAS Build falla con "keystore not configured"** → correr `eas credentials` y elegir "generate new keystore".
- **APK instalado pero no abre** → revisar Logcat (ADB) o usar `eas build --profile development` con Metro para ver errores.
