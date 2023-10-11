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
  selected: string
  position: Position
  border: string
  background: string
  setSelected: Dispatch<SetStateAction<string>>
  onSelect?: (selectedName: string) => void
}
const Context = createContext<TabsContext>({
  selected: '',
  border: '1px solid black',
  background: 'transparent',
  position: 'start',
  setSelected: () => {},
  onSelect: () => {}
})

interface TabsProps {
  children: ReactNode
  initialTab?: string
  position?: Position
  border?: string
  background?: string
  onSelect?: (selectedName: string) => void
}
const Tabs: FC<TabsProps> = ({
  children,
  onSelect,
  border = '1px solid black',
  background = 'transparent',
  position = 'start',
  initialTab = ''
}) => {
  const [selected, setSelected] = useState(initialTab)
  const context = useMemo(
    () => ({ position, border, background, selected, setSelected, onSelect }),
    [position, border, background, selected, onSelect]
  )

  useEffect(() => {
    setSelected(initialTab)
  }, [initialTab])

  return <Context.Provider value={context}>{children}</Context.Provider>
}

interface TabsListProps {
  children: ReactNode
}
const List = styled.ul<{ position: Position; border: string }>`
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
  border-bottom: ${({ border }) => border};
  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === 'start' ? 'flex-start' : 'flex-end'};
`
const TabList: FC<TabsListProps> = ({ children }) => {
  const { position, border } = useContext(Context)

  return (
    <List position={position} border={border}>
      {children}
    </List>
  )
}

interface TabProps {
  label: string
  name: string
}
const Item = styled.li<{ active: boolean; background: string; border: string }>`
  cursor: pointer;
  padding: 3px 5px;
  border: ${({ active, border }) => (active ? border : 'none')};
  border-bottom: none;
  background: ${({ active, background }) => (active ? background : 'transparent')};

  button {
    background: none;
    border: none;
    cursor: pointer;
  }
`
const Tab: FC<TabProps> = ({ label, name }) => {
  const { background, border, selected, setSelected, onSelect } = useContext(Context)
  const onClick = useCallback(
    (evt: MouseEvent<HTMLLIElement>) => {
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
    <Item
      data-name={name}
      onClick={onClick}
      active={active}
      background={background}
      border={border}
    >
      <button>{label}</button>
    </Item>
  )
}

interface TabPanelProps {
  children: ReactNode
  name: string
}
const Content = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? 'block' : 'none')};
`
const TabPanel: FC<TabPanelProps> = ({ children, name }) => {
  const { selected } = useContext(Context)
  const active = selected === name

  return <Content active={active}>{children}</Content>
}

export type { TabsProps }
export { Tabs, TabList, Tab, TabPanel }
