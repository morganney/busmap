import styled from 'styled-components'
import { PB50T } from '@busmap/components/colors'

import type { FC } from 'react'

interface AnchorProps {
  onClick: () => void
  collapsed: boolean
}

const Button = styled.button<{ collapsed: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ collapsed }) => (collapsed ? '100%' : '0')};
  color: white;
  background: ${PB50T}99;
  border: none;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: right 0.25s ease;
  text-shadow:
    -1px 0 ${PB50T},
    0 1px ${PB50T},
    1px 0 ${PB50T},
    0 -1px ${PB50T};

  span {
    font-family: 'Roboto';
    font-size: 18px;
    font-weight: 700;
    transform: ${({ collapsed }) => (collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.25s ease;
  }
`
const Anchor: FC<AnchorProps> = ({ onClick, collapsed = false }) => {
  return (
    <Button onClick={onClick} collapsed={collapsed}>
      <span>→</span>
    </Button>
  )
}

export { Anchor }
