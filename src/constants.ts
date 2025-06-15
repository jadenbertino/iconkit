import path from 'path'
import type { Options as PrettierOptions } from 'prettier'
import { fileURLToPath } from 'url'
import { z } from 'zod'
import { logger } from './lib/logs/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IconProviderIdSchema = z.enum(['hero_icons'])

const IconSchema = z.object({
  id: z.string(),
  name: z.string(),
  style: z.enum(['solid', 'outline']),
  pixels: z.number(),
  svg_content: z.string(),
  provider: IconProviderIdSchema,
})

type Icon = z.infer<typeof IconSchema>

const IconProviderSchema = z.object({
  id: IconProviderIdSchema,
  name: z.string(),
  gitUrl: z.string(),
  subDir: z.string().optional(),
})

type IconProvider = z.infer<typeof IconProviderSchema>

type IconProviderId = z.infer<typeof IconProviderIdSchema>

const ICON_PROVIDERS = {
  hero_icons: {
    name: 'Hero Icons',
    subDir: 'optimized',
    gitUrl: 'https://github.com/tailwindlabs/heroicons.git',
  },
} as const satisfies Record<IconProviderId, Omit<IconProvider, 'id'>>

for (const [iconProviderId, { gitUrl }] of Object.entries(ICON_PROVIDERS)) {
  if (!gitUrl.endsWith('.git') || !gitUrl.startsWith('https://')) {
    logger.error(`${iconProviderId} git_url is not a valid git url: ${gitUrl}`)
    process.exit(1)
  }
}

const ICONS_JSON_FILEPATH = path.join(__dirname, '../icon-list.json')

const prettierSvgConfig: PrettierOptions = {
  parser: 'html',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
}

export {
  ICON_PROVIDERS,
  IconProviderSchema,
  ICONS_JSON_FILEPATH,
  IconSchema,
  prettierSvgConfig,
}
export type { Icon }
