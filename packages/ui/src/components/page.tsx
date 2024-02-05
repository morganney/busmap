import styled from 'styled-components'

import { Dots } from './dots.js'

import type { FC, ReactNode } from 'react'

interface PageProps {
  title: string
  className?: string
  loading?: boolean
  children: ReactNode
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 22px;
    margin: 0;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }
`
const Page: FC<PageProps> = ({ title, children, className, loading = false }) => {
  return (
    <Section className={className}>
      <h2>
        {title}
        {loading && <Dots />}
      </h2>
      {children}
    </Section>
  )
}

export { Page }
