import { useContext, createContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'

type Mode = 'light' | 'dark'
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
  const [mode, dispatch] = useReducer(reducer, 'light')
  const context = useMemo(() => ({ mode, dispatch }), [mode, dispatch])

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme }
export type { Mode }
