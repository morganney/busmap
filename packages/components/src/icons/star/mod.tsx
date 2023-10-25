import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { Icon } from '../common.js'

import type { FC, KeyboardEvent } from 'react'
import type { IconProps } from '../common.js'

interface StarProps extends IconProps {
  outlined: boolean
}

const Star: FC<StarProps> = ({
  onClick,
  className,
  size = 'medium',
  color = 'black',
  tabIndex = 0,
  outlined = false
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
      size={size}
      className={className}
      tabIndex={tabIndex}
      onClick={handleOnClick}
      onKeyDown={onKeyDown}>
      <FontAwesomeIcon icon={outlined ? farStar : faStar} />
    </Icon>
  )
}

export { Star }
export type { IconProps, StarProps }
