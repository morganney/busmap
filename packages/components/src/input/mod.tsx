import { forwardRef, useCallback, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { Close as CloseIcon } from '../icons/close/mod.js'
import { sizing } from '../styles.js'

import type { KeyboardEvent, ChangeEvent, ForwardedRef, FocusEvent } from 'react'
import type { Size } from '../types.js'

interface InputProps {
  id?: string
  name?: string
  size?: Size
  labelledBy?: string
  list?: string
  type?: 'text' | 'password'
  value?: string | number
  onClear?: () => void
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (evt: FocusEvent) => void
  onFocus?: (evt: FocusEvent) => void
  onKeyDown?: (evt: KeyboardEvent<HTMLInputElement>) => void
  isDisabled?: boolean
  color?: string
  fontSize?: string
  placeholder?: string
  borderColor?: string
}

const getPadding = ({ $size, isClearable }: { $size: Size; isClearable: boolean }) => {
  if (isClearable) {
    return sizing[$size].clearable.padding
  }

  return sizing[$size].padding
}
const Wrapper = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`
const Close = styled(CloseIcon)`
  position: absolute;
  right: 10px;
`
const StyledInput = styled.input<{
  color: string
  $size: Size
  $fontSize: string
  borderColor: string
  isClearable: boolean
  ref: ForwardedRef<HTMLInputElement>
}>`
  color: ${({ color }) => color};
  box-sizing: border-box;
  padding: 0;
  border: 0;
  margin: 0;
  padding: ${getPadding};
  width: 100%;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: Roboto, Arial, sans-serif;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:focus {
    border-color: rgb(96, 192, 233);
    box-shadow:
      rgba(0, 0, 0, 0.08) 0px 1px 1px inset,
      rgba(102, 175, 233, 0.6) 0px 0px 8px;
  }
`
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    name,
    list,
    labelledBy,
    value,
    onClear,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    size = 'medium',
    type = 'text',
    fontSize = '16px',
    color = 'black',
    placeholder = '',
    borderColor = 'black',
    isDisabled = false
  },
  ref
) {
  const wrapper = useRef<HTMLSpanElement>(null)
  const isClearable = typeof onClear === 'function'
  const [showClearIcon, setShowClearIcon] = useState(false)
  const handleOnFocus = useCallback(
    (evt: FocusEvent) => {
      setShowClearIcon(true)

      if (typeof onFocus === 'function') {
        onFocus(evt)
      }
    },
    [onFocus]
  )
  const handleOnBlur = useCallback((evt: FocusEvent) => {
    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      setShowClearIcon(false)
    }
  }, [])
  const handleOnClear = useCallback(() => {
    wrapper.current?.querySelector('input')?.focus()

    if (typeof onClear === 'function') {
      onClear()
    }
  }, [onClear])

  useEffect(() => {
    /**
     * When the AutoSuggest changes values, either from
     * user interaction or dynamic scripting, specifically
     * when `onSelectedItemChanged` is invoked, the blur
     * event can not fire and the state to hide the clear icon
     * does not update correctly.
     *
     * This corrects for that by resetting the state whenever
     * the input state says to show the clear icon while the
     * <input /> is not the activeElement.
     */
    if (
      showClearIcon &&
      wrapper.current?.querySelector('input') !== document.activeElement
    ) {
      setShowClearIcon(false)
    }
  }, [value, showClearIcon])

  return (
    <Wrapper ref={wrapper} onBlur={handleOnBlur}>
      <StyledInput
        id={id}
        name={name ?? id}
        title={value?.toString() || undefined}
        ref={ref}
        list={list}
        type={type}
        $size={size}
        $fontSize={fontSize}
        value={value}
        disabled={isDisabled}
        isClearable={isClearable}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={handleOnFocus}
        onKeyDown={onKeyDown}
        color={color}
        placeholder={placeholder}
        borderColor={borderColor}
        aria-labelledby={labelledBy}
      />
      {value && !isDisabled && isClearable && showClearIcon && (
        <Close onClick={handleOnClear} tabIndex={0} size="small" />
      )}
    </Wrapper>
  )
})

export type { InputProps }
export { Input }
