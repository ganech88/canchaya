// CanchaYa — color tokens (editorial sports magazine)
// Hex values se reparten como CSS vars (`--cy-*`) y como claves Tailwind (`bg-cy-ink`, `text-cy-accent`, etc).

export const lightColors = {
  bg: '#f2ede1', // fondo global crema cálido
  paper: '#faf6ea', // superficies / cards
  ink: '#0d0d0d', // texto principal, bordes, fills dark
  'ink-2': '#2a2a2a', // texto secundario
  muted: '#6b6557', // texto terciario / metadatos
  line: '#0d0d0d', // bordes
  accent: '#c6ff1a', // lima eléctrico — CTA, highlights
  'accent-2': '#e8ff5e', // lima claro
  red: '#ff3b1f', // titulares de sección, alertas, badges hot
  field: '#0a3d1f', // verde césped
  'field-2': '#0e5128',
  sand: '#e6dfcd', // fondo placeholders / disabled
  dark: '#0b0b0b',
} as const

export const darkColors = {
  bg: '#0b0b0b',
  paper: '#141414',
  ink: '#faf6ea',
  'ink-2': '#d8d3c4',
  muted: '#8a8473',
  line: '#faf6ea',
  accent: '#c6ff1a',
  'accent-2': '#e8ff5e',
  red: '#ff3b1f',
  field: '#0a3d1f',
  'field-2': '#0e5128',
  sand: '#1d1d1d',
  dark: '#0b0b0b',
} as const

export type ColorToken = keyof typeof lightColors

export const colors = lightColors
