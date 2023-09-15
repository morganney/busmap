import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { AnItem } from '@busmap/components/autoSuggest'
import type { RouteName } from '../../types.js'

interface Props {
  routes?: RouteName[]
  selected?: RouteName['id']
  isDisabled?: boolean
  onSelect: (selected: AnItem) => void
}
const Routes: FC<Props> = ({
  routes,
  selected,
  onSelect,
  isDisabled = Boolean(routes)
}) => {
  const items = routes?.map(({ title, id }) => ({ label: title, value: id }))
  const value = selected ? items?.find(({ value }) => value === selected) : undefined

  return (
    <FormItem label="Route" direction="horizontal">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        value={value}
        isDisabled={isDisabled}
        placeholder="Route ..."
        items={items ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Routes }
