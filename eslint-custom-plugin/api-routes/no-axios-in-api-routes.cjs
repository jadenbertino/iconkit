/**
 * @fileoverview Prevents axios imports in API route files (src/app/api/**)
 *
 * Purpose: Enforces the use of the project's standardized HTTP client instead of axios
 * to ensure consistent error handling, request/response formatting, and configuration
 * across all API routes.
 *
 * How to fix: Replace axios imports with the HTTP client from src/lib/http.ts
 * - Instead of: import axios from 'axios'
 * - Use: import { httpClient } from '@/lib/http'
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
      description:
        'Prevent axios imports in API route files within src/app/api directory',
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noAxiosInApiRoutes:
        'Axios imports are not allowed in API route files. Use the HTTP client from src/lib/http.ts instead.',
    },
  },

  create(context) {
    const filename = context.getFilename()

    // Normalize path separators for cross-platform compatibility
    const normalizedFilename = filename.replace(/\\/g, '/')

    // Check if the file is in src/app/api directory or any of its subdirectories
    const isInApiDirectory = normalizedFilename.includes('/src/app/api/')

    if (!isInApiDirectory) {
      return {}
    }

    return {
      ImportDeclaration(node) {
        // Check if the import source is axios
        if (node.source && node.source.value === 'axios') {
          // Only flag default imports (import axios from 'axios')
          const hasDefaultImport = node.specifiers.some(
            (specifier) => specifier.type === 'ImportDefaultSpecifier',
          )

          if (hasDefaultImport) {
            context.report({
              node,
              messageId: 'noAxiosInApiRoutes',
            })
          }
        }
      },

      // Also handle dynamic imports and require statements
      CallExpression(node) {
        // Handle dynamic imports: import('axios')
        if (
          node.callee.type === 'Import' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'axios'
        ) {
          context.report({
            node,
            messageId: 'noAxiosInApiRoutes',
          })
        }

        // Handle require statements: require('axios')
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'axios'
        ) {
          context.report({
            node,
            messageId: 'noAxiosInApiRoutes',
          })
        }
      },
    }
  },
}
