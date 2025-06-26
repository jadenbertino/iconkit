import { NextRequest, NextResponse } from 'next/server'
import { serverLogger } from './logs/server'

type RouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string | string[]>> },
) => Promise<NextResponse>

function handleErrors(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      // Execute the actual route handler
      return await handler(req, context)
    } catch (error: unknown) {
      // Generate response
      let responseCode = 500
      let publicMessage = 'Internal Server Error'
      let privateMessage = 'Internal Server Error'
      if (error instanceof Error) {
        privateMessage = error.message
      } else if (error instanceof CustomError) {
        responseCode = error.statusCode
        publicMessage = error.message
        privateMessage = error.details
      }

      // Log the error
      serverLogger.error(privateMessage, {
        error,
        apiUrl: req.url,
        method: req.method,
        ...context,
      })

      // Respond with error
      return NextResponse.json(
        {
          message: publicMessage,
        },
        { status: responseCode },
      )
    }
  }
}

class CustomError extends Error {
  details?: any
  statusCode: number

  constructor({
    message,
    details,
    statusCode,
  }: {
    message: string
    details?: any
    statusCode?: number
  }) {
    super(message)

    // Ensure the name of this error is set as 'CustomError'
    this.name = this.constructor.name

    // Save the details and statusCode, if provided
    this.details = details
    this.statusCode = statusCode ?? 500
  }
}

/**
 * Custom error class for user errors.
 * The message will be sent back to the client.
 */
class UserError extends CustomError {
  constructor({
    message,
    statusCode,
    details,
  }: {
    message: string
    statusCode: number
    details?: Record<string, unknown>
  }) {
    super({ message, statusCode, details })
  }
}

export { CustomError, handleErrors, UserError }
