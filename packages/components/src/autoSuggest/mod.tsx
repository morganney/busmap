import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useCombobox } from 'downshift'
import { matchSorter } from 'match-sorter'
import debounce from 'lodash.debounce'
import styled from 'styled-components'

import { SelectWrap, SelectMenuWrap, SelectMenu, SelectItem } from '../core.js'
import { focusedStyles, sizing } from '../styles.js'
import { Input } from '../input/mod.js'
import { PB40T, SLB30T } from '../colors.js'
import { ChevronDown as ChevronDownIcon } from '../icons/chevronDown/mod.js'

import type { ChangeEvent, FC, ReactNode } from 'react'
import type { UseComboboxStateChange, UseComboboxStateChangeTypes } from 'downshift'
import type { Size } from '../types.js'

interface Item {
  value: string
  label: string
}
type AnItem = Item | string
type Items = AnItem[]
interface AutoSuggestProps {
  items: Items
  loadItems?: (value: string) => Promise<Items>
  preload?: boolean | string
  value?: AnItem
  inputBoundByItems?: boolean
  onClear?: boolean | (() => void)
  onChange?: (
    evt: ChangeEvent<HTMLInputElement>,
    type?: UseComboboxStateChangeTypes
  ) => void
  onSelect?: (selected: AnItem) => void
  onBlur?: () => void
  renderItem?: (item: AnItem) => ReactNode
  isDisabled?: boolean
  caseInsensitive?: boolean
  width?: string
  color?: string
  size?: Size
  placeholder?: string
  labelledBy?: string
  id?: string
}

const itemToString = (item?: AnItem | null) =>
  typeof item === 'object' ? item?.label ?? '' : item?.toString() ?? ''
const getPadding = ({ size }: { size: Size }) => {
  const [top, right, bottom, left] = sizing[size].clearable.padding.split(' ')

  switch (size) {
    case 'small':
      return `${top} calc(${right} + 25px) ${bottom} ${left}`
    case 'medium':
      return `${top} calc(${right} + 30px) ${bottom} ${left}`
    case 'large':
      return `${top} calc(${right} + 30px) ${bottom} ${left}`
  }
}
const getRightPosition = ({ size }: { size: Size }) => {
  const right = sizing[size].icon.right

  switch (size) {
    case 'small':
      return `calc(${right} + 25px)`
    case 'medium':
      return `calc(${right} + 30px)`
    case 'large':
      return `calc(${right} + 30px)`
  }
}
const ChevronDown = styled(ChevronDownIcon)`
  position: relative;
  right: -2px;

  &.isOpen {
    transform: rotate(180deg);
  }
`
const Combobox = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  input {
    padding: ${getPadding};

    & + span {
      right: ${getRightPosition};
    }
  }

  &:hover,
  &:focus {
    > button {
      display: block;
    }
  }

  &[data-menu-empty='true'] {
    > button {
      display: none;
    }
  }
`
const ComboMenu = styled(SelectMenu)`
  margin-top: 10px;
`
const ComboMenuWrap = styled(SelectMenuWrap)`
  display: none;

  &.isOpen {
    display: block;

    ${ComboMenu} {
      ${focusedStyles};
      border-top: 1px solid ${SLB30T};
      border-radius: 5px;
    }
  }
`
const ToggleMenuButton = styled.button<{ size: Size }>`
  display: none;
  padding: 0;
  outline: 0;
  line-height: initial;
  border: none;
  background: initial;
  position: absolute;
  right: ${({ size }) => (size === 'small' ? '14px' : '16px')};
  font-size: ${({ size }) => sizing[size].fontSize};
  cursor: pointer;
