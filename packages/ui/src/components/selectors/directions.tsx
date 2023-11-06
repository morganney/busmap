import { AutoSuggest } from '@busmap/components/autoSuggest'
import { useCallback } from 'react'

import { useSelectorProps } from './useSelectorProps.js'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { Direction } from '@core/types.js'

interface Props {
  directions?: Direction[]
  selected?: Direction
  isDisabled?: boolean
  onSelect: (selected: Direction) => void
}

const Directions: FC<Props> = ({
  directions,
  selected,
  onSelect,
  isDisabled = Boolean(directions)
}) => {
  const props = useSelectorProps<Direction>({ selected })
  const itemToString = useCallback((item: Direction | null) => {
    if (item) {
      if (item.title) {
        return /unknown/i.test(item.title)
          ? item.shortTitle ?? 'Direction N/A'
          : item.title
      }
    }

    return ''
  }, [])

  return (
    <FormItem label="Direction" htmlFor="direction-selector">
      <AutoSuggest
        {...props}
        id="direction-selector"
        itemToString={itemToString}
        isDisabled={isDisabled}
        placeholder={`Directions ... ${directions ? `(${directions.length})` : ''}`}
        items={directions ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Directions }
