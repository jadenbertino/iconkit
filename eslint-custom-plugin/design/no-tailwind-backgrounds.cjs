/**
 * @fileoverview Prevents use of Tailwind background color utilities in favor of design system tokens
 *
 * Purpose: Enforces the use of semantic design system background color tokens instead of
 * raw Tailwind utilities to ensure consistency and maintainability across the codebase.
 *
 * How to fix: Replace Tailwind background color utilities with design system tokens
 * - Instead of: bg-gray-100, bg-blue-500, bg-red-600, etc.
 * - Use: bg-surface, bg-canvas, bg-overlay, bg-error, bg-success, etc.
 *
 * @author Custom ESLint Plugin
 */
'use strict'

// Common Tailwind color names that should be forbidden
const TAILWIND_COLOR_NAMES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'inherit', 'current', 'transparent', 'black', 'white'
]

// Generate all possible Tailwind background color utilities
const TAILWIND_BG_COLOR_UTILITIES = []
for (const color of TAILWIND_COLOR_NAMES) {
  // Standard colors: bg-gray-100, bg-gray-200, etc.
  for (let i = 50; i <= 950; i += i < 100 ? 50 : 100) {
    TAILWIND_BG_COLOR_UTILITIES.push(`bg-${color}-${i}`)
  }
  // Base colors: bg-gray, bg-red, etc.
  TAILWIND_BG_COLOR_UTILITIES.push(`bg-${color}`)
}

// Approved design system tokens (these are allowed)
const APPROVED_TOKENS = [
  // Structural backgrounds
  'bg-canvas',
  'bg-surface',
  'bg-overlay',
  'bg-inset',
  'bg-inverse',
  // State backgrounds
  'bg-hover',
  'bg-disabled',
  // Semantic backgrounds
  'bg-success',
  'bg-error',
  'bg-warning',
  'bg-primary',
  'bg-info',
]

// Special Tailwind utilities that should be allowed (legitimate use cases)
const ALLOWED_TAILWIND_UTILITIES = [
  'bg-transparent',
  'bg-current',
  'bg-inherit',
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
        'Prevent use of Tailwind background color utilities in favor of design system tokens',
      category: 'Best Practices',
      recommended: true,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noTailwindBgColor:
        'Use design system background color tokens instead of Tailwind utilities. Replace "{{utility}}" with one of: ' +
        APPROVED_TOKENS.join(', '),
    },
  },

  create(context) {
    // Function to check if a class contains forbidden background color utilities
    function checkClassNames(classNameValue) {
      if (!classNameValue || typeof classNameValue !== 'string') {
        return []
      }

      const violations = []
      const classes = classNameValue.split(/\s+/)

      for (const className of classes) {
        // Handle responsive variants (e.g., sm:bg-gray-100, md:bg-blue-500)
        const baseClass = className.includes(':')
          ? className.split(':').pop()
          : className

        // Check for opacity variants (e.g., bg-gray-100/50, bg-blue-500/75)
        const classWithoutOpacity = baseClass.includes('/')
          ? baseClass.split('/')[0]
          : baseClass

        // Only flag as violation if it's a forbidden Tailwind utility AND not an approved token or allowed utility
        if (TAILWIND_BG_COLOR_UTILITIES.includes(classWithoutOpacity) && 
            !APPROVED_TOKENS.includes(classWithoutOpacity) &&
            !ALLOWED_TAILWIND_UTILITIES.includes(classWithoutOpacity)) {
          violations.push(className)
        }
      }

      return violations
    }

    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name && node.name.name === 'className' && node.value) {
          let classNameValue = null

          // Handle different types of className values
          if (node.value.type === 'Literal') {
            // className="bg-gray-100"
            classNameValue = node.value.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'Literal'
          ) {
            // className={'bg-gray-100'}
            classNameValue = node.value.expression.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'TemplateLiteral'
          ) {
            // className={`bg-gray-100 ${someVar}`} - check static parts
            const templateLiteral = node.value.expression
            for (const quasi of templateLiteral.quasis) {
              const violations = checkClassNames(quasi.value.raw)
              for (const violation of violations) {
                context.report({
                  node,
                  messageId: 'noTailwindBgColor',
                  data: {
                    utility: violation,
                  },
                })
              }
            }
            return
          }

          // Check for violations
          const violations = checkClassNames(classNameValue)
          for (const violation of violations) {
            context.report({
              node,
              messageId: 'noTailwindBgColor',
              data: {
                utility: violation,
              },
            })
          }
        }
      },
    }
  },
}