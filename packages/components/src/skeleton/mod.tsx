import styled, { keyframes, css } from 'styled-components'

import { PB97T, PB90T } from '../colors.js'

import type { FC } from 'react'

const baseColor = PB90T
const highlightColor = PB97T
const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  }
`
const getAnimation = ({
  isAnimated,
  duration
}: {
  isAnimated: boolean
  duration: number
}) => {
  if (!isAnimated) {
    return null
  }

  return css`
    animation: ${shimmer} ${duration}s ease-in-out infinite;
    background-image: linear-gradient(
      90deg,
      ${baseColor} 0%,
      ${highlightColor} 50%,
      ${baseColor} 100%
    );
  `
}
const Box = styled.span<Required<SkeletonProps>>`
  display: ${({ display }) => display};
  position: relative;
  overflow: hidden;
  background-color: ${baseColor};
  border-radius: ${props => (props.circle ? '50%' : '4px')};
  height: ${props => (props.circle ? `calc(2 * ${props.radius}) ` : props.height)};
  width: ${props => (props.circle ? `calc(2 * ${props.radius}) ` : props.width)};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateX(-100%);
    ${getAnimation};
  }
`
interface SkeletonProps {
  display?: 'inline-block' | 'block'
  width?: string
  height?: string
  circle?: boolean
  radius?: string
  duration?: number
  isAnimated?: boolean
}
const Skeleton: FC<SkeletonProps> = ({
  display = 'inline-block',
  width = '100%',
  height = '15px',
  circle = false,
  radius = '25px',
  duration = 1.5,
  isAnimated = true,
  ...rest
}) => {
  return (
    <Box
      display={display}
      width={width}
      height={height}
      circle={circle}
      radius={radius}
      duration={duration}
      isAnimated={isAnimated}
      {...rest}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
