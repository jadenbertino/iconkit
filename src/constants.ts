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
  blobPath: z.string(),
})
type Icon = z.infer<typeof IconSchema>

const IconProviderSchema = z.object({
  id: IconProviderIdSchema,
  name: z.string(),
  git: z.object({
    iconsDir: z.string().optional(),
    url: z.string().url().startsWith('https://'),
    branch: z.string(),
  }),
})
type IconProvider = z.infer<typeof IconProviderSchema>

const ICON_PROVIDERS = {
  hero_icons: {
    name: 'Hero Icons',
    git: {
      iconsDir: 'optimized',
      url: 'https://github.com/tailwindlabs/heroicons.git',
      branch: 'master',
    },
  },
  lucide: {
    name: 'Lucide',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/lucide-icons/lucide.git',
      branch: 'main',
    },
  },
  simple_icons: {
    name: 'Simple Icons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/simple-icons/simple-icons.git',
      branch: 'master',
    },
  },
  feather_icons: {
    name: 'Feather Icons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/feathericons/feather.git',
      branch: 'main',
    },
  },
  font_awesome_free: {
    name: 'Font Awesome Free',
    git: {
      iconsDir: 'svgs',
      url: 'https://github.com/FortAwesome/Font-Awesome.git',
      branch: '6.x',
    },
  },
  remix_icon: {
    name: 'Remix Icon',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/Remix-Design/remixicon.git',
      branch: 'master',
    },
  },
  octicons: {
    name: 'Octicons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/primer/octicons.git',
      branch: 'main',
    },
  },
  boxicons: {
    name: 'Boxicons',
    git: {
      iconsDir: 'svg',
      url: 'https://github.com/atisawd/boxicons.git',
      branch: 'master',
    },
  },
  ionicons: {
    name: 'Ionicons',
    git: {
      iconsDir: 'src/svg',
      url: 'https://github.com/ionic-team/ionicons.git',
      branch: 'main',
    },
  },
  eva_icons: {
    name: 'Eva Icons',
    git: {
      iconsDir: 'package/icons',
      url: 'https://github.com/akveo/eva-icons.git',
      branch: 'master',
    },
  },
  // typicons: {
  //   name: 'Typicons',
  // },
  //   iconsDir: 'src/svg',
  tabler_icons: {
    name: 'Tabler Icons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/tabler/tabler-icons.git',
      branch: 'main',
    },
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
