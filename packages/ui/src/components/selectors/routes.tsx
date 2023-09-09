import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { AnItem } from '@busmap/components/autoSuggest'
import type { RouteName } from '../../types.js'

interface Props {
  routes?: RouteName[]
  isDisabled?: boolean
  onSelect: (selected: AnItem) => void
}
const Routes: FC<Props> = ({ routes, onSelect, isDisabled = Boolean(routes) }) => {
  const items = routes?.map(({ title, id }) => ({ label: title, value: id }))

  return (
    <FormItem label="Route" direction="horizontal">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        isDisabled={isDisabled}
        placeholder="Route ..."
        items={items ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Routes }
