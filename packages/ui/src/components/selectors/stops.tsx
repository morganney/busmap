import { AutoSuggest } from '@busmap/components/autoSuggest'

import { useSelectorProps } from './useSelectorProps.js'

import { StopLocator } from '../stopLocator.js'
import { FavoriteStop } from '../favoriteStop.js'
import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { Stop } from '../../types.js'

interface Props {
  stops: Stop[]
  selected?: Stop
  isDisabled?: boolean
  onClear?: (clearItem: () => void) => void
  onSelect: (selected: Stop) => void
}

const Stops: FC<Props> = ({
  stops,
  selected,
  onSelect,
  onClear,
  isDisabled = Boolean(stops)
}) => {
  const props = useSelectorProps<Stop>({ selected })

  return (
    <FormItem
      label="Stop"
      htmlFor="stop-selector"
      icon={<StopLocator selected={selected} />}>
      <AutoSuggest
        {...props}
        id="stop-selector"
        isDisabled={isDisabled}
        placeholder={`Stops ... ${stops.length ? `(${stops.length})` : ''}`}
        items={stops ?? []}
        onClear={onClear ?? true}
        onSelect={onSelect}
      />
      <FavoriteStop stop={selected} favorite={false} />
    </FormItem>
  )
}

export { Stops }
