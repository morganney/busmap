import styled from 'styled-components'
import { Clear } from '@busmap/components/icons/clear'

const Content = styled.p`
  font-weight: 700;
`
export const Home = () => {
  return (
    <Content>
      This is Home page content. <Clear />
    </Content>
  )
}
