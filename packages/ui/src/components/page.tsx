import styled from 'styled-components'

import type { FC, ReactNode } from 'react'

interface PageProps {
  title: string
  className?: string
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
`
const Page: FC<PageProps> = ({ title, children, className }) => {
  return (
    <Section className={className}>
      <h2>{title}</h2>
      {children}
    </Section>
  )
}

export { Page }
