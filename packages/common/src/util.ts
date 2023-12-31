import { Mode, SpeedUnit, PredictionFormat } from './types/settings.js'

const isAMode = (x: unknown): x is Mode => {
  if (x && typeof x === 'string' && ['dark', 'light'].includes(x)) {
    return true
  }

  return false
}
const isASpeedUnit = (x: unknown): x is SpeedUnit => {
  if (x && typeof x === 'string' && ['kph', 'mph'].includes(x)) {
    return true
  }

  return false
}
const isAPredictionFormat = (x: unknown): x is PredictionFormat => {
  if (x && typeof x === 'string' && ['time', 'minutes'].includes(x)) {
    return true
  }

  return false
}

export { isAMode, isASpeedUnit, isAPredictionFormat }
