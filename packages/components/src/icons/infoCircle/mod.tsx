import { useCallback } from 'react'

import { Icon } from '../common.js'

import type { FC, KeyboardEvent } from 'react'
import type { IconProps } from '../common.js'

const InfoCircle: FC<IconProps> = ({
  onClick,
  className,
  cursor,
  size = 'medium',
  color = 'black',
  tabIndex = 0
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
    [handleOnClick]
  )

  return (
    <Icon
      color={color}
      cursor={cursor}
      size={size}
      className={className}
      tabIndex={tabIndex}
      onClick={handleOnClick}
      onKeyDown={onKeyDown}>
      <svg viewBox="0 0 512 512">
        <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
      </svg>
    </Icon>
  )
}

export { InfoCircle }
export type { IconProps }
