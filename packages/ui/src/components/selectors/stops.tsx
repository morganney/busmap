import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { Stop } from '../../types.js'

interface Props {
  stops?: Stop[]
  selected?: Stop
  isDisabled?: boolean
  onSelect: (selected: Stop) => void
}
const Stops: FC<Props> = ({ stops, selected, onSelect, isDisabled = Boolean(stops) }) => {
  return (
    <FormItem label="Stop" direction="horizontal">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        value={selected ?? undefined}
        isDisabled={isDisabled}
        placeholder="Stop ..."
        items={stops ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Stops }
