import styled from 'styled-components'
import {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
  useEffect
} from 'react'

import type { FC, ReactNode, Dispatch, SetStateAction, MouseEvent } from 'react'

type Position = 'start' | 'end'
interface TabsContext {
  label: string
  selected: string
  position: Position
  border: string
  background: string
  setSelected: Dispatch<SetStateAction<string>>
  onSelect?: (selectedName: string) => void
}
const Context = createContext<TabsContext>({
  label: '',
  selected: '',
  border: '1px solid black',
  background: 'transparent',
  position: 'start',
  setSelected: () => {},
  onSelect: () => {}
})

interface TabsProps {
  children: ReactNode
  border?: string
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
   * Sets the aria-label attribute value.
   */
  label?: string
  /**
   * Callback when the visible tab is changed.
   * Passed the selected tabs `name`.
   */
  onSelect?: (selectedName: string) => void
}
const Wrap = styled.div``
const Tabs: FC<TabsProps> = ({
  children,
  onSelect,
  border = '1px solid black',
  background = 'transparent',
  position = 'start',
  label = 'Content Tabs',
  initialTab = ''
}) => {
  const [selected, setSelected] = useState(initialTab)
  const context = useMemo(
    () => ({ label, position, border, background, selected, setSelected, onSelect }),
    [label, position, border, background, selected, onSelect]
  )

  useEffect(() => {
    setSelected(initialTab)
  }, [initialTab])

  return (
    <Wrap>
      <Context.Provider value={context}>{children}</Context.Provider>
    </Wrap>
  )
}

interface TabsListProps {
  children: ReactNode
}
const List = styled.div<{ position: Position; border: string }>`
  border-bottom: ${({ border }) => border};
  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === 'start' ? 'flex-start' : 'flex-end'};
`
const TabList: FC<TabsListProps> = ({ children }) => {
  const { label, position, border } = useContext(Context)

  return (
    <List position={position} border={border} role="tablist" aria-label={label}>
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
const Button = styled.button<{ active: boolean; background: string; border: string }>`
  cursor: pointer;
  padding: 4px 6px;
  border: ${({ active, border }) => (active ? border : '1px solid transparent')};
  border-bottom: none;
  background: ${({ active, background }) => (active ? background : 'transparent')};
`
const Tab: FC<TabProps> = ({ label, name }) => {
  const { background, border, selected, setSelected, onSelect } = useContext(Context)
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
      background={background}
      border={border}
      onClick={onClick}
    >
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
`
const TabPanel: FC<TabPanelProps> = ({ children, name }) => {
  const { selected } = useContext(Context)
  const active = selected === name

  return (
    <Content
      active={active}
      id={name}
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={`tab-${name}`}
      hidden={active ? false : true}
    >
      {children}
    </Content>
  )
}

export type { TabsProps, TabProps, TabPanelProps }
export { Tabs, TabList, Tab, TabPanel }
