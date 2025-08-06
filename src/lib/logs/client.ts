import { LOG_LEVEL, LOG_LEVELS, serialize, type LogLevel } from './utils'

type LogMethod = (message: string, data?: object | unknown) => void

const clientLogger: Record<LogLevel, LogMethod> = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
}

function createLogMethod(level: LogLevel): LogMethod {
  return (message: string, data?: object | unknown) => {
    const shouldLog = LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(LOG_LEVEL)
    if (shouldLog) {
      // eslint-disable-next-line custom/no-console-methods
      console.log(
        `[${level.toUpperCase()}] ${message}`,
        data ? serialize(data) : '',
      )
    }
  }
}

export { clientLogger }
