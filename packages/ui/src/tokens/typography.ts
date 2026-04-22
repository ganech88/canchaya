// CanchaYa — typography tokens
//
// Hay dos nomenclaturas: Google Fonts usa nombres con espacios ("Archivo Black"),
// pero RN/expo-font registra con un key explícito. Para que el mismo preset Tailwind
// funcione en ambos lados, cada familia lista PRIMERO el nombre RN (sin espacios)
// y DESPUÉS el nombre web (con espacios). En web la CSS cae al segundo; en RN se usa
// solo el primero (RN ignora el resto del array).

export const fontFamily = {
  display: ['ArchivoBlack', 'Archivo Black', 'Impact', 'sans-serif'],
  condensed: ['BebasNeue', 'Bebas Neue', 'Impact', 'sans-serif'],
  ui: ['SpaceGrotesk', 'Space Grotesk', 'system-ui', 'sans-serif'],
  'ui-bold': ['SpaceGroteskBold', 'Space Grotesk', 'system-ui', 'sans-serif'],
  mono: ['JetBrainsMono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
  'mono-bold': ['JetBrainsMonoBold', 'JetBrains Mono', 'ui-monospace', 'monospace'],
} as const

export const fontSize = {
  eyebrow: ['10px', { letterSpacing: '0.2em', lineHeight: '1' }],
  mono10: ['10px', { letterSpacing: '0.14em', lineHeight: '1.2' }],
  mono11: ['11px', { letterSpacing: '0.08em', lineHeight: '1.2' }],
  body: ['13px', { lineHeight: '1.4' }],
  'cond-20': ['20px', { lineHeight: '0.95' }],
  'cond-22': ['22px', { lineHeight: '0.95' }],
  'display-22': ['22px', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
  'display-28': ['28px', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
  'display-40': ['40px', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
  'display-54': ['54px', { lineHeight: '0.88', letterSpacing: '-0.02em' }],
  'display-84': ['84px', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
  'display-110': ['110px', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
} as const

export const letterSpacing = {
  tighter: '-0.04em',
  tight: '-0.02em',
  normal: '0',
  wide: '0.06em',
  wider: '0.1em',
  widest: '0.2em',
} as const

export type FontFamilyToken = keyof typeof fontFamily

// Mapa explícito de font keys RN → display name que expo-font registra.
// Lo usa el app mobile en el loader de useFonts.
export const NATIVE_FONT_KEYS = {
  ArchivoBlack: 'ArchivoBlack',
  BebasNeue: 'BebasNeue',
  SpaceGrotesk: 'SpaceGrotesk',
  SpaceGroteskBold: 'SpaceGroteskBold',
  JetBrainsMono: 'JetBrainsMono',
  JetBrainsMonoBold: 'JetBrainsMonoBold',
} as const
