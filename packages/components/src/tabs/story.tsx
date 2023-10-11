import styled from 'styled-components'

import { Tabs, TabList, Tab, TabPanel } from './mod.js'

import type { StoryFn } from '@storybook/react'

const Grid = styled.div`
  display: grid;
  gap: 40px;

  p {
    margin: 20px 0 0 0;
  }
`
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

const Multiple: StoryFn<typeof Tabs> = args => {
  return (
    <Grid>
      <Tabs {...args} initialTab="a">
        <TabList>
          <Tab name="a" label="A" />
          <Tab name="b" label="B" />
        </TabList>
        <TabPanel name="a">
          <p>A</p>
        </TabPanel>
        <TabPanel name="b">
          <p>B</p>
        </TabPanel>
      </Tabs>
      <Tabs {...args} initialTab="d" position="end">
        <TabList>
          <Tab name="c" label="C" />
          <Tab name="d" label="D" />
        </TabList>
        <TabPanel name="c">
          <p>C</p>
        </TabPanel>
        <TabPanel name="d">
          <p>D</p>
        </TabPanel>
      </Tabs>
    </Grid>
  )
}
Multiple.parameters = {
  controls: {
    exclude: /.+/g
  }
}

export { Primary, Multiple }
export default {
  title: 'Tabs',
  component: Tabs,
  args: {
    label: 'Tabs content',
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
