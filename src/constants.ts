import path from 'path'
import type { Options as PrettierOptions } from 'prettier'
import { fileURLToPath } from 'url'
import { z } from 'zod'

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
