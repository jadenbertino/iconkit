/**
 * @fileoverview Prevents console.* method usage to enforce Pino logger
 *
 * Purpose: Enforces the use of the project's Pino logger instead of console
 * methods to ensure consistent, structured logging across the application.
 *
 * How to fix: Replace console.* calls with Pino logger methods
 * - Instead of: console.log('message'), console.error('error')
 * - Use: import logger from '@/lib/logs/server' (server-side) or import logger from '@/lib/logs/client' (client-side)
 * - Then: logger.info('message'), logger.error('error')
 *
 * @author Custom ESLint Plugin
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
      description: 'Prevent console.* method usage to enforce Pino logger',
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noConsoleMethods:
        'Console methods are not allowed. Use Pino logger instead. Import logger from src/lib/logs/server (server-side) or src/lib/logs/client (client-side) and use logger.info(), logger.error(), etc.',
    },
  },

  create(context) {
    const filename = context.getFilename()

    // Normalize path separators for cross-platform compatibility
    const normalizedFilename = filename.replace(/\\/g, '/')

    // Skip test files - allow console usage in tests
    const isTestFile =
      normalizedFilename.includes('/__test__/') ||
      normalizedFilename.includes('.test.') ||
      normalizedFilename.includes('.spec.')

    if (isTestFile) {
      return {}
    }

    return {
      MemberExpression(node) {
        // Check if this is a console.* method call
        if (
          node.object &&
          node.object.type === 'Identifier' &&
          node.object.name === 'console' &&
          node.property &&
          node.property.type === 'Identifier'
        ) {
          // List of console methods to flag
          const consoleMethods = [
            'log',
            'debug',
            'info',
            'warn',
            'error',
            'trace',
            'table',
            'group',
            'groupCollapsed',
            'groupEnd',
            'time',
            'timeEnd',
            'assert',
            'count',
            'clear',
          ]

          if (consoleMethods.includes(node.property.name)) {
            context.report({
              node,
              messageId: 'noConsoleMethods',
            })
          }
        }
      },
    }
  },
}
