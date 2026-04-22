// CanchaYa — spacing tokens
// No hay escala rígida (el handoff lo aclara: "ritmo respiratorio"). Mantenemos la escala default de
// Tailwind para compatibilidad y agregamos algunos valores editoriales usados en los mocks.

export const spacingExtensions = {
  editorial: '28px',
} as const

export const borderWidth = {
  card: '2px', // cards editoriales
  chip: '1.5px', // chips y divisores
  thick: '4px', // dividers thick
  hair: '1px',
} as const

export const borderRadius = {
  // TODO: editorial = 0 en todo. Cualquier uso de radius > 0 debería justificarse.
  none: '0',
} as const
