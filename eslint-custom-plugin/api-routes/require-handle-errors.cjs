/**
 * @fileoverview Enforces that API route files (GET.ts, POST.ts, etc.) must import handleErrors.
 *
 * Purpose: Ensures all API route handlers are wrapped with proper error handling logic to provide
 * consistent error responses, logging, and debugging information. This prevents unhandled exceptions
 * from crashing the application and ensures proper HTTP error status codes are returned.
 *
 * How to fix: Import and use the handleErrors wrapper in your API route handlers
 * - Add: import { handleErrors } from '@/lib/error'
 * - Wrap your handler: export default handleErrors(async (request: Request) => { ... })
 * - This ensures all errors are caught and properly formatted as HTTP responses
 *
 */
'use strict'

const path = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that API route files must import handleErrors',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      missingHandleErrors: 'API route files must import handleErrors',
    },
  },

  create(context) {
    const filename = context.getFilename()
    const baseFilename = path.basename(filename)
    const apiRouteFiles = ['GET.ts', 'POST.ts', 'PUT.ts', 'DELETE.ts']

    // Check if file is in api folder and is a route file
    const isApiRouteFile =
      filename.includes('/api/') && apiRouteFiles.includes(baseFilename)

    if (!isApiRouteFile) {
      return {}
    }

    let hasHandleErrorsImport = false

    return {
      ImportDeclaration(node) {
        // Check if handleErrors is imported
        for (const specifier of node.specifiers) {
          if (
            (specifier.type === 'ImportSpecifier' &&
              specifier.imported.name === 'handleErrors') ||
            (specifier.type === 'ImportDefaultSpecifier' &&
              specifier.local.name === 'handleErrors')
          ) {
            hasHandleErrorsImport = true
            break
          }
        }
      },

      'Program:exit'(node) {
        if (!hasHandleErrorsImport) {
          context.report({
            node,
            messageId: 'missingHandleErrors',
          })
        }
      },
    }
  },
}
