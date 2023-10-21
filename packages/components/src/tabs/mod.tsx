import styled from 'styled-components'
import {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
  useEffect
} from 'react'

import { SLB30T, PB80T } from '../colors.js'

import type {
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  MouseEvent,
  KeyboardEvent
} from 'react'

type Position = 'start' | 'end'
type Direction = 'row' | 'column'
interface TabsContext {
  label: string
  selected: string
  direction: Direction
  position: Position
  fluid: boolean
  color: string
  border: string
  borderRadius: string
  background: string
  fontSize: string
  setSelected: Dispatch<SetStateAction<string>>
  onSelect?: (selectedName: string) => void
}
const Context = createContext<TabsContext>({
  label: '',
  selected: '',
  fluid: true,
  color: 'inherit',
  border: `1px solid ${PB80T}`,
  borderRadius: '0',
  background: 'white',
  fontSize: 'inherit',
  direction: 'row',
  position: 'start',
  setSelected: () => {},
  onSelect: () => {}
})

interface TabsProps {
  children: ReactNode
  className?: string
  fontSize?: string
  minHeight?: string
  /**
   * Whether the Tabs remove the bottom border
   * when they are active/visible. Requires a
   * `background` color other than `transparent`.
   */
  fluid?: boolean
  /**
   * Color of the tab text when active.
   */
  color?: string
  /**
   * Border of the active tab.
   */
  border?: string
  borderRadius?: string
  /**
   * Background of the active tab.
   */
  background?: string
  /**
   * Sets the initial visible tab.
   */
  initialTab?: string
  /**
   * Sets how the tabs are positioned relative to their layout (horizontal).
   */
  position?: Position
  /**
   * Sets whether the tabs stack horizontally or vertically.
   */
  direction?: Direction
  /**
   * The gap between the tabs and the visible tab panel.
   * For example, "10px".
   */
  gap?: string
  /**
   * Sets the aria-label attribute value.
   */
  label?: string
  /**
   * Callback when the visible tab is changed.
   * Passed the selected tabs `name`.
   */
  onSelect?: (selectedName: string) => void
}

const Wrap = styled.div<{ direction: Direction; gap: string; minHeight: string }>`
  display: flex;
  flex-direction: ${({ direction }) => (direction === 'column' ? 'row' : 'column')};
  gap: ${({ gap }) => gap};
  min-height: ${({ minHeight }) => minHeight};
`
const Tabs: FC<TabsProps> = ({
  children,
  className,
  onSelect,
  fluid = false,
  color = 'inherit',
  fontSize = 'inherit',
  border = `1px solid ${PB80T}`,
  borderRadius = '0',
  background = 'white',
  direction = 'row',
  position = 'start',
  gap = '0',
  minHeight = 'auto',
  label = 'Content Tabs',
  initialTab = ''
}) => {
  const [selected, setSelected] = useState(initialTab)
  const context = useMemo(
    () => ({
      label,
      direction,
      position,
      color,
      fluid,
      fontSize,
      border,
      borderRadius,
      background,
      selected,
      setSelected,
      onSelect
    }),
    [
      label,
      direction,
      position,
      color,
      fluid,
      fontSize,
      border,
      borderRadius,
      background,
      selected,
      onSelect
    ]
  )

  useEffect(() => {
    setSelected(initialTab)
  }, [initialTab])

  return (
    <Wrap className={className} direction={direction} gap={gap} minHeight={minHeight}>
      <Context.Provider value={context}>{children}</Context.Provider>
    </Wrap>
  )
}

interface TabListProps {
  children: ReactNode
  background?: string
  margin?: string
}
interface ListProps {
  direction: Direction
  position: Position
  border: string
  margin?: string
  background?: string
}

