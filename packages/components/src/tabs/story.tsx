import styled from 'styled-components'

import { Tabs, TabList, Tab, TabPanel } from './mod.js'

import { Star } from '../icons/star/mod.js'
import { MapMarked } from '../icons/mapMarked/mod.js'

import type { StoryFn } from '@storybook/react'

const Grid = styled.div`
  display: grid;
  gap: 40px;

  p {
    margin: 20px 0 0;
  }
`
const Primary: StoryFn<typeof Tabs> = args => {
  return (
    <Tabs initialTab="foo" {...args}>
      <TabList>
        <Tab name="foo">Foo</Tab>
        <Tab name="bar">Bar</Tab>
        <Tab name="baz">Baz</Tab>
      </TabList>
      <TabPanel name="foo">
        <p>This is Foo content.</p>
      </TabPanel>
      <TabPanel name="bar">
        <p>This is Bar content.</p>
      </TabPanel>
      <TabPanel name="baz">
        <p>This is Baz content.</p>
      </TabPanel>
    </Tabs>
  )
}
Primary.argTypes = {
  initialTab: {
    control: 'select',
    options: ['foo', 'bar']
  }
}
const IconTabs: StoryFn<typeof Tabs> = args => {
  return (
    <Tabs {...args} initialTab="favorites">
      <TabList>
        <Tab name="favorites">
          <Star size="small" />
        </Tab>
        <Tab name="map">
          <MapMarked size="small" />
        </Tab>
      </TabList>
      <TabPanel name="favorites">
        <p>
          This <Star /> content.
        </p>
      </TabPanel>
      <TabPanel name="map">
        <p>
          This is <MapMarked /> content.
        </p>
      </TabPanel>
    </Tabs>
  )
}
const CustomTabs = styled(Tabs)`
  button[aria-selected='true'] {
    font-style: italic;
  }
`
const Custom: StoryFn<typeof Tabs> = args => {
  return (
    <CustomTabs initialTab="foo" {...args}>
      <TabList>
        <Tab name="foo">Foo</Tab>
        <Tab name="bar">Bar</Tab>
        <Tab name="baz">Baz</Tab>
      </TabList>
      <TabPanel name="foo">
        <p>This is Foo content.</p>
      </TabPanel>
      <TabPanel name="bar">
        <p>This is Bar content.</p>
      </TabPanel>
      <TabPanel name="baz">
        <p>This is Baz content.</p>
      </TabPanel>
    </CustomTabs>
  )
}
const Vertical: StoryFn<typeof Tabs> = args => {
  return (
    <Tabs {...args} direction="column">
      <TabList>
        <Tab name="one">One</Tab>
        <Tab name="two">Two</Tab>
        <Tab name="three">Three</Tab>
      </TabList>
      <TabPanel name="one">
        <span>One</span>
      </TabPanel>
      <TabPanel name="two">
        <span>Two</span>
      </TabPanel>
      <TabPanel name="three">
        <span>Three</span>
      </TabPanel>
    </Tabs>
  )
}
Vertical.args = {
  initialTab: 'two',
  fluid: true
}
Vertical.argTypes = {
  direction: {
    control: false
  },
  initialTab: {
    control: 'select',
    options: ['one', 'two', 'three']
  }
}
const Multiple: StoryFn<typeof Tabs> = args => {
  return (
    <Grid>
      <Tabs {...args} initialTab="a">
        <TabList>
          <Tab name="a">A</Tab>
          <Tab name="b">B</Tab>
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
          <Tab name="c">C</Tab>
          <Tab name="d">D</Tab>
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

export { Primary, IconTabs, Custom, Multiple, Vertical }
export default {
  title: 'Tabs',
  component: Tabs,
  args: {
    label: 'Tabs content',
    direction: 'row',
    position: 'start',
    gap: '15px',
    minHeight: 'auto',
    color: 'black',
    fluid: false,
    fontSize: '14px',
    border: '1px solid #cccccc',
    borderRadius: '0',
    background: 'white'
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['start', 'end']
    },
    direction: {
      control: 'select',
      options: ['row', 'column']
    },
    onSelect: {
      action: 'onSelect'
    },
    border: {
      control: 'text'
    },
    background: {
      control: 'color'
    },
    color: {
      control: 'color'
    }
  }
}
