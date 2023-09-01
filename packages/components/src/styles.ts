import { css } from 'styled-components'

import { PB40T, PB80T, SLB30T } from './colors.js'

import { MenuDirection } from './types.js'

const sizing = {
  small: {
    fontSize: '14px',
    padding: '8px 14px',
    icon: {
      top: '5px',
      left: '10px',
      right: '10px',
      padding: '8px 14px 8px 38px',
    },
    clearable: {
      padding: '8px 38px 8px 14px',
    },
    iconClearable: {
      padding: '8px 38px 8px 38px',
    },
  },
  medium: {
    fontSize: '16px',
    padding: '10px 16px',
    icon: {
      top: '8px',
      left: '10px',
      right: '10px',
      padding: '10px 16px 10px 40px',
    },
    clearable: {
      padding: '10px 40px 10px 16px',
    },
    iconClearable: {
      padding: '10px 40px 10px 40px',
    },
  },
  large: {
    fontSize: '16px',
    padding: '14px 16px',
    icon: {
      top: '12px',
      left: '10px',
      right: '10px',
      padding: '14px 16px 14px 40px',
    },
    clearable: {
      padding: '14px 40px 14px 16px',
    },
    iconClearable: {
      padding: '14px 40px 14px 40px',
    },
  },
}
const focusedStyles = css`
  border-color: ${SLB30T};
  box-shadow:
    inset 0 1px 1px rgb(0 0 0 / 8%),
    0 0 8px rgb(102 175 233 / 60%);
`
const borderOutlineStyles = css`
  outline: 0;
  border: 1px solid ${({ borderColor }: { borderColor: string }) => borderColor ?? PB80T};
  border-radius: 5px;
`
const placeholderStyles = css`
  color: ${PB40T};
`
const getToggleDirectionStyles = ({
  menuDirection,
}: {
  menuDirection?: MenuDirection
}) => {
  if (menuDirection !== 'up') {
    return css`
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom-color: transparent;
    `
  }

  return css`
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-top-color: transparent;
  `
}
const getMenuDirectionStyles = ({ menuDirection }: { menuDirection?: MenuDirection }) => {
  if (menuDirection === 'up') {
    return css`
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom: none;
      clip-path: inset(-8px -8px 0 -8px);
      bottom: 0;
    `
  }

  return css`
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-top: none;
    clip-path: inset(0 -8px -8px -8px);
    top: 0;
  `
}

export {
  sizing,
  focusedStyles,
  borderOutlineStyles,
  placeholderStyles,
  getMenuDirectionStyles,
  getToggleDirectionStyles,
}
