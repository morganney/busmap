import styled from 'styled-components'
import { useCallback } from 'react'

import { PB20T, PB50T, PB60T, PB90T, PB80T, PB97T } from '../colors.js'

import type { FC, ReactNode, ReactElement, MouseEventHandler, MouseEvent } from 'react'

interface ButtonProps {
  children: ReactNode
  display?: 'light' | 'dark'
  icon?: ReactElement
  variant?: 'outlined' | 'solid'
  onClick?: MouseEventHandler<HTMLButtonElement>
  isDisabled?: boolean
}

const getBackground = ({
  $variant,
  $display
}: {
  $variant: ButtonProps['variant']
  $display: ButtonProps['display']
}) => {
  if ($variant === 'outlined') {
    return 'transparent'
  }

  return $display === 'light' ? PB90T : PB50T
}
const getHoverBackground = ({
  $variant,
  $display
}: {
  $variant: ButtonProps['variant']
  $display: ButtonProps['display']
}) => {
  if ($variant === 'outlined') {
    return $display === 'light' ? PB97T : PB60T
  }

  return $display === 'light' ? PB80T : PB60T
}
const getBorderColor = ({ $variant }: { $variant: ButtonProps['variant'] }) => {
  if ($variant === 'solid') {
    return 'transparent'
  }

  return PB90T
}
const Btn = styled.button<{
  $variant: ButtonProps['variant']
  $display: ButtonProps['display']
  $isDisabled: ButtonProps['isDisabled']
}>`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  height: auto;
  width: auto;
  padding: 6px 10px;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  border-color: ${getBorderColor};
  line-height: 1.15;
  background: ${getBackground};
  color: ${({ $display }) => ($display === 'light' ? PB20T : PB90T)};

  &:hover {
    cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
    background: ${getHoverBackground};
  }
`
const Button: FC<ButtonProps> = ({
  children,
  icon,
  onClick,
  variant = 'solid',
  display = 'light',
  isDisabled = false
}) => {
  const handleOnClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      if (typeof onClick === 'function') {
        onClick(evt)
      }
    },
    [onClick]
  )

  return (
    <Btn
      $variant={variant}
      $display={display}
      onClick={handleOnClick}
      disabled={isDisabled}
      $isDisabled={isDisabled}>
      {icon ? (
        <>
          <span>{children}</span>
          <span>{icon}</span>
        </>
      ) : (
        <>{children}</>
      )}
    </Btn>
  )
}

export type { ButtonProps }
export { Button }
