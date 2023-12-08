interface Hypertext {
  from: object[]
  self: object[]
  to: object[]
}
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
interface Agency {
  id: string
  title: string
  region: string
  _links?: Hypertext
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
  _links?: Hypertext
}
interface Route extends RouteName {
  shortTitle: string | null
  color: string
  textColor: string
  bounds: Bounds
  stops: Stop[]
  directions: Direction[]
  paths: Path[]
  _links?: Hypertext
}

export type {
  Hypertext,
  Point,
  Bounds,
  Path,
  Agency,
  RouteName,
  Route,
  DirectionName,
  Direction,
  StopName,
  Stop
}
