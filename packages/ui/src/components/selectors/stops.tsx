import styled from 'styled-components'
import { useCallback } from 'react'
import { latLng } from 'leaflet'
import { AutoSuggest } from '@busmap/components/autoSuggest'
import { Locate } from '@busmap/components/icons/locate'
import { Tooltip } from '@busmap/components/tooltip'
import { PB60T, PB70T, PB90T } from '@busmap/components/colors'

import { useSelectorProps } from './useSelectorProps.js'

import { FormItem } from '../formItem.js'
import { useMap } from '../../contexts/map.js'
import { useTheme } from '../../contexts/settings/theme.js'

import type { FC } from 'react'
import type { Stop } from '../../types.js'
import type { Mode } from '../../contexts/settings/theme.js'

interface Props {
  stops: Stop[]
  selected?: Stop
  isDisabled?: boolean
  onClear?: (clearItem: () => void) => void
  onSelect: (selected: Stop) => void
}

const LocateIcon = styled(Locate)<{ mode: Mode }>`
  svg {
    color: ${({ mode }) => (mode === 'light' ? PB60T : PB70T)};
  }

  &:hover svg {
    color: ${({ mode }) => (mode === 'light' ? 'black' : PB90T)};
  }
`
const Stops: FC<Props> = ({
  stops,
  selected,
  onSelect,
  onClear,
  isDisabled = Boolean(stops)
}) => {
  const map = useMap()
  const { mode } = useTheme()
  const props = useSelectorProps<Stop>({ selected })
  const onClick = useCallback(() => {
    if (map && selected) {
      const { lat, lon } = selected
      const latLon = latLng(lat, lon)

      map.setView(latLon, Math.max(map.getZoom(), 16))
    }
  }, [map, selected])
  const icon = selected ? (
    <Tooltip title="Locate stop.">
      <LocateIcon size="small" mode={mode} onClick={onClick} />
    </Tooltip>
  ) : undefined

  return (
    <FormItem label="Stop" htmlFor="stop-selector" icon={icon}>
      <AutoSuggest
        {...props}
        id="stop-selector"
        isDisabled={isDisabled}
        placeholder={`Stops ... ${stops.length ? `(${stops.length})` : ''}`}
        items={stops ?? []}
        onClear={onClear ?? true}
        onSelect={onSelect}
      />
    </FormItem>
  )
}

export { Stops }
