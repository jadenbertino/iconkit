/**
 * @fileoverview Enforces that 'route.ts' files only use default imports.
 * 
 * Purpose: Ensures that each HTTP method handler is kept in a separate file (GET.ts, POST.ts, etc.)
 * by preventing named imports in route.ts files. This promotes better code organization, easier
 * testing, and clearer separation of concerns for different HTTP methods.
 * 
 * How to fix: Use separate files for each HTTP method instead of named imports in route.ts
 * - Instead of: export { GET, POST } from './handlers' in route.ts
 * - Use: Create separate GET.ts and POST.ts files with default exports
 * - Example: export default function GET(request: Request) { ... }
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
        "Enforce that files named 'route.ts' only use default imports.",
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noNamedImports:
        "In 'route.ts' files, only default imports are allowed. Found a named import: '{{identifierName}}'.",
      noNamespaceImports:
        "In 'route.ts' files, only default imports are allowed. Found a namespace import: '* as {{identifierName}}'.",
    },
  },

  create(context) {
    const filename = context.getFilename()
    const baseFilename = path.basename(filename)

    if (baseFilename !== 'route.ts') {
      return {}
    }

    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            context.report({
              node: specifier,
              messageId: 'noNamedImports',
              data: {
                identifierName: specifier.imported.name,
              },
            })
          } else if (specifier.type === 'ImportNamespaceSpecifier') {
            context.report({
              node: specifier,
              messageId: 'noNamespaceImports',
              data: {
                identifierName: specifier.local.name,
              },
            })
          }
        }
      },
    }
  },
}
