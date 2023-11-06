import { useContext, createContext, useReducer, useMemo, useEffect } from 'react'

import { useStorage, useStorageDispatch } from '@core/contexts/storage.js'

import type { FC, ReactNode, Dispatch } from 'react'
import type { Mode } from '../types.js'

interface ThemeAction {
  type: 'mode'
  value: Mode
}
interface ThemeState {
  mode: Mode
  dispatch: Dispatch<ThemeAction>
}

const defaultState: ThemeState = {
  mode: 'light',
  dispatch: () => {}
}
const reducer = (state: Mode = 'light', action: ThemeAction) => {
  switch (action.type) {
    case 'mode':
      return action.value
    default:
      return state
  }
}
const ThemeContext = createContext<ThemeState>(defaultState)
const useTheme = () => {
  return useContext(ThemeContext)
}
const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const storage = useStorage()
  const storageDispatch = useStorageDispatch()
  const [mode, dispatch] = useReducer(reducer, storage.themeMode ?? 'light')
  const context = useMemo(() => ({ mode, dispatch }), [mode, dispatch])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChangePrefersColorScheme = (evt: MediaQueryListEvent) => {
      dispatch({
        type: 'mode',
        value: evt.matches ? 'dark' : 'light'
      })
      // Clear any previously user-applied setting if changing OS/Browser level setting
      storageDispatch({ type: 'themeMode', value: undefined })
    }

    mql.addEventListener('change', onChangePrefersColorScheme)

    return () => {
      mql.removeEventListener('change', onChangePrefersColorScheme)
    }
  }, [storageDispatch])

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme }
