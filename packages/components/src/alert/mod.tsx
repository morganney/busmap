import styled from 'styled-components'
import MuiAlert from '@mui/material/Alert'
import { forwardRef } from 'react'

import type { FC, SyntheticEvent } from 'react'

interface AlertProps {
  type?: 'warning' | 'success' | 'error' | 'info'
  variant?: 'filled' | 'outlined' | 'standard'
  message: string
  onClose?: (evt: SyntheticEvent | Event | CustomEvent) => void
}
type AlertRef = HTMLDivElement

const AlertBase = styled(MuiAlert)`
  &.MuiAlert-standard {
    /* example of how to override mui styles */
  }
`
const Alert: FC<AlertProps> = forwardRef<AlertRef, AlertProps>(function Alert(
  { message, onClose, type = 'info', variant = 'standard' },
  ref
) {
  return (
    <AlertBase ref={ref} severity={type} variant={variant} onClose={onClose}>
      {message}
    </AlertBase>
  )
})

export { Alert }
export type { AlertProps, AlertRef }
