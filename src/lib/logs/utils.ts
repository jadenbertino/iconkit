import { serializeError } from 'serialize-error'
import serializeJavascript from 'serialize-javascript'

// Log method signature for consistent API
type LogMethod = (message: string, data?: object | unknown) => void

// Log levels matching pino levels for compatibility
type LogLevel = 'debug' | 'info' | 'warn' | 'error'
const LOG_LEVELS = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const satisfies Record<LogLevel, number>

function serialize(value: unknown): string {
  /*
    this implements XSS (cross-site scripting) protection by default, 
    so characters like <, >, &, ', " are escaped.
    it's a bit less readable but more secure.
    you can set { unsafe: true } if you wanna disable it.
  */

  const serializeOptions: serializeJavascript.SerializeJSOptions = {
    unsafe: true,
  }

  if (value instanceof Error) {
    return serializeJavascript(serializeError(value), serializeOptions)
  }
  return serializeJavascript(value, serializeOptions)
}

export { LOG_LEVELS, serialize, type LogLevel, type LogMethod }
