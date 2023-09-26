import { QueryClient, QueryClientProvider } from 'react-query'
import { useReducer } from 'react'

import defaults, { Globals, reducer } from './globals.js'

import type { ReactNode, FC } from 'react'

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
