import { z } from 'zod'
import { IconProviderIdSchema } from './provider'

const LicenseSchema = z.object({
  id: z.string(),
  providerId: IconProviderIdSchema,
  name: z.string(),
  type: z.enum(['MIT', 'CC BY', 'CC0', 'Apache', 'ISC']),
  url: z.string().url(),
  attributionRequired: z.boolean(),
})
type License = z.infer<typeof LicenseSchema>

const LICENSES = {
  hero_icons_mit: {
    providerId: 'hero_icons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/tailwindlabs/heroicons/blob/master/LICENSE',
    attributionRequired: false,
  },
  lucide_isc: {
    providerId: 'lucide',
    name: 'ISC License',
    type: 'ISC',
    url: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
    attributionRequired: false,
  },
  simple_icons_cc0: {
    providerId: 'simple_icons',
    name: 'CC0 1.0 Universal',
    type: 'CC0',
    url: 'https://github.com/simple-icons/simple-icons/blob/master/LICENSE.md',
    attributionRequired: false,
  },
  feather_icons_mit: {
    providerId: 'feather_icons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/feathericons/feather/blob/master/LICENSE',
    attributionRequired: false,
  },
  font_awesome_free_cc_by: {
    providerId: 'font_awesome_free',
    name: 'Creative Commons Attribution 4.0',
    type: 'CC BY',
    url: 'https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt',
    attributionRequired: true,
  },
  remix_icon_apache: {
    providerId: 'remix_icon',
    name: 'Apache License 2.0',
    type: 'Apache',
    url: 'https://github.com/Remix-Design/remixicon/blob/master/License',
    attributionRequired: false,
  },
  octicons_mit: {
    providerId: 'octicons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/primer/octicons/blob/main/LICENSE',
    attributionRequired: false,
  },
  boxicons_cc_by: {
    providerId: 'boxicons',
    name: 'Creative Commons Attribution 4.0',
    type: 'CC BY',
    url: 'https://github.com/atisawd/boxicons/blob/master/LICENSE',
    attributionRequired: true,
  },
  ionicons_mit: {
    providerId: 'ionicons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/ionic-team/ionicons/blob/main/LICENSE',
    attributionRequired: false,
  },
  eva_icons_mit: {
    providerId: 'eva_icons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/akveo/eva-icons/blob/master/LICENSE.txt',
    attributionRequired: false,
  },
  tabler_icons_mit: {
    providerId: 'tabler_icons',
    name: 'MIT License',
    type: 'MIT',
    url: 'https://github.com/tabler/tabler-icons/blob/main/LICENSE',
    attributionRequired: false,
  },
} as const satisfies Record<string, Omit<License, 'id'>>

export { LICENSES, LicenseSchema }
export type { License }
