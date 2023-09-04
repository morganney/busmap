import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Providers } from './providers.js'
import { Layout } from './layout.js'
import { Home } from './home.js'

import type { FC } from 'react'

const BusMap: FC = () => {
  return (
    <Providers>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </Providers>
  )
}

export { BusMap }
