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

import type { ChangeEvent, ReactNode, Dispatch, SetStateAction } from 'react'
import type {
  UseComboboxStateChange,
  UseComboboxStateChangeTypes,
  UseComboboxState,
  UseComboboxStateChangeOptions
} from 'downshift'
import type { Size } from '../types.js'

type SetInputText = Dispatch<SetStateAction<string>>
interface AutoSuggestProps<T> {
  items: T[]
  itemToString?: (item: T | null) => string
  loadItems?: (value: string) => Promise<T[]>
  preload?: boolean | string
  value?: T
  inputBoundByItems?: boolean
  onClear?: boolean | ((clearItem: () => void) => void)
  onChange?: (
    evt: ChangeEvent<HTMLInputElement>,
    type?: UseComboboxStateChangeTypes
  ) => void
  onSelect?: (selected: T) => void
  onBlur?: (selected: T | null, inputText: string, setInputText: SetInputText) => void
  renderItem?: (item: T) => ReactNode
  /**
   * Whether the item is selected/deselected when the text entered
   * in the input field matches/mismatches an item from the list.
   */
  selectOnTextMatch?: boolean
  isDisabled?: boolean
  caseInsensitive?: boolean
  width?: string
  color?: string
  size?: Size
  placeholder?: string
  labelledBy?: string
  id?: string
}
interface Label {
  label: string
}
interface Title {
  title: string
}

const itemIsLabel = (x: unknown): x is Label => {
  if (x && typeof x === 'object' && 'label' in x && typeof x.label === 'string') {
    return true
  }

  return false
}
const itemIsTitle = (x: unknown): x is Title => {
  if (x && typeof x === 'object' && 'title' in x && typeof x.title === 'string') {
    return true
  }

  return false
}
const itemToStringDefault = <T,>(item: T) => {
  if (typeof item === 'string' || typeof item === 'number') {
    return item.toString()
  }

  if (itemIsTitle(item)) {
    return item.title
  }

  if (itemIsLabel(item)) {
    return item.label
  }

  return ''
}
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
const getChangeEvt = (value?: string | null): ChangeEvent<HTMLInputElement> => {
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
const AutoSuggest = <U,>({
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
  inputBoundByItems = false,
  selectOnTextMatch = false,
  itemToString = itemToStringDefault
}: AutoSuggestProps<U>) => {
  const initialLoadedItems = useRef<U[]>([])
  const [inputText, setInputText] = useState(itemToString(value ?? null))
  const [inputItems, setInputItems] = useState(items ?? [])
  const matchSorterOptions = useMemo(
    () => ({
      keys: [(item: U) => itemToString(item)],
      threshold: matchSorter.rankings.CONTAINS
    }),
    [itemToString]
  )
  const render = useMemo(() => {
    if (typeof renderItem === 'function') {
      return renderItem
    }

    return (item: U) => itemToString(item)
  }, [renderItem, itemToString])
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

    return (changes: UseComboboxStateChange<U>) => {
      setInputItems(matchSorter(items, changes.inputValue ?? '', matchSorterOptions))
    }
  }, [items, matchSorterOptions, loadItems])
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
  const {
    isOpen,
    openMenu,
    selectItem,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    selectedItem,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    itemToString,
    items: inputItems,
    inputValue: inputText,
    initialSelectedItem: value,
    stateReducer: useCallback(
      (
        state: UseComboboxState<U>,
        actionAndChanges: UseComboboxStateChangeOptions<U>
      ) => {
        const { type, changes } = actionAndChanges

        if (selectOnTextMatch) {
          switch (type) {
            case useCombobox.stateChangeTypes.InputChange: {
              const inputValue = changes.inputValue ?? ''
              const found = inputItems.find(item =>
                caseInsensitive
                  ? itemToString(item).toLowerCase() === inputValue.toLowerCase()
                  : itemToString(item) === inputValue
              )

              if (found) {
                return {
                  ...changes,
                  selectedItem: found
                }
              }

              return changes
            }
            default:
              return changes
          }
        }

        return changes
      },
      [caseInsensitive, selectOnTextMatch, inputItems, itemToString]
    ),
    onSelectedItemChange: useCallback(
      (changes: UseComboboxStateChange<U>): void => {
        const asString = itemToString(changes.selectedItem ?? null)

        setInputText(asString)

        if (onChange) {
          onChange(getChangeEvt(asString), changes.type)
        }

        if (onSelect && changes.selectedItem) {
          onSelect(changes.selectedItem)
        }
      },
      [onChange, onSelect, itemToString]
    ),
    onStateChange: useCallback(
      (changes: UseComboboxStateChange<U>): void => {
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
            } else if (inputBoundByItems) {
              const nextItems = matchSorter(items, inputValue, matchSorterOptions)

              if (nextItems.length) {
                setInputText(inputValue)
                setInputItems(nextItems)

                if (onChange) {
                  onChange(getChangeEvt(inputValue), type)
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
        inputText,
        matchSorterOptions,
        handleOnInputValueChange,
        onChange
      ]
    )
  })
  const handleOnBlur = useCallback(() => {
    if (typeof onBlur === 'function') {
      onBlur(selectedItem, inputText, setInputText)
    } else if (selectedItem) {
      const itemAsString = itemToString(selectedItem)

      if (inputText !== itemAsString) {
        setInputText(itemAsString)
      }
    }
  }, [onBlur, selectedItem, inputText, setInputText, itemToString])
  const clearItem = useCallback(() => {
    selectItem(null)
  }, [selectItem])
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
          onClear(clearItem)
        }
      }
    }
  }, [onClear, items, loadItems, clearItem])

  useEffect(() => {
    if (typeof preloadItems === 'function') {
      preloadItems()
    }
  }, [preloadItems])

  useEffect(() => {
    if (items) {
      setInputItems(items)
    }
  }, [items])

  useEffect(() => {
    selectItem(value ?? null)
  }, [value, selectItem])

  return (
    <SelectWrap width={width}>
      <Combobox size={size} data-menu-empty={inputItems.length === 0}>
        <Input
          {...getInputProps({
            value: inputText,
            onBlur: handleOnBlur,
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
export type { AutoSuggestProps, SetInputText }
