// CanchaYa — typography tokens
// 4 familias: Display (Archivo Black), Condensed (Bebas Neue), UI (Space Grotesk), Mono (JetBrains Mono).

export const fontFamily = {
  display: ['Archivo Black', 'Bebas Neue', 'Impact', 'sans-serif'],
  condensed: ['Bebas Neue', 'Impact', 'sans-serif'],
  ui: ['Space Grotesk', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
} as const

// Escalas editoriales concretas (no una escala rígida; replican lo que aparece en los mocks).
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
