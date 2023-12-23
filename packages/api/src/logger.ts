import { pino } from 'pino'

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label }
    }
  }
})

export { logger }
