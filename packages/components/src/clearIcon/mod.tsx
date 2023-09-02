import styled from 'styled-components'
import { useCallback } from 'react'

import { SLB30T } from '../colors.js'

import type { FC, KeyboardEvent } from 'react'
import type { Size } from '../types.js'

interface ClearIconProps {
  size?: Size
  color?: string
  onClick?: () => void
  className?: string
  tabIndex?: number
}

const getSizing = (size: Size) => {
  switch (size) {
    case 'small':
      return '16px'
    case 'medium':
      return '24px'
    case 'large':
      return '32px'
  }
}
const Icon = styled.span<{ $size: Size; $color: string }>`
  display: flex;
  width: ${({ $size }) => getSizing($size)};
  height: ${({ $size }) => getSizing($size)};
  color: ${({ $color }) => $color};
  cursor: pointer;

  svg {
    fill: currentColor;
  }

  &:focus-visible {
    outline: none;
    border: 1px solid ${SLB30T};
    border-radius: 50%;
  }
`
const ClearIcon: FC<ClearIconProps> = ({
  onClick,
  className,
  size = 'medium',
  color = '#c1c1c199',
  tabIndex = 0,
}) => {
  const handleOnClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick()
    }
  }, [onClick])
  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.code === 'Enter') {
        handleOnClick()
      }
    },
    [handleOnClick],
  )

  return (
    <Icon
      $size={size}
      $color={color}
      onClick={handleOnClick}
      onKeyDown={onKeyDown}
      className={className}
      tabIndex={tabIndex}
    >
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0a.9959.9959 0 0 1 0-1.41L10.59 12 7.7 9.11a.9959.9959 0 0 1 0-1.41c.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"></path>
      </svg>
    </Icon>
  )
}

export { ClearIcon }
export type { ClearIconProps }
