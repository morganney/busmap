import type { Dispatch } from 'react'
import type {
  Hypertext,
  Point,
  Path,
  Bounds,
  Agency,
  StopName,
  Stop,
  RouteName,
  Route,
  DirectionName,
  Direction
} from '@busmap/common/types/restbus'

// Restbus Model types

interface PredVehicle {
  id: string
  block: string
  trip: string
}
interface Vehicle {
  id: string
  routeId: string
  directionId: string
  predictable: boolean
  secsSinceReport: number
  kph: number
  heading: number
  lat: number
  lon: number
  leadingVehicleId: null | string
}
interface Pred {
  epochTime: number
  seconds: number
  minutes: number
  branch: string
  isDeparture: boolean
  affectedByLayover: boolean
  isScheduleBased: boolean
  vehicle: PredVehicle
  direction: DirectionName
}
interface Message {
  text: string
}
interface Prediction {
  agency: Agency & { logoUrl: string | null }
  route: RouteName
  stop: StopName & { distance: number | null }
  messages: Message[]
  values: Pred[]
  _links?: Hypertext
}
interface Selection {
  agency: Agency
  route: Route
  direction: Direction
  stop: Stop
}

// Busmap types
interface User {
  sub: string
  email: string
  fullName: string
  givenName: string
  familyName: string
  expires: string
}
interface Status {
  isSignedIn: boolean
  user?: User | null
}
type Page = 'locate' | 'favorites' | 'select' | 'settings' | 'info' | 'signin' | 'profile'
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
  value?: Agency
}
interface RouteChanged {
  type: 'route'
  value?: Route
}
interface DirectionChanged {
  type: 'direction'
  value?: Direction
}
interface StopChanged {
  type: 'stop'
  value?: Stop
}
interface SelectedChanged {
  type: 'selected'
  value?: Selection
}
interface PredForVehChanged {
  type: 'predForVeh'
  value?: Vehicle
}
interface PageChanged {
  type: 'page'
  value: Page
}
interface CollapsedChanged {
  type: 'collapsed'
  value: boolean
}
interface UserChanged {
  type: 'user'
  value?: User
}
type BusmapAction =
  | UserChanged
  | BoundsChanged
  | CenterChanged
  | AgencyChanged
  | RouteChanged
  | DirectionChanged
  | StopChanged
  | PredForVehChanged
  | SelectedChanged
  | PageChanged
  | CollapsedChanged
interface BusmapGlobals {
  dispatch: Dispatch<BusmapAction>
  user?: User
  page: Page
  collapsed: boolean
  center: Point
  bounds: Bounds
  agency?: Agency
  route?: Route
  direction?: Direction
  stop?: Stop
  predForVeh?: Vehicle
  selected?: Selection
}

export type {
  User,
  Status,
  Page,
  Point,
  Bounds,
  Path,
  Agency,
  StopName,
  Stop,
  StopChanged,
  Direction,
  DirectionName,
  DirectionChanged,
  RouteName,
  Route,
  Pred,
  Prediction,
  Vehicle,
  Selection,
  BusmapGlobals,
  BusmapAction
}
