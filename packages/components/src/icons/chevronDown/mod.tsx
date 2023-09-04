import { Icon } from '../common.js'

import type { FC } from 'react'
import type { IconProps } from '../common.js'

const ChevronDown: FC<IconProps> = ({
  className,
  size = 'medium',
  color = '#c1c1c1',
  tabIndex = 0
}) => {
  return (
    <Icon color={color} size={size} className={className} tabIndex={tabIndex}>
      <svg viewBox="0 0 32 32">
        <g>
          <line x1="16" x2="7" y1="20.5" y2="11.5" stroke={color} strokeWidth="2" />
          <line x1="25" x2="16" y1="11.5" y2="20.5" stroke={color} strokeWidth="2" />
        </g>
      </svg>
    </Icon>
  )
}

export { ChevronDown }
