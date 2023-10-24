import { useCallback } from 'react'

import { Icon } from '../common.js'

import type { FC, KeyboardEvent } from 'react'
import type { IconProps } from '../common.js'

const Locate: FC<IconProps> = ({
  onClick,
  className,
  size = 'medium',
  color = '#c1c1c1',
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
      size={size}
      fill="none"
      color={color}
      onClick={handleOnClick}
      onKeyDown={onKeyDown}
      className={className}
      tabIndex={tabIndex}>
      <svg viewBox="0 0 24 24">
        <path
          stroke="currentcolor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m18 12c0 3.3137-2.6863 6-6 6m6-6c0-3.31371-2.6863-6-6-6m6 6h3m-9 6c-3.31371 0-6-2.6863-6-6m6 6v3m-6-9c0-3.31371 2.68629-6 6-6m-6 6h-3m9-6v-3m2 9c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2z"
        />
      </svg>
    </Icon>
  )
}

export { Locate }
