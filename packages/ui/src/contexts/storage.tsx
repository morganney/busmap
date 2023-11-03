import { createContext, useContext, useEffect, useReducer, useMemo } from 'react'

import { same } from '../modules/favorites/util.js'
import { MAX_FAVORITES } from '../modules/favorites/common.js'
import { isAMode, isASpeedUnit, isAPredictionFormat } from '../modules/settings/util.js'

import type { FC, ReactNode, Dispatch } from 'react'
import type { Mode, SpeedUnit, PredictionFormat } from '../modules/settings/types.js'
import type { Favorite } from '../modules/favorites/types.js'

interface StorageState {
  predsFormat?: PredictionFormat
  vehicleSpeedUnit?: SpeedUnit
  vehicleColorPredicted?: boolean
  themeMode?: Mode
  favorites: Favorite[]
}
interface PredsFormatUpdate {
  type: 'predsFormat'
  value?: PredictionFormat
}
interface VehicleSpeedUnitUpdate {
  type: 'vehicleSpeedUnit'
  value?: SpeedUnit
}
interface VehicleColorPredictedUpdate {
  type: 'vehicleColorPredicted'
  value?: boolean
}
interface ThemeModeUpdate {
  type: 'themeMode'
  value?: Mode
}
interface FavoriteAdded {
  type: 'favoriteAdd'
  value: Favorite
}
interface FavoriteRemoved {
  type: 'favoriteRemove'
  value: Favorite
}
type StorageAction =
  | PredsFormatUpdate
  | VehicleSpeedUnitUpdate
  | VehicleColorPredictedUpdate
  | ThemeModeUpdate
  | FavoriteAdded
  | FavoriteRemoved

const reducer = (state: StorageState, action: StorageAction) => {
  switch (action.type) {
    case 'themeMode':
      return { ...state, themeMode: action.value }
    case 'favoriteAdd': {
      if (Array.isArray(state.favorites)) {
        return {
          ...state,
          favorites: [...state.favorites, action.value]
        }
      }

      return { ...state, favorites: [action.value] }
    }
    case 'favoriteRemove': {
      if (Array.isArray(state.favorites)) {
        return {
          ...state,
          favorites: state.favorites.filter(fav => !same(fav, action.value))
        }
      }

      return state
    }
    case 'predsFormat':
      return { ...state, predsFormat: action.value }
    case 'vehicleSpeedUnit':
      return { ...state, vehicleSpeedUnit: action.value }
    case 'vehicleColorPredicted':
      return { ...state, vehicleColorPredicted: action.value }
    default:
      return state
  }
}
const KEYS = {
  themeMode: 'busmap-themeMode',
  vehicleSpeedUnit: 'busmap-vehicleSpeedUnit',
  vehicleColorPredicted: 'busmap-vehicleColorPredicted',
  predsFormat: 'busmap-predsFormat',
  favorites: 'busmap-favorites'
}
const initStorageState = { favorites: [] }
const StorageDispatch = createContext<Dispatch<StorageAction>>(() => {})
const Storage = createContext<StorageState>(initStorageState)
const init = (state: StorageState): StorageState => {
  const themeMode = localStorage.getItem(KEYS.themeMode)
  const vehicleSpeedUnit = localStorage.getItem(KEYS.vehicleSpeedUnit)
  const vehicleColorPredicted = localStorage.getItem(KEYS.vehicleColorPredicted)
  const predsFormat = localStorage.getItem(KEYS.predsFormat)
  const favoritesJson = localStorage.getItem(KEYS.favorites)

  if (isAMode(themeMode)) {
    state.themeMode = themeMode
  }

  if (isAPredictionFormat(predsFormat)) {
    state.predsFormat = predsFormat
  }

  if (isASpeedUnit(vehicleSpeedUnit)) {
    state.vehicleSpeedUnit = vehicleSpeedUnit
  }

  if (vehicleColorPredicted !== null) {
    state.vehicleColorPredicted = vehicleColorPredicted !== 'false'
  }

  if (favoritesJson) {
    let favorites: Favorite[] = []

    try {
      favorites = JSON.parse(favoritesJson) as Favorite[]
    } catch (err) {
      // Ignore
    }

    state.favorites = favorites.slice(0, MAX_FAVORITES)
  }

  return state
}
const StorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [storage, dispatch] = useReducer(reducer, initStorageState, init)
  const context = useMemo(() => storage, [storage])

  useEffect(() => {
    if (storage.favorites) {
      localStorage.setItem(KEYS.favorites, JSON.stringify(storage.favorites))
    } else {
      localStorage.removeItem(KEYS.favorites)
    }
  }, [storage.favorites])

  useEffect(() => {
    if (storage.themeMode) {
      localStorage.setItem(KEYS.themeMode, storage.themeMode)
    } else {
      localStorage.removeItem(KEYS.themeMode)
    }
  }, [storage.themeMode])

  useEffect(() => {
    if (storage.predsFormat) {
      localStorage.setItem(KEYS.predsFormat, storage.predsFormat)
    } else {
      localStorage.removeItem(KEYS.predsFormat)
    }
  }, [storage.predsFormat])

  useEffect(() => {
    if (storage.vehicleSpeedUnit) {
      localStorage.setItem(KEYS.vehicleSpeedUnit, storage.vehicleSpeedUnit)
    } else {
      localStorage.removeItem(KEYS.vehicleSpeedUnit)
    }
  }, [storage.vehicleSpeedUnit])

  useEffect(() => {
    if (storage.vehicleColorPredicted !== undefined) {
      localStorage.setItem(
        KEYS.vehicleColorPredicted,
        storage.vehicleColorPredicted.toString()
      )
    } else {
      localStorage.removeItem(KEYS.vehicleColorPredicted)
    }
  }, [storage.vehicleColorPredicted])

  return (
    <Storage.Provider value={context}>
      <StorageDispatch.Provider value={dispatch}>{children}</StorageDispatch.Provider>
    </Storage.Provider>
  )
}
const useStorage = () => {
  return useContext(Storage)
}
const useStorageDispatch = () => {
  return useContext(StorageDispatch)
}

export { StorageProvider, useStorage, useStorageDispatch }
