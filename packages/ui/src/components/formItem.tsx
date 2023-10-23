import styled from 'styled-components'
import { forwardRef } from 'react'

import type { FC, ReactNode } from 'react'

type Direction = 'horizontal' | 'vertical' | 'horizontal-rev'
type FontWeight = 'bold' | 'normal'
interface LabelProps {
  direction: Direction
  grow: number
  gap: string
  justifyContent: string
  alignItems: string
  fontSize: string
  fontWeight: FontWeight
}
interface FormItemProps {
  children: ReactNode
  label?: string
  direction?: Direction
  gap?: string
  grow?: number
  justifyContent?: string
  alignItems?: string
  fontWeight?: FontWeight
  fontSize?: string
}

const getFlexDirection = ({ direction }: LabelProps) => {
  switch (direction) {
    case 'vertical':
      return 'column'
    case 'horizontal':
      return 'row'
    case 'horizontal-rev':
      return 'row-reverse'
    default:
      return 'column'
  }
}
const getAlignItems = ({ alignItems }: LabelProps) => {
  if (alignItems) {
    return alignItems
  }

  return 'normal'
}
const getGap = ({ direction, gap }: LabelProps) => {
  if (gap) {
    return gap
  }

  if (direction === 'vertical') {
    return '4px'
  }

  return '8px'
}
const getJustifyContent = ({ direction, justifyContent }: LabelProps) => {
  if (justifyContent) {
    return justifyContent
  }

  if (direction === 'vertical') {
    return 'normal'
  }

  return 'center'
}
const Label = styled.label<LabelProps>`
  display: flex;
  flex-direction: ${getFlexDirection};
  align-items: ${getAlignItems};
  justify-content: ${getJustifyContent};
  gap: ${getGap};
  font-size: ${({ fontSize }) => fontSize};

  span:first-child {
    white-space: nowrap;
    font-weight: ${({ fontWeight }) => fontWeight ?? 600};
  }

  span:last-child {
    display: flex;
  }
`
const FormItem: FC<FormItemProps> = forwardRef<HTMLLabelElement, FormItemProps>(
  function FormItem(
    {
      children,
      label,
      direction = 'vertical',
      gap = '4px',
      grow = 0,
      justifyContent = 'normal',
      alignItems = 'normal',
      fontWeight = 'bold',
      fontSize = '14px'
    },
    ref
  ) {
    return (
      <Label
        ref={ref}
        direction={direction}
        gap={gap}
        grow={grow}
        justifyContent={justifyContent}
        alignItems={alignItems}
        fontWeight={fontWeight}
        fontSize={fontSize}>
        <span>{label ?? ''}</span>
        <span>{children}</span>
      </Label>
    )
  }
)

export { FormItem }
