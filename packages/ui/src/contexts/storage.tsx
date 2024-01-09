import { createContext, useContext, useEffect, useReducer, useMemo } from 'react'
import { isAMode, isASpeedUnit, isAPredictionFormat } from '@busmap/common/util'

import { same } from '@module/util.js'
import { MAX_FAVORITES } from '@module/favorites/common.js'

import type { FC, ReactNode, Dispatch } from 'react'
import type {
  Mode,
  SpeedUnit,
  PredictionFormat,
  RiderSettings
} from '@busmap/common/types/settings'
import type { Favorite } from '@busmap/common/types/favorites'

interface StorageState extends RiderSettings {
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
interface VehicleVisible {
  type: 'vehicleVisible'
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
interface FavoriteSet {
  type: 'favoriteSet'
  value: Favorite[]
}
interface FavoriteReset {
  type: 'favoriteReset'
}
interface StorageSettingsChanged {
  type: 'settingsChanged'
  value: Partial<RiderSettings>
}
type StorageAction =
  | PredsFormatUpdate
  | VehicleVisible
  | VehicleSpeedUnitUpdate
  | VehicleColorPredictedUpdate
  | ThemeModeUpdate
  | FavoriteSet
  | FavoriteReset
  | FavoriteAdded
  | FavoriteRemoved
  | StorageSettingsChanged

const reducer = (state: StorageState, action: StorageAction) => {
  switch (action.type) {
    case 'themeMode':
      return { ...state, themeMode: action.value }
    case 'favoriteSet':
      return { ...state, favorites: action.value }
    case 'favoriteReset':
      return { ...state, favorites: [] }
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
    case 'vehicleVisible':
      return { ...state, vehicleVisible: action.value }
    case 'vehicleSpeedUnit':
      return { ...state, vehicleSpeedUnit: action.value }
    case 'vehicleColorPredicted':
      return { ...state, vehicleColorPredicted: action.value }
    case 'settingsChanged':
      return { ...state, ...action.value }
    default:
      return state
  }
}
// These are used in the settings module/component too
const KEYS = {
  themeMode: 'busmap-themeMode',
  vehicleVisible: 'busmap-vehicleVisible',
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
  const vehicleVisible = localStorage.getItem(KEYS.vehicleVisible)
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

  if (vehicleVisible !== null) {
    state.vehicleVisible = vehicleVisible !== 'false'
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

  useEffect(() => {
    if (storage.vehicleVisible !== undefined) {
      localStorage.setItem(KEYS.vehicleVisible, storage.vehicleVisible.toString())
    } else {
      localStorage.removeItem(KEYS.vehicleVisible)
    }
  }, [storage.vehicleVisible])

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
