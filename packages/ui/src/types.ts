import type { Dispatch } from 'react'

// Restbus Model types
interface Point {
  lat: number
  lon: number
}
interface Bounds {
  sw: Point
  ne: Point
}
interface Path {
  points: Point[]
}
interface AgencyName {
  id: string
  title: string
}
interface Agency extends AgencyName {
  region: string
}
interface Stop {
  id: string
  code: string
  title: string
  lat: number
  lon: number
}
interface Direction {
  id: string
  title: string
  shortTitle: string | null
  useForUi: boolean
  stops: Stop['id'][]
}
interface RouteName {
  id: string
  title: string
}
interface Route extends RouteName {
  shortTitle: string | null
  color: string
  textColor: string
  bounds: Bounds
  stops: Stop[]
  directions: [from: Direction, to: Direction]
  paths: Path[]
}

// Busmap types
interface BoundsChanged {
  type: 'bounds'
  value: Bounds
}
interface CenterChanged {
  type: 'center'
  value: Point
}
interface RouteChanged {
  type: 'route'
  value: Route
}
type BusmapAction = BoundsChanged | CenterChanged | RouteChanged
interface BusmapGlobals {
  dispatch: Dispatch<BusmapAction>
  center: Point
  bounds: Bounds
  route: Route | null
}

export type {
  Point,
  Bounds,
  Path,
  AgencyName,
  Agency,
  Stop,
  Direction,
  RouteName,
  Route,
  BusmapGlobals,
  BusmapAction
}