const getBorder = ({ border, direction }: ListProps) => {
  return `border-${direction === 'row' ? 'bottom' : 'right'}: ${border}`
}
const List = styled.div<ListProps>`
  ${getBorder};
  margin: ${({ margin }) => margin ?? 0};
  display: flex;
  flex-direction: ${({ direction }) => direction};
  align-items: center;
  background: ${({ background }) => background};
  justify-content: ${({ position }) =>
    position === 'start' ? 'flex-start' : 'flex-end'};
`
const TabList: FC<TabListProps> = ({ children, margin, background = 'none' }) => {
  const { label, direction, position, border, setSelected } = useContext(Context)
  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLDivElement>) => {
      if (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
        const tabs = Array.from(evt.currentTarget.querySelectorAll('button'))
        const selectedIdx = tabs.findIndex(
          tab => tab.getAttribute('aria-selected') === 'true'
        )
        const lastIdx = tabs.length - 1
        let next = selectedIdx

        if (evt.key === 'ArrowRight') {
          next = selectedIdx === lastIdx ? 0 : selectedIdx + 1
        }

        if (evt.key === 'ArrowLeft') {
          next = selectedIdx === 0 ? lastIdx : selectedIdx - 1
        }

        setSelected(tabs[next].dataset.name ?? '')
        tabs[next].focus()
      }
    },
    [setSelected]
  )

  return (
    <List
      role="tablist"
      aria-label={label}
      direction={direction}
      position={position}
      border={border}
      background={background}
      margin={margin}
      onKeyDown={onKeyDown}>
      {children}
    </List>
  )
}

interface TabProps {
  label: string
  /**
   * Identifies the tab and associates it with
   * the corresponding panel. Should be unique
   * per Tabs component per page.
   */
  name: string
}
interface ButtonProps {
  active: boolean
  fluid: boolean
  fontSize: string
  color: string
  direction: Direction
  background: string
  border: string
  borderRadius: string
}

const getNullBorder = ({ direction }: ButtonProps) => {
  if (direction === 'row') {
    return 'border-bottom: none'
  }

  return 'border-right: none'
}
const getMargin = ({ fluid, direction }: ButtonProps) => {
  if (fluid) {
    if (direction === 'row') {
      return '0 0 -1px 0'
    }

    return '0 -2px 0 0'
  }

  return '0'
}
const getPadding = ({ fluid, direction }: ButtonProps) => {
  if (fluid && direction === 'column') {
    // Compensate for -2px margin when fluid to cover border
    return '7px 13px 7px 11px'
  }

  return '7px 11px'
}
const Button = styled.button<ButtonProps>`
  cursor: pointer;
  line-height: 1;
  width: ${({ direction }) => (direction === 'row' ? 'auto' : '100%')};
  margin: ${getMargin};
  padding: ${getPadding};
  color: ${({ active, color }) => (active ? color : 'inherit')};
  font-size: ${({ fontSize }) => fontSize};
  font-family: inherit;
  border: ${({ active, border }) => (active ? border : '1px solid transparent')};
  border-radius: ${({ borderRadius }) => borderRadius};
  ${getNullBorder};
  background: ${({ active, background }) => (active ? background : 'transparent')};

  &:focus-visible {
    outline: none;
    border-color: ${SLB30T};
  }
`
const Tab: FC<TabProps> = ({ label, name }) => {
  const {
    color,
    fluid,
    fontSize,
    background,
    border,
    borderRadius,
    selected,
    direction,
    setSelected,
    onSelect
  } = useContext(Context)
  const onClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const selected = evt.currentTarget.dataset.name

      if (selected) {
        setSelected(selected)

        if (typeof onSelect === 'function') {
          onSelect(selected)
        }
      }
    },
    [setSelected, onSelect]
  )
  const active = selected === name

  return (
    <Button
      id={`tab-${name}`}
      role="tab"
      aria-selected={active}
      arial-controls={name}
      tabIndex={active ? 0 : -1}
      data-name={name}
      active={active}
      color={color}
      fluid={fluid}
      direction={direction}
      fontSize={fontSize}
      background={background}
      border={border}
      borderRadius={borderRadius}
      onClick={onClick}>
      {label}
    </Button>
  )
}

interface TabPanelProps {
  children: ReactNode
  /**
   * Identifies the panel and associates it with
   * the corresponding tab. Should be unique per
   * Tabs component per page.
   */
  name: string
}
const Content = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? 'block' : 'none')};
  width: 100%;
`
const TabPanel: FC<TabPanelProps> = ({ children, name }) => {
  const { selected } = useContext(Context)
  const active = selected === name

  return (
    <Content
      active={active}
      id={`panel-${name}`}
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={`tab-${name}`}
      hidden={active ? false : true}>
      {children}
    </Content>
  )
}

export type { TabsProps, TabProps, TabPanelProps }
export { Tabs, TabList, Tab, TabPanel }
