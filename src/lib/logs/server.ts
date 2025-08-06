import pino, { type LogFn, type Logger } from 'pino'
import { LOG_LEVEL } from './utils'

const serverLogger = pino({
  level: LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  hooks: {
    logMethod, // runs before the log method
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
})

function logMethod(this: Logger, args: Parameters<LogFn>, method: LogFn): void {
  // If two arguments: (message, payload) -> Format correctly
  if (
    args.length === 2 &&
    typeof args[0] === 'string' &&
    typeof args[1] === 'object' &&
    !args[0].includes('%')
  ) {
    const payload = { msg: args[0], ...args[1] }

    // If the object is an Error, serialize it properly
    if (args[1] instanceof Error) {
      payload.error = payload.error ?? args[1]
    }

    method.call(this, payload)
  } else {
    // any other amount of parameters, or order of parameters will be considered here
    method.apply(this, args)
  }
}

export { serverLogger }
