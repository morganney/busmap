import { useState, useCallback, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'

import { Alert } from '../alert/mod.js'

import type { FC, SyntheticEvent } from 'react'
import type { SnackbarOrigin } from '@mui/material/Snackbar'

type Positions =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
type Variant = 'filled' | 'standard' | 'outlined'
interface ToasterProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  message?: string
  position?: Positions
  variant?: Variant
  timeout?: number
  open?: boolean
}
type ToasterState = ToasterProps

const defaultState: ToasterState = {
  open: false,
  message: '',
  type: 'info',
  timeout: 6_000
}
const EVENT_NAME = 'busmap-toaster'
const toast = (props: ToasterProps) => {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: props }))
}
const Toaster: FC<{ anchor?: Positions; kind?: Variant }> = ({ anchor, kind }) => {
  const [{ open, type, variant, message, position, timeout }, setState] =
    useState(defaultState)
  const onClose = useCallback(
    (evt: SyntheticEvent | CustomEvent | Event, reason?: string) => {
      if (reason !== 'clickaway') {
        setState(prev => ({
          ...prev,
          open: false
        }))
      }
    },
    []
  )
  const [vertical, horizontal] = position?.split(' ') ??
    anchor?.split(' ') ?? ['bottom', 'left']
  const pos = { vertical, horizontal } as SnackbarOrigin

  useEffect(() => {
    const onToast = (evt: CustomEvent) => {
      setState(prev => ({
        ...prev,
        ...evt.detail,
        open: evt.detail.open ?? true
      }))
    }

    window.addEventListener(EVENT_NAME, onToast as EventListener)

    return () => {
      window.removeEventListener(EVENT_NAME, onToast as EventListener)
    }
  }, [])

  return (
    <Snackbar open={open} autoHideDuration={timeout} anchorOrigin={pos} onClose={onClose}>
      <Alert
        type={type ?? 'info'}
        variant={variant ?? kind ?? 'standard'}
        message={message ?? ''}
        onClose={onClose}
      />
    </Snackbar>
  )
}

export { Toaster, toast }
export type { ToasterProps }
