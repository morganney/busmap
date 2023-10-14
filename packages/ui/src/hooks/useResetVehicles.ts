import { useCallback } from 'react'

import { useGlobals } from '../globals.js'

/**
 * Resets the vehicles state so that the plotted
 * vehicle markers can be restyled/redrawn as needed.
 */
const useResetVehicles = () => {
  const { dispatch, vehicles } = useGlobals()
  const resetVehicles = useCallback(() => {
    dispatch({
      type: 'vehicles',
      value: Array.isArray(vehicles) ? [...vehicles] : undefined
    })
  }, [dispatch, vehicles])

  return resetVehicles
}

export { useResetVehicles }
