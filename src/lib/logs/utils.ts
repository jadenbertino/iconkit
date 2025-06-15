import { serializeError } from 'serialize-error'
import serializeJavascript from 'serialize-javascript'

function serialize(value: unknown): string {
  /*
    this implements XSS (cross-site scripting) protection by default, 
    so characters like <, >, &, ', " are escaped.
    it's a bit less readable but more secure.
    you can set { unsafe: true } if you wanna disable it.
  */

  if (value instanceof Error) {
    return serializeJavascript(serializeError(value))
  }
  return serializeJavascript(value)
}

export { serialize }