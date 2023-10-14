import { useReducer, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import defaults, { Globals, reducer } from './globals.js'
import { router } from './router.js'

import type { FC } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})
const BusMap: FC = () => {
  const [state, dispatch] = useReducer(reducer, defaults)
  const context = useMemo(() => ({ ...state, dispatch }), [state, dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <Globals.Provider value={context}>
        <RouterProvider router={router} />
      </Globals.Provider>
    </QueryClientProvider>
  )
}

export { BusMap }
