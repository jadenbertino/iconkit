import type { Options as PrettierOptions } from 'prettier'
import { z } from 'zod'
import { IconProviderIdSchema } from './provider'

const IconSchema = z.object({
  id: z.string(),
  name: z.string(),
  svgContent: z.string(),
  provider: IconProviderIdSchema,
  blobPath: z.string(),
})
type Icon = z.infer<typeof IconSchema>

const prettierSvgConfig: PrettierOptions = {
  parser: 'html',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
}

export { IconSchema, prettierSvgConfig }
export type { Icon }
