import { z } from 'zod'

const ICON_PROVIDER_SLUGS = [
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

const ICON_LIBRARY_COUNT = ICON_PROVIDER_SLUGS.length

const IconProviderSlugSchema = z.enum(ICON_PROVIDER_SLUGS)
type IconProviderSlug = z.infer<typeof IconProviderSlugSchema>

const IconProviderSchema = z.object({
  id: IconProviderSlugSchema,
  name: z.string(),
  git: z.object({
    iconsDir: z.string().optional(),
    url: z.string().url().startsWith('https://'),
    branch: z.string(),
    checkout: z.array(z.string()),
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
      checkout: ['optimized/*'],
    },
  },
  lucide: {
    name: 'Lucide',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/lucide-icons/lucide.git',
      branch: 'main',
      checkout: ['icons/*'],
    },
  },
  simple_icons: {
    name: 'Simple Icons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/simple-icons/simple-icons.git',
      branch: 'master',
      checkout: ['icons/*', 'data/simple-icons.json'],
    },
  },
  feather_icons: {
    name: 'Feather Icons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/feathericons/feather.git',
      branch: 'main',
      checkout: ['icons/*', 'src/tags.json'],
    },
  },
  font_awesome_free: {
    name: 'Font Awesome Free',
    git: {
      iconsDir: 'svgs',
      url: 'https://github.com/FortAwesome/Font-Awesome.git',
      branch: '6.x',
      checkout: ['svgs/*', 'metadata/icons.json'],
    },
  },
  remix_icon: {
    name: 'Remix Icon',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/Remix-Design/remixicon.git',
      branch: 'master',
      checkout: ['icons/*', 'tags.json'],
    },
  },
  octicons: {
    name: 'Octicons',
    git: {
      iconsDir: 'icons',
      url: 'https://github.com/primer/octicons.git',
      branch: 'main',
      checkout: ['icons/*', 'keywords.json'],
    },
  },
  boxicons: {
    name: 'Boxicons',
    git: {
      iconsDir: 'svg',
      url: 'https://github.com/atisawd/boxicons.git',
      branch: 'master',
      checkout: ['svg/*'],
    },
  },
  ionicons: {
    name: 'Ionicons',
    git: {
      iconsDir: 'src/svg',
      url: 'https://github.com/ionic-team/ionicons.git',
      branch: 'main',
      checkout: ['src/svg/*', 'src/data.json'],
    },
  },
  eva_icons: {
    name: 'Eva Icons',
    git: {
      iconsDir: 'package/icons',
      url: 'https://github.com/akveo/eva-icons.git',
      branch: 'master',
      checkout: ['package/icons/*'],
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
      checkout: ['icons/*', 'aliases.json'],
    },
  },
} as const satisfies Record<IconProviderSlug, Omit<IconProvider, 'id'>>

export {
  ICON_LIBRARY_COUNT,
  ICON_PROVIDER_SLUGS,
  ICON_PROVIDERS,
  IconProviderSchema,
  IconProviderSlugSchema,
}
export type { IconProvider, IconProviderSlug }
