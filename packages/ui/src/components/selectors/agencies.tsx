import { AutoSuggest } from '@busmap/components/autoSuggest'

import { useSelectorProps } from './useSelectorProps.js'

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
  const props = useSelectorProps<Agency>({ selected })

  return (
    <FormItem label="Agency" htmlFor="agency-selector">
      <AutoSuggest
        {...props}
        id="agency-selector"
        isDisabled={isDisabled}
        placeholder={`Agencies ... (${agencies.length})`}
        items={agencies}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Agencies }
