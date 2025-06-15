import winston from 'winston'
import { ConsoleTransport } from './console.js'
import { serialize } from './utils.js'

const logger = winston.createLogger({
  level: 'info',
  transports: [ConsoleTransport],
})

export { logger, serialize }
