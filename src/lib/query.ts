import qs from 'qs'
import { UserError } from './error'
import { serialize } from './logs/utils'

/**
 * Type definition for parsed query parameters
 */
type QueryValue =
  | string
  | boolean
  | null
  | number
  | QueryValue[]
  | { [key: string]: QueryValue }
  | undefined
type QueryObject = { [key: string]: QueryValue }

/**
 * Parses and validates query parameters from a NextRequest
 * @param req - The NextRequest object containing query parameters
 * @returns The parsed and coerced query parameters
 */
function parseQueryParams(params: URLSearchParams): QueryObject {
  try {
    const queryString = params.toString()
    if (!queryString) {
      return {}
    }

    const queryObject = qs.parse(queryString, {
      strictNullHandling: true,
      arrayLimit: 100, // Prevent potential DoS attacks
      depth: 5, // Limit nesting depth
    })

    return coerceQuery(queryObject)
  } catch (error) {
    throw new UserError({
      statusCode: 400,
      message: 'Invalid query parameters',
      details: {
        error: serialize(error),
      },
    })
  }
}

/**
 * Recursively coerces query parameter values
 * (e.g. string, boolean, number, null, undefined)
 * to their appropriate types
 *
 * @param query - The query object to coerce
 * @returns The coerced query object
 */
function coerceQuery<T extends qs.ParsedQs>(query: T): T {
  if (!query || !isObject(query)) {
    return query
  }

  const result: any = {}
  for (const key in query) {
    const value = query[key]

    if (Array.isArray(value)) {
      // Handle arrays
      const parsedArray = value.map((item) => coerceQuery(item as qs.ParsedQs))
      if (parsedArray.length > 0) {
        result[key] = parsedArray
      }
    } else if (isObject(value)) {
      // Handle objects
      const parsedObject = coerceQuery(value as qs.ParsedQs)
      if (Object.keys(parsedObject).length > 0) {
        result[key] = parsedObject
      }
    } else {
      // Handle primitives (string, boolean, number, null, undefined)
      // Technically typescript thinks value could be qs.ParsedQs
      // But that's handled by the previous two cases
      const parsedValue = toPrimitive(value as string)
      result[key] = parsedValue
    }
  }

  return result
}

type Primitive = string | boolean | null | number | undefined

/**
 * Coerces a string value to its appropriate type
 * @param value - The value to coerce
 * @returns The coerced value
 */
function toPrimitive(value: string | undefined): Primitive {
  if (value === undefined || value === '') {
    return null
  }

  const keywords = {
    true: true,
    false: false,
    null: null,
    undefined,
  }
  if (value in keywords) {
    return keywords[value as keyof typeof keywords]
  }

  if (isNumber(value)) {
    return Number(value)
  }

  return value
}

/**
 * Type checking utilities for query parameter parsing
 */
function isNumber(val: unknown): boolean {
  return (
    typeof val === 'string' && !isNaN(parseFloat(val)) && isFinite(Number(val))
  )
}

function isObject(val: unknown): boolean {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

export { parseQueryParams, qs }
