import type { Options as PrettierOptions } from 'prettier'

const prettierSvgConfig: PrettierOptions = {
  parser: 'html',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
}

const PAGE_SIZE = 105

export { PAGE_SIZE, prettierSvgConfig }
