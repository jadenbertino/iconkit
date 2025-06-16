import path from 'path'
import type { Options as PrettierOptions } from 'prettier'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICON_PROVIDER_IDS = [
  'hero_icons', // 1288
  'lucide', // 1601
  'simple_icons', // 3308
  'feather_icons', // 287
  'font_awesome_free', // 2060
] as const
const IconProviderIdSchema = z.enum(ICON_PROVIDER_IDS)
type IconProviderId = z.infer<typeof IconProviderIdSchema>

const IconSchema = z.object({
  id: z.string(),
  name: z.string(),
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
  feather_icons: {
    name: 'Feather Icons',
    subDir: 'icons',
    gitUrl: 'https://github.com/feathericons/feather.git',
  },
  font_awesome_free: {
    name: 'Font Awesome Free',
    subDir: 'svgs',
    gitUrl: 'https://github.com/FortAwesome/Font-Awesome.git',
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
  ICON_PROVIDER_IDS,
  ICON_PROVIDERS,
  IconProviderSchema,
  ICONS_JSON_FILEPATH,
  IconSchema,
  prettierSvgConfig,
}
export type { Icon, IconProviderId }
