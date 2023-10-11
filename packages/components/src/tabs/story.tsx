import { Tabs, TabList, Tab, TabPanel } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Primary: StoryFn<typeof Tabs> = args => {
  return (
    <Tabs initialTab="foo" {...args}>
      <TabList>
        <Tab name="foo" label="Foo" />
        <Tab name="bar" label="Bar" />
      </TabList>
      <TabPanel name="foo">
        <p>This is Foo content.</p>
      </TabPanel>
      <TabPanel name="bar">
        <p>This is Bar content.</p>
      </TabPanel>
    </Tabs>
  )
}

export { Primary }
export default {
  title: 'Tabs',
  component: Tabs,
  args: {
    initialTab: 'foo',
    position: 'start',
    border: '1px solid gray',
    background: 'transparent'
  },
  argTypes: {
    initialTab: {
      control: 'select',
      options: ['foo', 'bar']
    },
    position: {
      control: 'select',
      options: ['start', 'end']
    },
    onSelect: {
      action: 'onSelect'
    },
    border: {
      control: 'text'
    },
    background: {
      control: 'text'
    }
  }
}
