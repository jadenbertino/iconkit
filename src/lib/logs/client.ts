import { CLIENT_ENV } from '@/env/client'
import { LOG_LEVELS, serialize, type LogLevel, type LogMethod } from './utils'

const currentLogLevel =
  CLIENT_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info'
const currentLogLevelValue = LOG_LEVELS[currentLogLevel]

// Native browser logger implementation
const clientLogger: Record<LogLevel, LogMethod> = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
}

function shouldLog(level: LogLevel) {
  return LOG_LEVELS[level] >= currentLogLevelValue
}

function createLogMethod(level: LogLevel): LogMethod {
  return (message: string, data?: object | unknown) => {
    if (shouldLog(level)) {
      console[level](
        `[${level.toUpperCase()}] ${message}`,
        data ? serialize(data) : '',
      )
    }
  }
}

export { clientLogger }
