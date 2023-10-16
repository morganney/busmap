import { createContext, useContext, useReducer, useMemo } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'

type PredictionFormat = 'time' | 'minutes'
interface PredictionsSettingsState {
  format: PredictionFormat
  dispatch: Dispatch<PredictionsSettingsAction>
}
interface FormatChanged {
  type: 'format'
  value: PredictionFormat
}
type PredictionsSettingsAction = FormatChanged
const defaultState: PredictionsSettingsState = {
  dispatch: () => {},
  format: 'minutes'
}
const PredictionsSettings = createContext<PredictionsSettingsState>(defaultState)
const reducer = (state: PredictionsSettingsState, action: PredictionsSettingsAction) => {
  switch (action.type) {
    case 'format':
      return { ...state, format: action.value }
    default:
      return { ...defaultState, ...state }
  }
}
const PredictionsSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [predictionsSettings, dispatch] = useReducer(reducer, defaultState)
  const context = useMemo(
    () => ({ ...predictionsSettings, dispatch }),
    [predictionsSettings, dispatch]
  )

  return (
    <PredictionsSettings.Provider value={context}>
      {children}
    </PredictionsSettings.Provider>
  )
}
const usePredictionsSettings = () => {
  return useContext(PredictionsSettings)
}

export { PredictionsSettingsProvider, usePredictionsSettings }
export type { PredictionFormat }
