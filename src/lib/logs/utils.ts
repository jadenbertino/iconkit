import { CLIENT_ENV } from '@/env/client'
import { serializeError } from 'serialize-error'
import serializeJavascript from 'serialize-javascript'

// Log levels matching pino levels for compatibility
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
type LogLevel = (typeof LOG_LEVELS)[number]
const LOG_LEVEL: LogLevel =
  CLIENT_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info'

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

export { LOG_LEVEL, LOG_LEVELS, serialize, type LogLevel }
