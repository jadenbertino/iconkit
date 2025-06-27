import { parseQueryParams } from '@/lib/query'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { UserError } from './error'
import { serialize } from './logs/utils'

/**
 * Validates query parameters against a Zod schema
 * @param req - The NextRequest object containing query parameters
 * @param schema - The Zod schema to validate against
 * @returns The validated query parameters
 * @throws {UserError} If validation fails
 */
function validateQueryParams<T extends z.ZodObject<any>>(
  req: NextRequest,
  schema: T,
): z.output<T> {
  const parsedQueryParams = parseQueryParams(req.nextUrl.searchParams)
  const validation = schema.safeParse(parsedQueryParams)
  if (!validation.success) {
    throw new UserError({
      statusCode: 400,
      message: 'Invalid query parameters',
      details: {
        error: validation.error.flatten(),
      },
    })
  }
  return validation.data
}

async function getRequestBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<T> {
  // Parse request body
  let body: unknown
  try {
    body = await req.json()
  } catch (error) {
    throw new UserError({
      statusCode: 400,
      message: `Request body is not valid JSON`,
      details: {
        // don't log received, as it's a readable stream
        error: serialize(error),
      },
    })
  }

  // Validate request body
  const validation = schema.safeParse(body)
  if (!validation.success) {
    throw new UserError({
      statusCode: 400,
      message: `Invalid request body: ${validation.error.message}`,
    })
  }
  return validation.data
}

// Validate origin to prevent open redirect vulnerabilities
const validateOrigin = (origin: string | null): string => {
  if (!origin) return 'https://ossa.ai'

  const allowedOrigins = ['https://ossa.ai']

  // Check exact matches first
  if (allowedOrigins.includes(origin)) {
    return origin
  }

  // Check Vercel preview URLs pattern: https://website-git-<branchName>-ossa-ai.vercel.app
  const vercelPreviewPattern =
    /^https:\/\/website-git-[a-zA-Z0-9-]+-ossa-ai\.vercel\.app$/

  if (vercelPreviewPattern.test(origin)) {
    return origin
  }

  // Default to safe fallback if origin doesn't match whitelist
  return 'https://ossa.ai'
}

export { getRequestBody, validateOrigin, validateQueryParams }
