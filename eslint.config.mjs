import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import customPlugin from './eslint-custom-plugin/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Auto-generate rules for all custom plugin rules
const customRules = Object.keys(customPlugin.rules).reduce((acc, ruleName) => {
  acc[`custom/${ruleName}`] = 'error'
  return acc
}, {})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      custom: customPlugin,
    },
    rules: {
      ...customRules, // Auto-enable all custom rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]

export default eslintConfig
