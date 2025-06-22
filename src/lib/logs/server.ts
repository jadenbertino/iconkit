import winston from 'winston'
import { serialize } from './utils'

const ConsoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return serialize({
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(Object.keys(meta).length ? { meta } : {}),
      })
    }),
  ),
})

const serverLogger = winston.createLogger({
  level: 'debug',
  transports: [ConsoleTransport],
})

export { serverLogger }
