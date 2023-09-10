import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { AnItem } from '@busmap/components/autoSuggest'
import type { AgencyName } from '../../types.js'

interface Props {
  agencies: AgencyName[]
  isDisabled?: boolean
  onSelect: (selected: AnItem) => void
  onClear?: () => void
}
const Agencies: FC<Props> = ({ agencies, isDisabled, onSelect, onClear }) => {
  const items = agencies.map(({ title, id }) => ({ label: title, value: id }))

  return (
    <FormItem>
      <AutoSuggest
        caseInsensitive
        inputBoundByItems
        isDisabled={isDisabled}
        placeholder="Agency ..."
        items={items}
        onClear={onClear}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Agencies }
