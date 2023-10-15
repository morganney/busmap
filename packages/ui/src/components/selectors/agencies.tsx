import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { Agency } from '../../types.js'

interface Props {
  agencies: Agency[]
  selected?: Agency
  isDisabled?: boolean
  onSelect: (selected: Agency) => void
}
const Agencies: FC<Props> = ({ agencies, selected, isDisabled, onSelect }) => {
  return (
    <FormItem label="Agency">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        size="small"
        color="black"
        value={selected ?? undefined}
        isDisabled={isDisabled}
        placeholder={`Agencies ... (${agencies.length})`}
        items={agencies}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Agencies }
