import styled, { css } from 'styled-components'

import {
  sizing,
  focusedStyles,
  placeholderStyles,
  getMenuDirectionStyles,
  getToggleDirectionStyles
} from './styles.js'
import { PB40T, SLB30T } from './colors.js'

import type { MenuDirection } from './types.js'

interface CoreProps {
  menuDirection?: MenuDirection
  width?: string
  size?: 'small' | 'medium' | 'large'
  color?: string
  background?: string
}
const SelectWrap = styled.div<CoreProps>`
  width: ${({ width }) => width ?? 'auto'};
  display: flex;
  flex-direction: ${({ menuDirection }) =>
    menuDirection === 'up' ? 'column-reverse' : 'column'};
`
const SelectToggleButton = styled.button<CoreProps>`
  border-radius: 5px;
  line-height: 1;
  font-size: ${({ size }) => sizing[size ?? 'medium'].fontSize};
  color: ${({ color }) => color};
  padding: ${({ size }) => sizing[size ?? 'medium'].padding};
  text-align: left;
  background-color: white;
  background-clip: padding-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  &:focus {
    ${focusedStyles};
  }

  &[aria-expanded='true'] {
    ${focusedStyles};
    ${getToggleDirectionStyles};
    background-color: rgb(0 0 0 / 8%);
  }

  &:disabled {
    color: ${PB40T};
    cursor: not-allowed;
    background-color: rgb(0 0 0 / 8%);
  }
`
const menuStyles = css<CoreProps>`
  margin: 0;
  padding: 0;
  line-height: normal;
  list-style-type: none;
  list-style-position: inside;
  position: absolute;
  left: 0;
  max-height: 205px;
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  z-index: 1000;
  outline: 0;
  background-color: ${({ background }) => background ?? 'white'};
  border: 1px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  ${getMenuDirectionStyles};
`
const SelectMenu = styled.ul`
  ${menuStyles};
`
const SelectMenuWrap = styled.div<CoreProps>`
  position: relative;
  top: ${({ menuDirection }) => (menuDirection === 'up' ? '1px' : '-1px')};

  ${SelectToggleButton}[aria-expanded="false"] + & {
    display: none;
  }

  ${SelectToggleButton}[aria-expanded="true"] + & {
    ${SelectMenu} {
      ${focusedStyles};
    }
  }
`
const itemStyles = css<CoreProps>`
  color: ${({ color }) => color ?? 'black'};
  font-size: ${({ size }) => sizing[size ?? 'medium'].fontSize};
  padding: ${({ size }) => sizing[size ?? 'medium'].padding};

  &.highlighted {
    background-color: ${SLB30T};
    color: white;
  }
`
const SelectItem = styled.li`
  ${itemStyles};
`
const SelectPlaceholder = styled.span`
  ${placeholderStyles};
  line-height: initial;
`
const SelectedItem = styled.span`
  line-height: initial;
`

export {
  SelectWrap,
  SelectToggleButton,
  SelectMenuWrap,
  SelectMenu,
  SelectItem,
  SelectPlaceholder,
  SelectedItem
}
