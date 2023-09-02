import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import type { FC } from 'react'

import { Providers } from './providers.js'
import { Layout } from './layout.js'
import { Home } from './home.js'

const GlobalStyles = createGlobalStyle`
  :root {
    --bg-color: #e0e0e0;
  }
  html {
    height: 100%;
    display: grid;
  }
  body {
    display: grid;
    grid-auto-rows: max-content;
    margin: 0;
    background-color: var(--bg-color);
  }
`
const BusMap: FC = () => {
  return (
    <Providers>
      <GlobalStyles />
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
