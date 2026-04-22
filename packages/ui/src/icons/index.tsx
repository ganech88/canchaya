// CanchaYa — Icon set (minimal stroke-based SVGs).
// Los mismos paths sirven para web (DOM SVG) y para native vía react-native-svg en los componentes consumidores.
// Acá exportamos los paths crudos y los componentes web; para RN hay wrappers en `../native/icons.tsx`.

import type { SVGProps } from 'react'

export type IconName =
  | 'search'
  | 'mapPin'
  | 'clock'
  | 'arrow'
  | 'chev'
  | 'bolt'
  | 'plus'
  | 'filter'
  | 'star'
  | 'dot'
  | 'ball'
  | 'padel'
  | 'back'
  | 'heart'
  | 'home'
  | 'map'
  | 'user'
  | 'chat'
  | 'close'
  | 'menu'
  | 'trend'

type IconDef = {
  viewBox: string
  strokeWidth?: number
  fill?: 'none' | 'currentColor'
  paths: Array<
    | { d: string }
    | { circle: { cx: number; cy: number; r: number }; fill?: 'currentColor' }
  >
}

export const ICONS: Record<IconName, IconDef> = {
  search: {
    viewBox: '0 0 16 16',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ circle: { cx: 7, cy: 7, r: 5 } }, { d: 'M11 11l4 4' }],
  },
  mapPin: {
    viewBox: '0 0 16 16',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M8 14s5-4.5 5-8.5a5 5 0 00-10 0C3 9.5 8 14 8 14z' }, { circle: { cx: 8, cy: 5.5, r: 1.8 } }],
  },
  clock: {
    viewBox: '0 0 16 16',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ circle: { cx: 8, cy: 8, r: 6.5 } }, { d: 'M8 4.5V8l2.5 2' }],
  },
  arrow: {
    viewBox: '0 0 16 16',
    strokeWidth: 2.4,
    fill: 'none',
    paths: [{ d: 'M3 8h10M9 4l4 4-4 4' }],
  },
  chev: {
    viewBox: '0 0 12 12',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M4 2l4 4-4 4' }],
  },
  bolt: {
    viewBox: '0 0 12 12',
    fill: 'currentColor',
    paths: [{ d: 'M7 0L2 7h3l-1 5 5-7H6l1-5z' }],
  },
  plus: {
    viewBox: '0 0 14 14',
    strokeWidth: 2.2,
    fill: 'none',
    paths: [{ d: 'M7 2v10M2 7h10' }],
  },
  filter: {
    viewBox: '0 0 14 14',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M1 3h12M3 7h8M5 11h4' }],
  },
  star: {
    viewBox: '0 0 12 12',
    fill: 'currentColor',
    paths: [{ d: 'M6 0.5l1.6 3.4 3.7.4-2.8 2.6.8 3.6L6 8.8 2.7 10.5l.8-3.6L.7 4.3l3.7-.4L6 .5z' }],
  },
  dot: {
    viewBox: '0 0 6 6',
    fill: 'currentColor',
    paths: [{ circle: { cx: 3, cy: 3, r: 3 } }],
  },
  ball: {
    viewBox: '0 0 14 14',
    strokeWidth: 1.6,
    fill: 'none',
    paths: [
      { circle: { cx: 7, cy: 7, r: 6 } },
      { d: 'M7 1l2.3 3L7 5l-2.3-1L7 1zM1 7l3-1 1 2-2 2L1 7zm12 0l-2 3-2-2 1-2 3 1zM5 12l1-3h2l1 3-2 1-2-1z' },
    ],
  },
  padel: {
    viewBox: '0 0 14 14',
    strokeWidth: 1.6,
    fill: 'none',
    paths: [
      { circle: { cx: 7, cy: 5, r: 4 } },
      { d: 'M7 9v4M5 13h4' },
      { circle: { cx: 5.5, cy: 4, r: 0.5 }, fill: 'currentColor' },
      { circle: { cx: 8, cy: 3.5, r: 0.5 }, fill: 'currentColor' },
      { circle: { cx: 8.5, cy: 6, r: 0.5 }, fill: 'currentColor' },
      { circle: { cx: 5.5, cy: 6.5, r: 0.5 }, fill: 'currentColor' },
    ],
  },
  back: { viewBox: '0 0 18 18', strokeWidth: 2.2, fill: 'none', paths: [{ d: 'M11 3L5 9l6 6' }] },
  heart: {
    viewBox: '0 0 16 16',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M8 14s-5.5-3.5-5.5-7.5A3 3 0 018 4.5 3 3 0 0113.5 6.5C13.5 10.5 8 14 8 14z' }],
  },
  home: { viewBox: '0 0 18 18', strokeWidth: 2, fill: 'none', paths: [{ d: 'M3 8l6-5 6 5v7H3V8z' }] },
  map: {
    viewBox: '0 0 18 18',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M1 4l5-2 6 2 5-2v12l-5 2-6-2-5 2V4zM6 2v12M12 4v12' }],
  },
  user: {
    viewBox: '0 0 18 18',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ circle: { cx: 9, cy: 6, r: 3 } }, { d: 'M2 16c1-3.5 4-5 7-5s6 1.5 7 5' }],
  },
  chat: {
    viewBox: '0 0 18 18',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M2 4h14v9H7l-4 3v-3H2V4z' }],
  },
  close: { viewBox: '0 0 14 14', strokeWidth: 2.2, fill: 'none', paths: [{ d: 'M2 2l10 10M12 2L2 12' }] },
  menu: { viewBox: '0 0 18 18', strokeWidth: 2, fill: 'none', paths: [{ d: 'M2 5h14M2 9h14M2 13h14' }] },
  trend: {
    viewBox: '0 0 16 16',
    strokeWidth: 2,
    fill: 'none',
    paths: [{ d: 'M1 12l5-5 3 3 6-7M10 3h5v5' }],
  },
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 16, ...rest }: IconProps) {
  const def = ICONS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox={def.viewBox}
      fill={def.fill ?? 'none'}
      stroke={def.fill === 'currentColor' ? undefined : 'currentColor'}
      strokeWidth={def.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {def.paths.map((p, i) => {
        if ('circle' in p) {
          return (
            <circle
              key={i}
              cx={p.circle.cx}
              cy={p.circle.cy}
              r={p.circle.r}
              fill={p.fill ?? (def.fill === 'currentColor' ? 'currentColor' : 'none')}
            />
          )
        }
        return <path key={i} d={p.d} />
      })}
    </svg>
  )
}
