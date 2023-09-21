import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { RouteName } from '../../types.js'

interface Props {
  routes?: RouteName[]
  selected?: RouteName
  isDisabled?: boolean
  onSelect: (selected: RouteName) => void
}
const Routes: FC<Props> = ({
  routes,
  selected,
  onSelect,
  isDisabled = Boolean(routes)
}) => {
  return (
    <FormItem label="Route" direction="horizontal">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        value={selected ?? undefined}
        isDisabled={isDisabled}
        placeholder="Route ..."
        items={routes ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Routes }
