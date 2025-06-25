import { NextRequest, NextResponse } from 'next/server'
import { serverLogger } from './logs/server'

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>

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

export { handleErrors }
