import styled from 'styled-components'

import type { FC, ReactNode } from 'react'

type Direction = 'horizontal' | 'vertical' | 'horizontal-rev'
type FontWeight = 'bold' | 'normal'
interface LabelProps {
  direction: Direction
  grow: number
  gap: string
  justifyContent: string
  fontSize: string
  fontWeight: FontWeight
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
const getAlignItems = ({ direction }: LabelProps) => {
  if (direction === 'vertical') {
    return 'normal'
  }

  return 'center'
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
const getGrow = ({ direction, grow }: LabelProps) => {
  if (typeof grow === 'number') {
    return grow
  }

  if (direction === 'vertical') {
    return 0
  }

  return 1
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

  span {
    display: inline-flex;
  }
  span:first-child {
    font-weight: ${({ fontWeight }) => fontWeight ?? 600};
  }
  span:last-child {
    flex-grow: ${getGrow};
  }
`

interface FormItemProps {
  children: ReactNode
  label?: string
  direction?: Direction
  gap?: string
  grow?: number
  justifyContent?: string
  fontWeight?: FontWeight
  fontSize?: string
}

const FormItem: FC<FormItemProps> = ({
  children,
  label,
  direction = 'vertical',
  gap = '4px',
  grow = 0,
  justifyContent = 'normal',
  fontWeight = 'bold',
  fontSize = '14px'
}) => {
  return (
    <Label
      direction={direction}
      gap={gap}
      grow={grow}
      justifyContent={justifyContent}
      fontWeight={fontWeight}
      fontSize={fontSize}>
      <span>{label ?? ''}</span>
      <span>{children}</span>
    </Label>
  )
}

export { FormItem }
