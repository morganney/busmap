import { useCallback } from 'react'
import { latLng } from 'leaflet'
import styled from 'styled-components'
import { Tooltip } from '@busmap/components/tooltip'
import { Locate } from '@busmap/components/icons/locate'
import { PB60T, PB70T, PB90T } from '@busmap/components/colors'

import { useMap } from '../contexts/map.js'
import { useTheme } from '../modules/settings/contexts/theme.js'

import type { FC } from 'react'
import type { Stop } from '../types.js'
import type { Mode } from '../modules/settings/types.js'

interface StopLocatorProps {
  selected?: Stop
}

const LocateIcon = styled(Locate)<{ mode: Mode }>`
  svg {
    color: ${({ mode }) => (mode === 'light' ? PB60T : PB70T)};
  }

  &:hover svg {
    color: ${({ mode }) => (mode === 'light' ? 'black' : PB90T)};
  }
`
const StopLocator: FC<StopLocatorProps> = ({ selected }) => {
  const map = useMap()
  const { mode } = useTheme()
  const onClick = useCallback(() => {
    if (map && selected) {
      const { lat, lon } = selected
      const latLon = latLng(lat, lon)

      map.setView(latLon, Math.max(map.getZoom(), 16))
    }
  }, [map, selected])

  if (selected) {
    return (
      <Tooltip title="Locate stop.">
        <LocateIcon size="small" mode={mode} onClick={onClick} />
      </Tooltip>
    )
  }

  return null
}

export { StopLocator }