`
const matchSorterOptions = {
  keys: [(item: AnItem) => itemToString(item)],
  threshold: matchSorter.rankings.CONTAINS
}
const getChangeEvt = (value?: AnItem | null): ChangeEvent<HTMLInputElement> => {
  const evt = new Event('change', {
    bubbles: true,
    cancelable: false
  })

  Object.defineProperty(evt, 'target', {
    writable: false,
    value: { value }
  })

  return evt as unknown as ChangeEvent<HTMLInputElement>
}
const AutoSuggest: FC<AutoSuggestProps> = ({
  id,
  items,
  value,
  onBlur,
  onClear,
  onChange,
  onSelect,
  preload,
  loadItems,
  labelledBy,
  renderItem,
  color = PB40T,
  width = 'auto',
  size = 'medium',
  placeholder = '',
  isDisabled = false,
  caseInsensitive = false,
  inputBoundByItems = false
}) => {
  const initialLoadedItems = useRef<Items>([])
  const [inputText, setInputText] = useState(itemToString(value))
  const [inputItems, setInputItems] = useState(items ?? [])
  const render = useMemo(() => {
    if (typeof renderItem === 'function') {
      return renderItem
    }

    return (item: AnItem) => itemToString(item)
  }, [renderItem])
  const handleOnInputValueChange = useMemo(() => {
    if (typeof loadItems === 'function') {
      return debounce(
        async changes => {
          const newItems = await loadItems(changes.inputValue?.trim())

          setInputItems(newItems)
        },
        250,
        { leading: true }
      )
    }

    return (changes: UseComboboxStateChange<AnItem>) => {
      setInputItems(matchSorter(items, changes.inputValue ?? '', matchSorterOptions))
    }
  }, [items, loadItems])
  const preloadItems = useMemo(() => {
    if (preload && typeof loadItems === 'function') {
      return async () => {
        initialLoadedItems.current = await loadItems(
          typeof preload === 'string' ? preload : ''
        )

        setInputItems(initialLoadedItems.current)
      }
    }

    return null
  }, [preload, loadItems])
  const handleOnClear = useMemo(() => {
    if (onClear) {
      return async () => {
        setInputText('')

        if (initialLoadedItems.current.length) {
          setInputItems(initialLoadedItems.current)
        } else if (typeof loadItems === 'function') {
          setInputItems(await loadItems(''))
        } else {
          setInputItems(items)
        }

        if (typeof onClear === 'function') {
          onClear()
        }
      }
    }
  }, [onClear, items, loadItems])
  const {
    isOpen,
    openMenu,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    itemToString,
    items: inputItems,
    inputValue: inputText,
    initialSelectedItem: value,
    onSelectedItemChange: useCallback(
      (changes: UseComboboxStateChange<AnItem>): void => {
        setInputText(itemToString(changes.selectedItem))

        if (onChange) {
          onChange(getChangeEvt(changes.selectedItem), changes.type)
        }

        if (onSelect) {
          onSelect(changes.selectedItem ?? '')
        }
      },
      [onChange, onSelect]
    ),
    onStateChange: useCallback(
      (changes: UseComboboxStateChange<AnItem>): void => {
        const { type } = changes

        switch (type) {
          case useCombobox.stateChangeTypes.InputChange: {
            const inputValue = changes.inputValue ?? ''

            if (typeof loadItems === 'function' || !inputBoundByItems) {
              setInputText(inputValue)
              handleOnInputValueChange(changes)

              if (onChange) {
                onChange(getChangeEvt(inputValue), type)
              }

              if (onSelect) {
                const found = inputItems.find(item =>
                  caseInsensitive
                    ? itemToString(item).toLowerCase() === inputValue.toLowerCase()
                    : itemToString(item) === inputValue
                )

                if (found) {
                  onSelect(found)
                }
              }
            } else if (inputBoundByItems) {
              const nextItems = matchSorter(items, inputValue, matchSorterOptions)

              if (nextItems.length) {
                setInputText(inputValue)
                setInputItems(nextItems)

                if (onChange) {
                  onChange(getChangeEvt(inputValue), type)
                }

                if (onSelect) {
                  const found = inputItems.find(item =>
                    caseInsensitive
                      ? itemToString(item).toLowerCase() === inputValue.toLowerCase()
                      : itemToString(item) === inputValue
                  )

                  if (found) {
                    onSelect(found)
                  }
                }
              }
            }

            break
          }
          case useCombobox.stateChangeTypes.ItemClick: {
            if (changes.inputValue && changes.inputValue !== inputText) {
              setInputText(changes.inputValue)
            }

            break
          }
        }
      },
      [
        loadItems,
        inputBoundByItems,
        items,
        inputItems,
        inputText,
        caseInsensitive,
        handleOnInputValueChange,
        onSelect,
        onChange
      ]
    )
  })

  useEffect(() => {
    if (typeof preloadItems === 'function') {
      preloadItems()
    }
  }, [preloadItems])

  return (
    <SelectWrap width={width}>
      <Combobox size={size} data-menu-empty={inputItems.length === 0}>
        <Input
          {...getInputProps({
            onBlur,
            value: inputText,
            onFocus: () => {
              if (!isOpen) {
                openMenu()
              }
            }
          })}
          id={id}
          color={color}
          onClear={handleOnClear}
          labelledBy={labelledBy}
          isDisabled={isDisabled}
          placeholder={placeholder}
        />
        <ToggleMenuButton
          {...getToggleButtonProps()}
          type="button"
          size={size}
          disabled={isDisabled}
          aria-label="toggle menu"
        >
          <ChevronDown className={isOpen ? 'isOpen' : undefined} />
        </ToggleMenuButton>
      </Combobox>
      <ComboMenuWrap className={isOpen && inputItems.length ? 'isOpen' : undefined}>
        <ComboMenu {...getMenuProps()} data-select-menu="true">
          {isOpen &&
            inputItems.map((item, index) => (
              <SelectItem
                {...getItemProps({ item, index })}
                key={index}
                size={size}
                color={color}
                className={highlightedIndex === index ? 'highlighted' : ''}
              >
                {render(item)}
              </SelectItem>
            ))}
        </ComboMenu>
      </ComboMenuWrap>
    </SelectWrap>
  )
}

export { AutoSuggest }
export type { AutoSuggestProps, AnItem, Item }
