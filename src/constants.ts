import path from 'path'
import type { Options as PrettierOptions } from 'prettier'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICON_PROVIDER_IDS = ['hero_icons', 'lucide', 'simple_icons'] as const
const IconProviderIdSchema = z.enum(ICON_PROVIDER_IDS)
type IconProviderId = z.infer<typeof IconProviderIdSchema>

const IconSchema = z.object({
  id: z.string(),
  name: z.string(),
  style: z.enum(['solid', 'outline']).nullable(),
  pixels: z.number().nullable(),
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

const ICON_PROVIDERS = {
  hero_icons: {
    name: 'Hero Icons',
    subDir: 'optimized',
    gitUrl: 'https://github.com/tailwindlabs/heroicons.git',
  },
  lucide: {
    name: 'Lucide',
    subDir: 'icons',
    gitUrl: 'https://github.com/lucide-icons/lucide.git',
  },
  simple_icons: {
    name: 'Simple Icons',
    subDir: 'icons',
    gitUrl: 'https://github.com/simple-icons/simple-icons.git',
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
export type { Icon, IconProviderId }
