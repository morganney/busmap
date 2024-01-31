import MuiTooltip from '@mui/material/Tooltip'
import styled from 'styled-components'

import type { FC, ReactNode } from 'react'

type UnderlineStyle = 'dashed' | 'dotted' | 'solid' | 'double' | 'unset'
interface TooltipProps {
  className?: string
  children: ReactNode
  title: string
  fontSize?: string
  placement?: 'top' | 'bottom' | 'right' | 'left'
  underline?: UnderlineStyle
}

const Tip = styled.span<{ $fontSize: string }>`
  font-size: ${({ $fontSize }) => $fontSize};
`
const Wrap = styled.div<{ underline: UnderlineStyle }>`
  text-decoration: ${({ underline }) => (underline ? `underline ${underline}` : 'none')};
`
const Tooltip: FC<TooltipProps> = ({
  className,
  children,
  underline = 'dotted',
  placement = 'top',
  fontSize = '12px',
  title = ''
}) => {
  return (
    <MuiTooltip
      describeChild
      title={<Tip $fontSize={fontSize}>{title}</Tip>}
      placement={placement}
      className={className}>
      <Wrap underline={underline}>{children}</Wrap>
    </MuiTooltip>
  )
}

export type { TooltipProps }
export { Tooltip }
