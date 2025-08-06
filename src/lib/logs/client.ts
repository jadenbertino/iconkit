import { CLIENT_ENV } from '@/env/client'
import pino from 'pino'

const basePinoLogger = pino({
  browser: {
    // https://github.com/pinojs/pino/blob/HEAD/docs/browser.md#browser-api
    asObject: true,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() }
      },
    },
  },
  timestamp: false, // Disable timestamps
  level: CLIENT_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info',
})

// browser pino doesn't natively support the
// (message, object) pattern, so we wrap it
const clientLogger: Record<
  pino.Level,
  (message: string, data?: object) => void
> = {
  trace: createLogMethod('trace'),
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
  fatal: createLogMethod('fatal'),
}

function createLogMethod(level: pino.Level) {
  return (message: string, data?: object) => {
    basePinoLogger[level]({ msg: message, ...data })
  }
}

export { clientLogger }
