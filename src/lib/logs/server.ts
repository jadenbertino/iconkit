import { SERVER_ENV } from '@/env/server'
import pino from 'pino'

const serverLogger = pino({
  formatters: {
    level(label) {
      return { level: label.toUpperCase() }
    },
  },
  level: SERVER_ENV.ENVIRONMENT === 'development' ? 'debug' : 'info',
})

export { serverLogger }
