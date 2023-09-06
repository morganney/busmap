import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Providers } from './providers.js'
import { Layout } from './layout.js'
import { Home } from './home.js'
import { ErrorBoundary } from './components/errorBoundary.js'

import type { FC } from 'react'

const BusMap: FC = () => {
  return (
    <Providers>
      <ErrorBoundary>
        <Layout>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </Layout>
      </ErrorBoundary>
    </Providers>
  )
}

export { BusMap }
