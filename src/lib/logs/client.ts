import pino from 'pino'
import { pinoOptions } from './utils'

const clientLogger = pino({
  browser: {
    // https://github.com/pinojs/pino/blob/HEAD/docs/browser.md#browser-api
    asObject: true,
    formatters: pinoOptions.formatters,
  },
  level: pinoOptions.level,
})

export { clientLogger }
