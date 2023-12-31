import styled, { keyframes } from 'styled-components'

import type { FC } from 'react'

interface LoadingProps {
  size?: 'small' | 'medium'
  color?: string
  display?: 'inline-block' | 'block'
  indent?: number
}

const getSize = (size: LoadingProps['size']) => {
  if (size === 'small') {
    return '5px'
  }

  return '10px'
}
const getLeft = (size: LoadingProps['size']) => {
  switch (size) {
    case 'small':
      return '7px'
    default:
      return '15px'
  }
}
const getFlash = ($color: LoadingProps['color']) => keyframes`
  0% {
    background-color: ${$color};
  }

  50%, 100% {
    background-color: ${$color}33;
  }
`
const Flash = styled.span<{
  $size: LoadingProps['size']
  $color: LoadingProps['color']
  $display: LoadingProps['display']
  $indent: LoadingProps['indent']
}>`
  display: ${({ $display }) => $display ?? 'inline-block'};
  left: ${({ $size }) => getLeft($size)};
  top: ${({ $display }) => ($display === 'block' ? 0 : '1px')};
  position: relative;
  margin-left: ${({ $indent }) => ($indent ? `${$indent}px` : 0)};
  width: ${({ $size }) => getSize($size)};
  height: ${({ $size }) => getSize($size)};
  border-radius: 5px;
  background-color: ${({ $color }) => $color};
  color: ${({ $color }) => $color};
  animation: ${({ $color }) => getFlash($color)} 1s infinite linear alternate;
  animation-delay: 0.5s;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -${({ $size }) => getLeft($size)};
    width: ${({ $size }) => getSize($size)};
    height: ${({ $size }) => getSize($size)};
    border-radius: 5px;
    background-color: ${({ $color }) => $color};
    color: ${({ $color }) => $color};
    animation: ${({ $color }) => getFlash($color)} 1s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: ${({ $size }) => getLeft($size)};
    width: ${({ $size }) => getSize($size)};
    height: ${({ $size }) => getSize($size)};
    border-radius: 5px;
    background-color: ${({ $color }) => $color};
    color: ${({ $color }) => $color};
    animation: ${({ $color }) => getFlash($color)} 1s infinite alternate;
    animation-delay: 1s;
  }
`
const Loading: FC<LoadingProps> = ({
  color = '#000000',
  size = 'small',
  display = 'inline-block',
  indent = 0
}) => {
  return <Flash $color={color} $size={size} $display={display} $indent={indent} />
}

export type { LoadingProps }
export { Loading }
