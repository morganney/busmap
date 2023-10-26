import styled from 'styled-components'
import { useCallback } from 'react'
import { Tooltip } from '@busmap/components/tooltip'
import { Locate } from '@busmap/components/icons/locate'
import { PB60T, PB70T, PB90T } from '@busmap/components/colors'

import { useGlobals } from '../globals.js'
import { useTheme } from '../contexts/settings/theme.js'
import { useVehicles } from '../contexts/vehicles.js'

import type { FC, ReactNode } from 'react'
import type { Vehicle } from '../types.js'
import type { Mode } from '../contexts/util.js'

interface LocatorProps {
  children: ReactNode
  vehicleId: Vehicle['id']
}

const Wrap = styled.div`
  display: flex;
  gap: 8px;
`
const Button = styled.button<{ mode: Mode }>`
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  background: none;
  box-sizing: border-box;

  svg {
    color: ${({ mode }) => (mode === 'light' ? PB60T : PB70T)};
  }

  &:hover svg {
    color: ${({ mode }) => (mode === 'light' ? 'black' : PB90T)};
  }
`
const Locator: FC<LocatorProps> = ({ children, vehicleId }) => {
  const { dispatch } = useGlobals()
  const { mode } = useTheme()
  const vehicles = useVehicles()
  const onClick = useCallback(() => {
    if (Array.isArray(vehicles)) {
      const vehicle = vehicles.find(({ id }) => id === vehicleId)

      if (vehicle) {
        dispatch({ type: 'predForVeh', value: vehicle })
      }
    }
  }, [dispatch, vehicles, vehicleId])

  return (
    <Wrap>
      {children}
      <Tooltip title="Locate vehicle.">
        <Button mode={mode} onClick={onClick}>
          <Locate size="small" />
        </Button>
      </Tooltip>
    </Wrap>
  )
}

export { Locator }
