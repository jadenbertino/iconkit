import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const plugin = {
  rules: {
    'no-restricted-route-imports': require('./api-routes/no-restricted-route-imports.cjs'),
    'require-handle-errors': require('./api-routes/require-handle-errors.cjs'),
    'no-axios-in-api-routes': require('./api-routes/no-axios-in-api-routes.cjs'),
    'no-import-custom-error': require('./api-routes/no-import-custom-error.cjs'),
    'no-supabase-admin-outside-allowed-dirs': require('./api-routes/no-supabase-admin-outside-allowed-dirs.cjs'),
    'require-named-exports-in-icons': require('./icons.cjs'),
  },
}

export default plugin
