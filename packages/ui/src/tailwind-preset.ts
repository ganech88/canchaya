import type { Config } from 'tailwindcss'
import { lightColors, fontFamily, fontSize, letterSpacing, borderWidth } from './tokens'

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        cy: lightColors,
      },
      fontFamily: {
        display: fontFamily.display as unknown as string[],
        condensed: fontFamily.condensed as unknown as string[],
        ui: fontFamily.ui as unknown as string[],
        'ui-bold': fontFamily['ui-bold'] as unknown as string[],
        mono: fontFamily.mono as unknown as string[],
        'mono-bold': fontFamily['mono-bold'] as unknown as string[],
      },
      fontSize: fontSize as unknown as Record<
        string,
        [string, { lineHeight?: string; letterSpacing?: string }]
      >,
      letterSpacing,
      borderWidth,
      borderRadius: {
        none: '0',
      },
    },
  },
}

export default preset
