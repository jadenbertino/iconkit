/**
 * @fileoverview Enforces that icon files use named exports instead of default exports.
 *
 * Purpose: Ensures that all icon components in src/components/icons/ use named exports
 * for better tree-shaking, explicit imports, and consistency across the icon library.
 *
 * How to fix: Convert default exports to named exports
 * - Instead of: export default IconName
 * - Use: export { IconName } or export const IconName = ...
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
        'Enforce that icon files in src/components/icons/ use named exports instead of default exports.',
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noDefaultExport:
        "Icon files should use named exports instead of default exports. Use 'export { {{componentName}} }' or 'export const {{componentName}} = ...' instead.",
    },
  },

  create(context) {
    const filename = context.getFilename()
    const normalizedPath = path.normalize(filename).replace(/\\/g, '/')
    
    // Check if file is in src/components/icons/ directory and is a .tsx file
    const isIconFile = normalizedPath.includes('src/components/icons/') && 
                      normalizedPath.endsWith('.tsx')

    if (!isIconFile) {
      return {}
    }

    return {
      ExportDefaultDeclaration(node) {
        // Try to extract component name from the declaration
        let componentName = 'ComponentName'
        
        if (node.declaration) {
          if (node.declaration.type === 'Identifier') {
            componentName = node.declaration.name
          } else if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
            componentName = node.declaration.id.name
          }
        }

        context.report({
          node,
          messageId: 'noDefaultExport',
          data: {
            componentName,
          },
        })
      },
    }
  },
}