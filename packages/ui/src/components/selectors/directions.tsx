import { AutoSuggest } from '@busmap/components/autoSuggest'
import { useCallback } from 'react'

import { FormItem } from '../formItem.js'

import type { FC } from 'react'
import type { Direction } from '../../types.js'

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
  const itemToString = useCallback((item: Direction | null) => {
    return item?.shortTitle ?? (item?.title || '')
  }, [])

  return (
    <FormItem label="Direction">
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        size="small"
        itemToString={itemToString}
        value={selected ?? undefined}
        isDisabled={isDisabled}
        placeholder={`Directions ... ${directions ? `(${directions.length})` : ''}`}
        items={directions ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Directions }
