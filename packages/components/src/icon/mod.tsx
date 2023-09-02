import styled from 'styled-components'

import type { Size } from '../types.js'

interface IconProps {
  color?: string
  size?: Size
}

const Wrap = styled.span`
  display: flex;
`
const Icon = () => {
  return <Wrap></Wrap>
}

export { Icon }
export type { IconProps }
