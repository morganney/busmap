import styled from 'styled-components'
import { forwardRef } from 'react'
import { Tooltip } from '@busmap/components/tooltip'

import type { FC, ReactNode, ReactElement } from 'react'

type Direction = 'horizontal' | 'vertical' | 'horizontal-rev'
type FontWeight = 'bold' | 'normal'
interface LabelProps {
  htmlFor?: string
  fontSize?: string
  fontWeight?: FontWeight
  direction?: Direction
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
  tip?: string
  htmlFor?: string
  icon?: ReactElement
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
const getAlignItems = ({ alignItems }: FormItemProps) => {
  if (alignItems) {
    return alignItems
  }

  return 'normal'
}
const getGap = ({ direction, gap }: FormItemProps) => {
  if (gap) {
    return gap
  }

  if (direction === 'vertical') {
    return '4px'
  }

  return '8px'
}
const getJustifyContent = ({ direction, justifyContent }: FormItemProps) => {
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
  gap: 4px;
  font-size: ${({ fontSize }) => fontSize};

  span:first-child {
    white-space: nowrap;
    font-weight: ${({ fontWeight }) => fontWeight ?? 600};
  }

  span:last-child {
    display: flex;
  }

  &[for] {
    width: min-content;
  }
`
const Wrap = styled.div<FormItemProps>`
  display: flex;
  flex-direction: ${getFlexDirection};
  align-items: ${getAlignItems};
  justify-content: ${getJustifyContent};
  gap: ${getGap};
  font-size: ${({ fontSize }) => fontSize};
`
const IconWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const renderLabelText = (label?: string, tip?: string) => {
  if (tip) {
    return (
      <Tooltip title={tip}>
        <span>{label ?? ''}</span>
      </Tooltip>
    )
  }

  return <span>{label ?? ''}</span>
}
const FormItem: FC<FormItemProps> = forwardRef<HTMLDivElement, FormItemProps>(
  function FormItem(
    {
      children,
      label,
      tip,
      icon,
      htmlFor,
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
      <Wrap
        ref={ref}
        direction={direction}
        gap={gap}
        grow={grow}
        justifyContent={justifyContent}
        alignItems={alignItems}
        fontWeight={fontWeight}
        fontSize={fontSize}>
        {htmlFor ? (
          <>
            {icon ? (
              <IconWrap>
                <Label htmlFor={htmlFor} direction={direction} fontWeight={fontWeight}>
                  {renderLabelText(label, tip)}
                </Label>
                {icon}
              </IconWrap>
            ) : (
              <Label htmlFor={htmlFor} direction={direction} fontWeight={fontWeight}>
                {renderLabelText(label, tip)}
              </Label>
            )}
            <span>{children}</span>
          </>
        ) : (
          <Label direction={direction} fontWeight={fontWeight}>
            {renderLabelText(label, tip)}
            <span>{children}</span>
          </Label>
        )}
      </Wrap>
    )
  }
)

export { FormItem }
