import { z } from 'zod'
import { IconProviderIdSchema } from './provider'

const LicenseTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['MIT', 'CC BY', 'CC0', 'Apache', 'ISC']),
  userObligations: z.string(),
  websiteObligations: z.string(),
})
type LicenseType = z.infer<typeof LicenseTypeSchema>

const LICENSE_TYPES = {
  mit: {
    name: 'MIT License',
    type: 'MIT',
    userObligations:
      'None for end use. If redistributing the actual icon files, must include the MIT license text. No attribution required for normal icon usage.',
    websiteObligations:
      "Include the original license text when redistributing (satisfied by linking to provider's license URL). No attribution required in the UI.",
  },
  isc: {
    name: 'ISC License',
    type: 'ISC',
    userObligations:
      'None for end use. If redistributing the actual icon files, must include the ISC license text. No attribution required for normal icon usage.',
    websiteObligations:
      "Include the original license text when redistributing (satisfied by linking to provider's license URL). No attribution required in the UI.",
  },
  cc_by_4: {
    name: 'Creative Commons Attribution 4.0',
    type: 'CC BY',
    userObligations:
      'Must provide attribution when using these icons. Attribution should include: creator name, source, and license type. Example: "Icon by [Provider Name] (CC BY 4.0)"',
    websiteObligations:
      'Provide clear attribution to the icon provider. Include link to the original source. Display license information prominently.',
  },
  cc0: {
    name: 'CC0 1.0 Universal',
    type: 'CC0',
    userObligations:
      "None - icons can be used without any restrictions. No attribution required (though it's appreciated).",
    websiteObligations:
      'None (work is in public domain). Can optionally provide attribution as courtesy.',
  },
  apache_2: {
    name: 'Apache License 2.0',
    type: 'Apache',
    userObligations:
      "None for end use. If redistributing the actual icon files, must include the Apache license text. Cannot use provider's trademarks without permission. No attribution required for normal icon usage.",
    websiteObligations:
      'Include the original license text when redistributing. No attribution required in the UI.',
  },
} as const satisfies Record<string, Omit<LicenseType, 'id'>>

const LicenseSchema = z.object({
  id: z.string(),
  providerId: IconProviderIdSchema,
  licenseTypeId: z.string(),
  url: z.string().url(),
})
type License = z.infer<typeof LicenseSchema>

const LICENSES = {
  hero_icons_mit: {
    providerId: 'hero_icons',
    licenseTypeId: 'mit',
    url: 'https://github.com/tailwindlabs/heroicons/blob/master/LICENSE',
  },
  lucide_isc: {
    providerId: 'lucide',
    licenseTypeId: 'isc',
    url: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
  },
  simple_icons_cc0: {
    providerId: 'simple_icons',
    licenseTypeId: 'cc0',
    url: 'https://github.com/simple-icons/simple-icons/blob/master/LICENSE.md',
  },
  feather_icons_mit: {
    providerId: 'feather_icons',
    licenseTypeId: 'mit',
    url: 'https://github.com/feathericons/feather/blob/master/LICENSE',
  },
  font_awesome_free_cc_by: {
    providerId: 'font_awesome_free',
    licenseTypeId: 'cc_by_4',
    url: 'https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt',
  },
  remix_icon_apache: {
    providerId: 'remix_icon',
    licenseTypeId: 'apache_2',
    url: 'https://github.com/Remix-Design/remixicon/blob/master/License',
  },
  octicons_mit: {
    providerId: 'octicons',
    licenseTypeId: 'mit',
    url: 'https://github.com/primer/octicons/blob/main/LICENSE',
  },
  boxicons_cc_by: {
    providerId: 'boxicons',
    licenseTypeId: 'cc_by_4',
    url: 'https://github.com/atisawd/boxicons/blob/master/LICENSE',
  },
  ionicons_mit: {
    providerId: 'ionicons',
    licenseTypeId: 'mit',
    url: 'https://github.com/ionic-team/ionicons/blob/main/LICENSE',
  },
  eva_icons_mit: {
    providerId: 'eva_icons',
    licenseTypeId: 'mit',
    url: 'https://github.com/akveo/eva-icons/blob/master/LICENSE.txt',
  },
  tabler_icons_mit: {
    providerId: 'tabler_icons',
    licenseTypeId: 'mit',
    url: 'https://github.com/tabler/tabler-icons/blob/main/LICENSE',
  },
} as const satisfies Record<string, Omit<License, 'id'>>

export { LICENSE_TYPES, LICENSES, LicenseSchema, LicenseTypeSchema }
export type { License, LicenseType }
