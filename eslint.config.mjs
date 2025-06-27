import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import customPlugin from './eslint-custom-plugin/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      custom: customPlugin,
    },
    rules: {
      'custom/no-restricted-route-imports': 'error',
      'custom/require-handle-errors': 'error',
      'custom/no-axios-in-api-routes': 'error',
      'custom/no-import-custom-error': 'error',
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
