import styled from 'styled-components'
import MuiAlert from '@mui/material/Alert'
import { forwardRef } from 'react'

import type { FC, SyntheticEvent, ReactNode } from 'react'

interface AlertProps {
  type?: 'warning' | 'success' | 'error' | 'info'
  variant?: 'filled' | 'outlined' | 'standard'
  children: ReactNode
  icon?: ReactNode
  fullWidth?: boolean
  fontSize?: string
  onClose?: (evt: SyntheticEvent | Event | CustomEvent) => void
}
type AlertRef = HTMLDivElement

const AlertBase = styled(MuiAlert)<{ $fullWidth: boolean; $fontSize: string }>`
  &.MuiAlert-root {
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

    .MuiAlert-message {
      width: 100%;
      font-size: ${({ $fontSize }) => $fontSize};
    }

    .MuiAlert-action {
      .MuiSvgIcon-root {
        font-size: 20px;
      }
    }
  }
`
const Alert: FC<AlertProps> = forwardRef<AlertRef, AlertProps>(function Alert(
  {
    children,
    icon,
    onClose,
    type = 'info',
    variant = 'standard',
    fullWidth = false,
    fontSize = '14px'
  },
  ref
) {
  return (
    <AlertBase
      ref={ref}
      severity={type}
      variant={variant}
      icon={icon}
      $fontSize={fontSize}
      $fullWidth={fullWidth}
      onClose={onClose}>
      {children}
    </AlertBase>
  )
})

export { Alert }
export type { AlertProps, AlertRef }
