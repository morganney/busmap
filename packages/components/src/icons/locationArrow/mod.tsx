import { useCallback } from 'react'

import { Icon } from '../common.js'

import type { FC, KeyboardEvent } from 'react'
import type { IconProps } from '../common.js'

const LocationArrow: FC<IconProps> = ({
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
        <path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z" />
      </svg>
    </Icon>
  )
}

export { LocationArrow }
export type { IconProps }
