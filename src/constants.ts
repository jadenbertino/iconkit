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
  git_url: z.string(),
  sub_dir: z.string().optional(),
})

type IconProvider = z.infer<typeof IconProviderSchema>

type IconProviderId = z.infer<typeof IconProviderIdSchema>

const ICON_PROVIDERS: Record<IconProviderId, Omit<IconProvider, 'id'>> = {
  hero_icons: {
    name: 'Hero Icons',
    sub_dir: path.join(__dirname, '../../heroicons/optimized'),
    git_url: 'https://github.com/tailwindlabs/heroicons.git',
  },
}

for (const [iconProviderId, { git_url }] of Object.entries(ICON_PROVIDERS)) {
  if (!git_url.endsWith('.git') || !git_url.startsWith('https://')) {
    logger.error(`${iconProviderId} git_url is not a valid git url: ${git_url}`)
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
