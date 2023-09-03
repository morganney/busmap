import { QueryClient, QueryClientProvider } from 'react-query'

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
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  )
}

export { Providers }
