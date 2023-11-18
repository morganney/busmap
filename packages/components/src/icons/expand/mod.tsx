import { useCallback } from 'react'

import { Icon } from '../common.js'

import type { FC, KeyboardEvent } from 'react'
import type { IconProps } from '../common.js'

const Expand: FC<IconProps> = ({
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
      <svg viewBox="0 0 448 512">
        <path d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" />
      </svg>
    </Icon>
  )
}

export { Expand }
export type { IconProps }
