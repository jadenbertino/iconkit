import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const plugin = {
  rules: {
    'no-restricted-route-imports': require('./api-routes/no-restricted-route-imports.cjs'),
    'require-handle-errors': require('./api-routes/require-handle-errors.cjs'),
    'no-axios-in-api-routes': require('./api-routes/no-axios-in-api-routes.cjs'),
    'no-import-custom-error': require('./api-routes/no-import-custom-error.cjs'),
  },
}

export default plugin
