import MuiTooltip from '@mui/material/Tooltip'
import styled from 'styled-components'

import type { FC, ReactNode } from 'react'

type UnderlineStyle = 'dashed' | 'dotted' | 'solid' | 'double' | 'unset'
interface TooltipProps {
  children: ReactNode
  title: string
  placement?: 'top' | 'bottom' | 'right' | 'left'
  underline?: UnderlineStyle
}

const Wrap = styled.div<{ underline: UnderlineStyle }>`
  text-decoration: ${({ underline }) => (underline ? `underline ${underline}` : 'none')};
`
const Tooltip: FC<TooltipProps> = ({
  children,
  underline = 'dotted',
  placement = 'top',
  title = ''
}) => {
  return (
    <MuiTooltip title={title} placement={placement}>
      <Wrap underline={underline}>{children}</Wrap>
    </MuiTooltip>
  )
}

export type { TooltipProps }
export { Tooltip }
