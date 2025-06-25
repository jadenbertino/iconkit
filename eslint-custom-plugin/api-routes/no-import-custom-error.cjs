/**
 * @fileoverview Prevents importing external error classes, enforcing use of local error handling.
 * 
 * Purpose: Enforces the use of the project's local error handling system instead of external
 * error classes to maintain consistent error formatting, logging, and debugging across the
 * entire application.
 * 
 * How to fix: Replace external error imports with local error handling from @/lib
 * - Instead of: import { CustomError } from '@ossa-ai/cloud'
 * - Use: import { CustomError } from '@/lib/error'
 * 
 * @author Custom ESLint Plugin
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent importing external error classes, use local error handling from @/lib instead.',
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noExternalErrorImport:
        "Importing '{{importName}}' from '{{source}}' is not allowed. Please use error handling from '@/lib' instead.",
    },
  },

  create(context) {
    // List of external error packages/classes to prevent
    const restrictedErrorImports = [
      { source: '@ossa-ai/cloud', imports: ['CustomError'] },
      // Add more restricted error imports as needed
      // { source: 'some-other-package', imports: ['SomeError'] },
    ]

    return {
      ImportDeclaration(node) {
        const source = node.source.value

        // Check each restricted source
        for (const restriction of restrictedErrorImports) {
          if (source === restriction.source) {
            // Check each import specifier
            for (const specifier of node.specifiers) {
              // Check for named imports of restricted error classes
              if (
                specifier.type === 'ImportSpecifier' &&
                restriction.imports.includes(specifier.imported.name)
              ) {
                context.report({
                  node: specifier,
                  messageId: 'noExternalErrorImport',
                  data: {
                    importName: specifier.imported.name,
                    source: source,
                  },
                })
              }
            }
          }
        }
      },
    }
  },
}
