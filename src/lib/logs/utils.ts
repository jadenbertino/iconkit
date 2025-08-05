import { CLIENT_ENV } from '@/env/client'
import pino from 'pino'
import { serializeError } from 'serialize-error'
import serializeJavascript from 'serialize-javascript'

const pinoOptions: pino.LoggerOptions = {
  formatters: {
    level(label) {
      return { level: label.toUpperCase() }
    },
  },
  level: CLIENT_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info',
}

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

export { pinoOptions, serialize }
