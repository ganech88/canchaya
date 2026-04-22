import type { Config } from 'tailwindcss'
import preset from '@canchaya/ui/tailwind-preset'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [preset as Config],
  darkMode: ['class', '[data-theme="dark"]'],
}

export default config
