import { QueryClient, QueryClientProvider } from 'react-query'
import { useReducer } from 'react'

import defaults, { Globals } from './globals.js'

import type { ReactNode, FC } from 'react'
import type { BusmapGlobals, BusmapAction } from './types.js'

type BusmapState = Omit<BusmapGlobals, 'dispatch'>
const reducer = (state: BusmapState, action: BusmapAction): BusmapState => {
  switch (action.type) {
    case 'bounds':
      return { ...state, bounds: action.value }
    case 'agency':
      return {
        ...state,
        agency: action.value,
        selected: undefined
      }
    case 'route':
      return { ...state, route: action.value, selected: undefined }
    case 'direction':
      return { ...state, direction: action.value, stop: undefined, selected: undefined }
    case 'stop':
      return { ...state, stop: action.value }
    case 'locationSettled': {
      return { ...state, locationSettled: action.value }
    }
    case 'selected': {
      return { ...state, selected: action.value }
    }
    default:
      return { ...defaults, ...state }
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})
const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaults)
  const context = { ...state, dispatch }

  return (
    <Globals.Provider value={context}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Globals.Provider>
  )
}

export { Providers }
