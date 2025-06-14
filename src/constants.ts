import path from 'path'
import type { Options as PrettierOptions } from 'prettier'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type IconProviderId = 'hero_icons'

type Icon = {
  id: string
  name: string
  style: 'solid' | 'outline'
  pixels: number
  svg_content: string
  provider: IconProviderId
}

type IconProvider = {
  id: IconProviderId
  name: string
  git_url: string
  sub_dir?: string
}

const ICON_PROVIDERS: Record<IconProviderId, Omit<IconProvider, 'id'>> = {
  hero_icons: {
    name: 'Hero Icons',
    sub_dir: path.join(__dirname, '../../heroicons/optimized'),
    git_url: 'https://github.com/tailwindlabs/heroicons.git',
  },
}

for (const [iconProviderId, { git_url }] of Object.entries(ICON_PROVIDERS)) {
  if (!git_url.endsWith('.git') || !git_url.startsWith('https://')) {
    console.error(
      `${iconProviderId} git_url is not a valid git url: ${git_url}`,
    )
    process.exit(1)
  }
}

const OUTPUT_FILE = path.join(__dirname, '../icon-list.json')

const prettierSvgConfig: PrettierOptions = {
  parser: 'html',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
}

export { ICON_PROVIDERS, OUTPUT_FILE, prettierSvgConfig }
export type { Icon }
