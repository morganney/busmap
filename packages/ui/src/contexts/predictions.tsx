import { createContext, useContext, useMemo, useReducer } from 'react'

import type { FC, ReactNode, Dispatch } from 'react'
import type { DirectionChanged, StopChanged, Prediction } from '../types.js'

interface PredictionsChanged {
  type: 'predictions'
  value: Prediction[]
}
type PredictionsAction = PredictionsChanged | StopChanged | DirectionChanged
interface PredictionsContext {
  dispatch: Dispatch<PredictionsAction>
  predictions?: Prediction[]
}

const Predictions = createContext<PredictionsContext>({
  dispatch: () => {},
  predictions: undefined
})
const reducer = (state: Prediction[] | undefined, action: PredictionsAction) => {
  switch (action.type) {
    case 'predictions':
      return action.value
    case 'direction':
    case 'stop':
      return undefined
    default:
      return state
  }
}
const PredictionsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [predictions, dispatch] = useReducer(reducer, [])
  const context = useMemo(() => ({ predictions, dispatch }), [predictions, dispatch])

  return <Predictions.Provider value={context}>{children}</Predictions.Provider>
}
const usePredictions = () => {
  return useContext(Predictions)
}

export { PredictionsProvider, usePredictions }
export type { Prediction }
