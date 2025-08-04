/**
 * @fileoverview Prevents use of Tailwind font size utilities in favor of design system tokens
 *
 * Purpose: Enforces the use of semantic design system font size tokens instead of
 * raw Tailwind utilities to ensure consistency and maintainability across the codebase.
 *
 * How to fix: Replace Tailwind font size utilities with design system tokens
 * - Instead of: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, etc.
 * - Use: text-hero, text-impact, text-header, text-subheader, text-body, or text-small
 *
 * @author Custom ESLint Plugin
 */
'use strict'

const TAILWIND_FONT_SIZE_TOKENS = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
  'text-6xl',
  'text-7xl',
  'text-8xl',
  'text-9xl',
]

// Approved design system tokens (these are allowed)
const APPROVED_TOKENS = [
  'text-hero',
  'text-impact',
  'text-header',
  'text-subheader',
  'text-body',
  'text-small',
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
        'Prevent use of Tailwind font size utilities in favor of design system tokens',
      category: 'Best Practices',
      recommended: true,
      url: '', // Optional: Replace with your documentation URL
    },
    fixable: null,
    schema: [],
    messages: {
      noTailwindFontSize:
        'Use design system font size tokens instead of Tailwind utilities. Replace "{{utility}}" with one of: ' +
        APPROVED_TOKENS.join(', '),
    },
  },

  create(context) {
    // Function to check if a class contains forbidden font size utilities
    function checkClassNames(classNameValue) {
      if (!classNameValue || typeof classNameValue !== 'string') {
        return []
      }

      const violations = []
      const classes = classNameValue.split(/\s+/)

      for (const className of classes) {
        // Handle responsive variants (e.g., sm:text-xl, md:text-2xl)
        const baseClass = className.includes(':')
          ? className.split(':').pop()
          : className

        if (TAILWIND_FONT_SIZE_TOKENS.includes(baseClass)) {
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
            // className="text-xl"
            classNameValue = node.value.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'Literal'
          ) {
            // className={'text-xl'}
            classNameValue = node.value.expression.value
          } else if (
            node.value.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'TemplateLiteral'
          ) {
            // className={`text-xl ${someVar}`} - check static parts
            const templateLiteral = node.value.expression
            for (const quasi of templateLiteral.quasis) {
              const violations = checkClassNames(quasi.value.raw)
              for (const violation of violations) {
                context.report({
                  node,
                  messageId: 'noTailwindFontSize',
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
              messageId: 'noTailwindFontSize',
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
