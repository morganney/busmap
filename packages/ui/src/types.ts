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
interface Vehicle {
  id: string
  block: string
  trip: string
}
interface AgencyName {
  id: string
  title: string
}
interface Agency extends AgencyName {
  region: string
}
interface StopName {
  id: string
  title: string
}
interface Stop extends StopName {
  code: string
  lat: number
  lon: number
}
interface DirectionName {
  id: string
  title: string
}
interface Direction extends DirectionName {
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
interface Pred {
  epochTime: number
  seconds: number
  minutes: number
  branch: string
  isDeparture: boolean
  affectedByLayover: boolean
  isScheduleBased: boolean
  vehicle: Vehicle
  direction: DirectionName
}
interface Prediction {
  agency: Agency & { logoUrl: string | null }
  route: RouteName
  stop: StopName & { distance: number | null }
  messages: string[]
  values: Pred[]
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
interface AgencyChanged {
  type: 'agency'
  value: string
}
interface RouteChanged {
  type: 'route'
  value: Route
}
interface StopChanged {
  type: 'stop'
  value: Stop
}
type BusmapAction =
  | BoundsChanged
  | CenterChanged
  | AgencyChanged
  | RouteChanged
  | StopChanged
interface BusmapGlobals {
  dispatch: Dispatch<BusmapAction>
  center: Point
  bounds: Bounds
  agency?: string
  stop?: Stop
  arrivals?: string[]
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
  Pred,
  Prediction,
  BusmapGlobals,
  BusmapAction
}
