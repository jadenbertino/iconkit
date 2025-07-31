/**
 * @fileoverview Prevents use of Tailwind text color utilities in favor of design system tokens
 *
 * Purpose: Enforces the use of semantic design system text color tokens instead of
 * raw Tailwind utilities to ensure consistency and maintainability across the codebase.
 *
 * How to fix: Replace Tailwind text color utilities with design system tokens
 * - Instead of: text-gray-400, text-red-500, text-blue-600, etc.
 * - Use: text-neutral, text-neutral-high, text-error, text-success, etc.
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

// Generate all possible Tailwind text color utilities
const TAILWIND_TEXT_COLOR_UTILITIES = []
for (const color of TAILWIND_COLOR_NAMES) {
  // Standard colors: text-gray-100, text-gray-200, etc.
  for (let i = 50; i <= 950; i += i < 100 ? 50 : 100) {
    TAILWIND_TEXT_COLOR_UTILITIES.push(`text-${color}-${i}`)
  }
  // Base colors: text-gray, text-red, etc. (but exclude single word colors like text-neutral which is our design token)
  if (color !== 'neutral') {
    TAILWIND_TEXT_COLOR_UTILITIES.push(`text-${color}`)
  }
}

// Approved design system tokens (these are allowed)
const APPROVED_TOKENS = [
  'text-neutral-high',
  'text-neutral',
  'text-neutral-low', 
  'text-neutral-lowest',
  'text-success',
  'text-error',
  'text-warning',
  'text-primary',
  'text-info',
]

// Special Tailwind utilities that should be allowed (legitimate use cases)
const ALLOWED_TAILWIND_UTILITIES = [
  'text-transparent',
  'text-current',
  'text-inherit',
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
        'Prevent use of Tailwind text color utilities in favor of design system tokens',
      category: 'Best Practices',
      recommended: true,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noTailwindTextColor:
        'Use design system text color tokens instead of Tailwind utilities. Replace "{{utility}}" with one of: ' +
        APPROVED_TOKENS.join(', '),
    },
  },

  create(context) {
    // Function to check if a class contains forbidden text color utilities
    function checkClassNames(classNameValue) {
      if (!classNameValue || typeof classNameValue !== 'string') {
        return []
      }

      const violations = []
      const classes = classNameValue.split(/\s+/)

      for (const className of classes) {
        // Handle responsive variants (e.g., sm:text-gray-400, md:text-red-500)
        const baseClass = className.includes(':')
          ? className.split(':').pop()
          : className

        // Check for opacity variants (e.g., text-gray-400/50, text-red-500/75)
        const classWithoutOpacity = baseClass.includes('/')
          ? baseClass.split('/')[0]
          : baseClass

        // Only flag as violation if it's a forbidden Tailwind utility AND not an approved token or allowed utility
        if (TAILWIND_TEXT_COLOR_UTILITIES.includes(classWithoutOpacity) && 
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
            // className="text-gray-400"
            classNameValue = node.value.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'Literal'
          ) {
            // className={'text-gray-400'}
            classNameValue = node.value.expression.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'TemplateLiteral'
          ) {
            // className={`text-gray-400 ${someVar}`} - check static parts
            const templateLiteral = node.value.expression
            for (const quasi of templateLiteral.quasis) {
              const violations = checkClassNames(quasi.value.raw)
              for (const violation of violations) {
                context.report({
                  node,
                  messageId: 'noTailwindTextColor',
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
              messageId: 'noTailwindTextColor',
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