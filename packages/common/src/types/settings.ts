type Mode = 'light' | 'dark'
type SpeedUnit = 'kph' | 'mph'
type PredictionFormat = 'time' | 'minutes'

interface RiderSettings {
  predsFormat?: PredictionFormat
  vehicleVisible?: boolean
  vehicleSpeedUnit?: SpeedUnit
  vehicleColorPredicted?: boolean
  themeMode?: Mode
}

export type { Mode, SpeedUnit, PredictionFormat, RiderSettings }
