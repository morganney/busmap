import styled from 'styled-components'

import type { FC, ReactNode } from 'react'

type Direction = 'horizontal' | 'vertical'

const Label = styled.label<{ direction: Direction }>`
  display: flex;
  flex-direction: ${({ direction }) => (direction === 'vertical' ? 'column' : 'row')};
  align-items: ${({ direction }) => (direction === 'vertical' ? 'normal' : 'center')};
  gap: ${({ direction }) => (direction === 'vertical' ? 4 : 8)}px;

  span:last-child {
    flex-grow: ${({ direction }) => (direction === 'vertical' ? 0 : 1)};
  }
`

interface FormItemProps {
  children: ReactNode
  label?: string
  direction?: Direction
}

const FormItem: FC<FormItemProps> = ({ children, label, direction = 'vertical' }) => {
  return (
    <Label direction={direction}>
      <span>{label ?? ''}</span>
      <span>{children}</span>
    </Label>
  )
}

export { FormItem }
