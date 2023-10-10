import { AutoSuggest } from '@busmap/components/autoSuggest'

import { FormItem } from '../formItem.js'

import type { FC, ChangeEvent } from 'react'
import type { Stop } from '../../types.js'

interface Props {
  stops: Stop[]
  selected?: Stop
  isDisabled?: boolean
  markPredictedVehicles: boolean
  onClear?: (clearItem: () => void) => void
  onSelect: (selected: Stop) => void
  onTogglePredictedVehicles: (evt: ChangeEvent<HTMLInputElement>) => void
}
const Stops: FC<Props> = ({
  stops,
  selected,
  onSelect,
  onClear,
  onTogglePredictedVehicles,
  markPredictedVehicles = true,
  isDisabled = Boolean(stops)
}) => {
  return (
    <>
      <FormItem label="Stop">
        <AutoSuggest
          caseInsensitive
          inputBoundByItems
          size="small"
          color="black"
          value={selected ?? undefined}
          isDisabled={isDisabled}
          placeholder={`Stops ... ${stops.length ? `(${stops.length})` : ''}`}
          items={stops ?? []}
          onClear={onClear ?? true}
          onSelect={onSelect}
        />
      </FormItem>
      <FormItem
        label="Color predicted vehicles"
        direction="horizontal-rev"
        justifyContent="flex-end"
        fontWeight="normal"
        fontSize="12px"
        grow={0}
      >
        <input
          type="checkbox"
          checked={markPredictedVehicles}
          onChange={onTogglePredictedVehicles}
        />
      </FormItem>
    </>
  )
}

export { Stops }
