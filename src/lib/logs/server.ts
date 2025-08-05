import pino from 'pino'
import { pinoOptions } from './utils'

const serverLogger = pino({
  ...pinoOptions,
  // can extend with custom transport, etc
})

export { serverLogger }
