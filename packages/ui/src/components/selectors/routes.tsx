import { AutoSuggest } from '@busmap/components/autoSuggest'

import { useSelectorProps } from './useSelectorProps.js'

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
  const props = useSelectorProps<RouteName>({ selected })

  return (
    <FormItem label="Route">
      <AutoSuggest
        {...props}
        isDisabled={isDisabled}
        placeholder={`Routes ... ${routes ? `(${routes.length})` : ''}`}
        items={routes ?? []}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Routes }
