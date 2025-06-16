import type { Options as PrettierOptions } from 'prettier'
import { z } from 'zod'

const ICON_PROVIDER_IDS = [
  'hero_icons',
  'lucide',
  'simple_icons',
  'feather_icons',
  'font_awesome_free',
  'remix_icon',
  'octicons',
  'boxicons',
  'ionicons',
  'eva_icons',
  // 'typicons', // - causing issues
  'tabler_icons',
] as const
const IconProviderIdSchema = z.enum(ICON_PROVIDER_IDS)
type IconProviderId = z.infer<typeof IconProviderIdSchema>

const IconSchema = z.object({
  id: z.string(),
  name: z.string(),
  innerSvgContent: z.string(),
  provider: IconProviderIdSchema,
  blobPath: z.string().nullable(),
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
  remix_icon: {
    name: 'Remix Icon',
    subDir: 'icons',
    gitUrl: 'https://github.com/Remix-Design/remixicon.git',
  },
  octicons: {
    name: 'Octicons',
    subDir: 'icons',
    gitUrl: 'https://github.com/primer/octicons.git',
  },
  boxicons: {
    name: 'Boxicons',
    subDir: 'svg',
    gitUrl: 'https://github.com/atisawd/boxicons.git',
  },
  ionicons: {
    name: 'Ionicons',
    subDir: 'src/svg',
    gitUrl: 'https://github.com/ionic-team/ionicons.git',
  },
  eva_icons: {
    name: 'Eva Icons',
    subDir: 'package/icons',
    gitUrl: 'https://github.com/akveo/eva-icons.git',
  },
  // typicons: {
  //   name: 'Typicons',
  //   subDir: 'src/svg',
  //   gitUrl: 'https://github.com/stephenhutchings/typicons.git',
  // },
  tabler_icons: {
    name: 'Tabler Icons',
    subDir: 'icons',
    gitUrl: 'https://github.com/tabler/tabler-icons.git',
  },
} as const satisfies Record<IconProviderId, Omit<IconProvider, 'id'>>

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
  IconSchema,
  prettierSvgConfig,
}
export type { Icon, IconProviderId }
