import { cn } from './utils'

const htmlAttributesToReact = (jsxContent: string): string => {
  if (!jsxContent.trim()) return ''

  // Regex to match JSX opening tags with attributes
  const jsxOpeningTagRegex =
    /<([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)\s+([^>]*?)(?:\s*\/?>)/g

  return jsxContent.replace(
    jsxOpeningTagRegex,
    (match, tagName, attributesString, _closingPart) => {
      // Parse the attribute string into key-value pairs
      const attributeRegex =
        /(\w+(?:-\w+)*(?::\w+)?)\s*=\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g
      const attributes: Array<[string, string]> = []
      let attributeMatch

      while (
        (attributeMatch = attributeRegex.exec(attributesString)) !== null
      ) {
        const [, key, , value] = attributeMatch
        if (key && value !== undefined) {
          attributes.push([key, value])
        }
      }

      // Convert each attribute to React format
      const reactAttributes = attributes.map(([key, value]) => {
        let reactKey = key
        let reactValue = value

        // Special handling for ARIA attributes - they should be lowercase
        if (key.startsWith('aria-')) {
          reactKey = key
        }
        // Special handling for data attributes - keep original form
        else if (key.startsWith('data-')) {
          reactKey = key
        }
        // Handle class attribute - convert to className
        else if (key === 'class') {
          reactKey = 'className'
        }
        // Handle for attribute - convert to htmlFor
        else if (key === 'for') {
          reactKey = 'htmlFor'
        }
        // Handle style attribute - convert CSS string to React object
        else if (key === 'style') {
          reactKey = 'style'
          reactValue = convertCssStringToReactStyle(value)
        }
        // Handle XML namespace attributes and other special cases
        else if (key.includes(':')) {
          const parts = key.split(':')
          if (parts.length === 2) {
            const [prefix, suffix] = parts as [string, string]
            reactKey = `${prefix}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`
          }
        }
        // Convert kebab-case to camelCase for other attributes
        else {
          reactKey = key.replace(/-([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          )
        }

        // For style attributes, value is already formatted with {{}}
        if (key === 'style') {
          return `${reactKey}=${reactValue}`
        }
        // For other attributes, wrap in quotes
        return `${reactKey}="${reactValue}"`
      })

      // Reconstruct the opening tag with converted attributes
      const attributesStr =
        reactAttributes.length > 0 ? ` ${reactAttributes.join(' ')}` : ''
      const closing = match.endsWith('/>') ? ' />' : '>'
      return `<${tagName}${attributesStr}${closing}`
    },
  )
}

/**
 * Converts CSS string to React style object format
 * Example: "fill:none;stroke:#000" -> "{{fill:'none',stroke:'#000'}}"
 */
const convertCssStringToReactStyle = (cssString: string): string => {
  if (!cssString.trim()) return '""'

  // Parse CSS declarations
  const declarations = cssString
    .split(';')
    .filter((decl) => decl.trim())
    .map((decl) => {
      const [property, value] = decl.split(':').map((s) => s.trim())
      if (!property || !value) return null

      // Convert kebab-case CSS properties to camelCase
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      )

      return `${camelCaseProperty}:'${value}'`
    })
    .filter(Boolean)

  if (declarations.length === 0) return '""'

  return `{{${declarations.join(',')}}}`
}

/**
 * Converts kebab-case, snake_case, or space-separated strings to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+/g, ' ') // Replace hyphens, underscores, and spaces with spaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '') // Remove any non-alphanumeric characters
}

export { cn, htmlAttributesToReact, toPascalCase }
