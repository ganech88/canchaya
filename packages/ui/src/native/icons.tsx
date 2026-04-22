// Wrapper de icons para RN — requiere `react-native-svg` en el app consumidor.

import { ICONS, type IconName } from '../icons'

// Los tipos los deja abiertos para evitar obligar a instalar react-native-svg en este paquete.
type SvgProps = { width?: number; height?: number; color?: string }

interface IconProps extends SvgProps {
  name: IconName
  size?: number
}

// Factory: recibe los componentes de react-native-svg desde el app y devuelve un componente Icon listo.
// Uso en apps/mobile:
//   import Svg, { Path, Circle } from 'react-native-svg'
//   import { createNativeIcon } from '@canchaya/ui/native'
//   export const Icon = createNativeIcon({ Svg, Path, Circle })
export function createNativeIcon(svg: {
  Svg: React.ComponentType<any>
  Path: React.ComponentType<any>
  Circle: React.ComponentType<any>
}) {
  const { Svg, Path, Circle } = svg
  return function Icon({ name, size = 16, color = 'currentColor' }: IconProps) {
    const def = ICONS[name]
    const isFilled = def.fill === 'currentColor'
    return (
      <Svg
        width={size}
        height={size}
        viewBox={def.viewBox}
        fill={isFilled ? color : 'none'}
        stroke={isFilled ? undefined : color}
        strokeWidth={def.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {def.paths.map((p, i) => {
          if ('circle' in p) {
            return (
              <Circle
                key={i}
                cx={p.circle.cx}
                cy={p.circle.cy}
                r={p.circle.r}
                fill={p.fill === 'currentColor' ? color : isFilled ? color : 'none'}
              />
            )
          }
          return <Path key={i} d={p.d} />
        })}
      </Svg>
    )
  }
}
