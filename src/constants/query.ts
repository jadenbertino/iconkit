// Database query limits for performance and security
export const MAX_LIMIT = 500 // Maximum items per request
export const MAX_SKIP = 50000 // Maximum skip offset to prevent excessive memory usage

// Search functionality limits
export const MAX_SEARCH_LENGTH = 200 // Maximum search text length
export const MAX_SEARCH_TERMS = 10 // Maximum number of search terms

// Provider and license query limits
export const MAX_PROVIDERS = 100 // Maximum providers to return
export const MAX_LICENSES = 200 // Maximum licenses to return

// Search text delimiters regex for splitting terms
export const DELIMITERS = /[\s\-_]+/