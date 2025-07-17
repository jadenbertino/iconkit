/**
 * @fileoverview Prevents supabaseAdmin imports outside allowed directories
 *
 * Purpose: Enforces that supabaseAdmin is only imported in build scripts and test files
 * to ensure proper separation of concerns and prevent accidental use of admin privileges
 * in user-facing code.
 *
 * How to fix: Move supabaseAdmin imports to appropriate directories
 * - Allowed directories are defined in ALLOWED_DIRS array
 * - Use regular supabase client for user-facing code
 *
 * @author Custom ESLint Plugin
 */
'use strict'

const path = require('path')

// Allowed directories where supabaseAdmin imports are permitted
const ALLOWED_DIRS = [
  '/src/build/',
  '/src/__test__/'
]

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent supabaseAdmin imports outside src/build and src/__test__ directories',
      category: 'Best Practices',
      recommended: false,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noSupabaseAdminOutsideAllowedDirs:
        `supabaseAdmin imports are only allowed in ${ALLOWED_DIRS.join(', ')} directories. Use the regular supabase client for user-facing code.`,
    },
  },

  create(context) {
    const filename = context.getFilename()

    // Normalize path separators for cross-platform compatibility
    const normalizedFilename = filename.replace(/\\/g, '/')

    // Check if the file is in any allowed directory
    const isInAllowedDirectory = ALLOWED_DIRS.some(dir => 
      normalizedFilename.includes(dir)
    )

    // If file is in allowed directories, don't check
    if (isInAllowedDirectory) {
      return {}
    }

    return {
      ImportDeclaration(node) {
        // Check if the import source contains supabaseAdmin
        if (node.source && node.source.value) {
          const importSource = node.source.value
          
          // Check for supabaseAdmin imports from any source
          const hasSupabaseAdminImport = node.specifiers.some(
            (specifier) => {
              // Check for named imports: import { supabaseAdmin } from '...'
              if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'supabaseAdmin') {
                return true
              }
              // Check for default imports that might be supabaseAdmin
              if (specifier.type === 'ImportDefaultSpecifier' && specifier.local.name === 'supabaseAdmin') {
                return true
              }
              return false
            }
          )

          if (hasSupabaseAdminImport) {
            context.report({
              node,
              messageId: 'noSupabaseAdminOutsideAllowedDirs',
            })
          }
        }
      },

      // Also handle dynamic imports and require statements
      CallExpression(node) {
        // Handle dynamic imports: import('...').then(({ supabaseAdmin }) => ...)
        if (
          node.callee.type === 'Import' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal'
        ) {
          // This is more complex to detect destructured supabaseAdmin from dynamic imports
          // For now, we'll rely on the ImportDeclaration check
        }

        // Handle require statements: const { supabaseAdmin } = require('...')
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal'
        ) {
          // Check if parent is a destructuring assignment that includes supabaseAdmin
          let parent = node.parent
          while (parent) {
            if (parent.type === 'VariableDeclarator' && parent.id.type === 'ObjectPattern') {
              const hasSupabaseAdminProperty = parent.id.properties.some(
                (prop) => prop.type === 'Property' && prop.key.name === 'supabaseAdmin'
              )
              if (hasSupabaseAdminProperty) {
                context.report({
                  node,
                  messageId: 'noSupabaseAdminOutsideAllowedDirs',
                })
              }
              break
            }
            if (parent.type === 'AssignmentExpression' && parent.left.type === 'ObjectPattern') {
              const hasSupabaseAdminProperty = parent.left.properties.some(
                (prop) => prop.type === 'Property' && prop.key.name === 'supabaseAdmin'
              )
              if (hasSupabaseAdminProperty) {
                context.report({
                  node,
                  messageId: 'noSupabaseAdminOutsideAllowedDirs',
                })
              }
              break
            }
            parent = parent.parent
          }
        }
      },
    }
  },
}