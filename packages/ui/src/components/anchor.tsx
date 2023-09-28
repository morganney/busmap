import styled from 'styled-components'

import type { FC } from 'react'

interface AnchorProps {
  onClick: () => void
  collapsed: boolean
}

const Button = styled.button<{ collapsed: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ collapsed }) => (collapsed ? '100%' : '0')};
  color: yellow;
  background: #80808077;
  border: none;
  border-bottom-left-radius: 50%;
  padding: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: right 0.25s ease-in-out;

  span {
    font-size: 18px;
    font-weight: 700;
    font-family: 'Roboto', Arial, sans-serif;
    transform: ${({ collapsed }) => (collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.25s ease-in-out;
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
