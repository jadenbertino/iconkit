import { SERVER_ENV } from '@/env/server'
import winston from 'winston'
import { LOG_LEVELS } from './utils'

// Create winston logger
const serverLogger = winston.createLogger({
  level: SERVER_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.simple()),
    }),
  ],
  levels: LOG_LEVELS,
})

export { serverLogger }
