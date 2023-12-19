import { createContext, useContext, useReducer, useMemo } from 'react'
import { isAPredictionFormat } from '@busmap/common/util'

import { useStorage } from '@core/contexts/storage.js'

import type { FC, ReactNode, Dispatch } from 'react'
import type { PredictionFormat } from '@busmap/common/types/settings'

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
const reducer = (
  state: PredictionFormat = 'minutes',
  action: PredictionsSettingsAction
) => {
  switch (action.type) {
    case 'format':
      return action.value
    default:
      return state
  }
}
const PredictionsSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const storage = useStorage()
  const [format, dispatch] = useReducer(reducer, storage.predsFormat ?? 'minutes')
  const context = useMemo(() => ({ format, dispatch }), [format, dispatch])

  return (
    <PredictionsSettings.Provider value={context}>
      {children}
    </PredictionsSettings.Provider>
  )
}
const usePredictionsSettings = () => {
  return useContext(PredictionsSettings)
}

export { PredictionsSettingsProvider, usePredictionsSettings, isAPredictionFormat }
