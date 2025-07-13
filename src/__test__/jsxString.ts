import parse from 'html-react-parser'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates that a string contains valid JSX according to React standards
 * @param jsxString - The JSX string to validate
 * @returns ValidationResult with isValid boolean and array of error messages
 */
export function isValidJsxString(jsxString: string): ValidationResult {
  const errors: string[] = []

  // Basic checks
  if (!jsxString || typeof jsxString !== 'string') {
    return {
      isValid: false,
      errors: ['JSX string is required and must be a string'],
    }
  }

  const trimmed = jsxString.trim()
  if (!trimmed) {
    return { isValid: false, errors: ['JSX string cannot be empty'] }
  }

  // Try to parse with html-react-parser to check basic JSX validity
  try {
    parse(trimmed)
  } catch (error) {
    errors.push(
      `Invalid JSX syntax: ${error instanceof Error ? error.message : 'Unknown parsing error'}`,
    )
    return { isValid: false, errors }
  }

  // Validate JSX attribute naming conventions
  const attributeErrors = validateJsxAttributes(trimmed)
  errors.push(...attributeErrors)

  // Validate style attributes specifically
  const styleErrors = validateStyleAttributes(trimmed)
  errors.push(...styleErrors)

  // Validate proper JSX structure
  const structureErrors = validateJsxStructure(trimmed)
  errors.push(...structureErrors)

  // Validate no HTML comments
  const commentErrors = validateNoHtmlComments(trimmed)
  errors.push(...commentErrors)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates that JSX attributes follow React naming conventions (camelCase)
 */
function validateJsxAttributes(jsxString: string): string[] {
  const errors: string[] = []

  // Regex to match JSX opening tags with attributes
  const jsxTagRegex =
    /<([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)\s+([^>]*?)(?:\s*\/?>)/g
  let tagMatch

  while ((tagMatch = jsxTagRegex.exec(jsxString)) !== null) {
    const [, tagName, attributesString] = tagMatch

    if (!tagName || !attributesString) continue

    // Parse individual attributes
    const attributeRegex =
      /(\w+(?:-\w+)*(?::\w+)?)\s*=\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g
    let attributeMatch

    while ((attributeMatch = attributeRegex.exec(attributesString)) !== null) {
      const [, attributeName] = attributeMatch

      if (!attributeName) continue

      // Check if attribute name follows React conventions
      if (!isValidReactAttributeName(attributeName)) {
        errors.push(
          `Invalid attribute name "${attributeName}" in <${tagName}>. React attributes should be camelCase (except aria-*, data-*, and special cases)`,
        )
      }
    }
  }

  return errors
}

/**
 * Validates that style attributes are objects, not strings
 */
function validateStyleAttributes(jsxString: string): string[] {
  const errors: string[] = []

  // Look for style attributes
  const styleRegex = /style\s*=\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g
  let styleMatch

  while ((styleMatch = styleRegex.exec(jsxString)) !== null) {
    const [, , styleValue] = styleMatch

    if (!styleValue) continue

    // Check if style value looks like a string instead of an object
    if (!isValidStyleValue(styleValue)) {
      errors.push(
        `Style attribute should be an object, not a string. Found: style="${styleValue}"`,
      )
    }
  }

  return errors
}

/**
 * Validates proper JSX structure (balanced tags, proper nesting)
 */
function validateJsxStructure(jsxString: string): string[] {
  const errors: string[] = []

  // Check for balanced tags (simple validation)
  const tagStack: string[] = []
  const openingTagRegex =
    /<([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)\s*[^>]*?(?<!\/)\s*>/g
  const closingTagRegex =
    /<\/([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)\s*>/g
  const selfClosingTagRegex =
    /<([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)\s*[^>]*?\/\s*>/g

  // Remove self-closing tags first
  let tempString = jsxString.replace(selfClosingTagRegex, '')

  // Process opening and closing tags
  const allMatches: Array<{
    type: 'open' | 'close'
    tag: string
    index: number
  }> = []

  let match
  while ((match = openingTagRegex.exec(tempString)) !== null) {
    allMatches.push({ type: 'open', tag: match[1]!, index: match.index })
  }

  while ((match = closingTagRegex.exec(tempString)) !== null) {
    allMatches.push({ type: 'close', tag: match[1]!, index: match.index })
  }

  // Sort by index to process in order
  allMatches.sort((a, b) => a.index - b.index)

  // Check for balanced tags
  for (const { type, tag } of allMatches) {
    if (type === 'open') {
      tagStack.push(tag)
    } else if (type === 'close') {
      const lastOpen = tagStack.pop()
      if (!lastOpen) {
        errors.push(`Closing tag </${tag}> has no matching opening tag`)
      } else if (lastOpen !== tag) {
        errors.push(
          `Mismatched tags: opened <${lastOpen}> but closed </${tag}>`,
        )
      }
    }
  }

  // Check for unclosed tags
  if (tagStack.length > 0) {
    errors.push(
      `Unclosed tags: ${tagStack.map((tag) => `<${tag}>`).join(', ')}`,
    )
  }

  return errors
}

/**
 * Validates that there are no HTML comments in the JSX
 */
function validateNoHtmlComments(jsxString: string): string[] {
  const errors: string[] = []

  // Look for HTML comment patterns: <!-- -->
  const htmlCommentRegex = /<!--[\s\S]*?-->/g
  const matches = jsxString.match(htmlCommentRegex)

  if (matches) {
    matches.forEach((comment) => {
      errors.push(
        `HTML comments are not valid in JSX. Found: "${comment}". Use {/* JSX comments */} instead.`,
      )
    })
  }

  return errors
}

/**
 * Checks if an attribute name follows React naming conventions
 */
function isValidReactAttributeName(attributeName: string): boolean {
  // Disallow HTML attributes that should be converted to React equivalents
  const htmlOnlyAttributes = ['class', 'for']
  if (htmlOnlyAttributes.includes(attributeName)) {
    return false
  }

  // Allow aria-* attributes (should be lowercase with dashes)
  if (attributeName.startsWith('aria-')) {
    return /^aria-[a-z]+(-[a-z]+)*$/.test(attributeName)
  }

  // Allow data-* attributes (should be lowercase with dashes)
  if (attributeName.startsWith('data-')) {
    return /^data-[a-z]+(-[a-z]+)*$/.test(attributeName)
  }

  // Special React attributes that are camelCase
  const specialAttributes = [
    'className',
    'htmlFor',
    'onClick',
    'onChange',
    'onSubmit',
    'onFocus',
    'onBlur',
    'onMouseEnter',
    'onMouseLeave',
    'onKeyDown',
    'onKeyUp',
    'onKeyPress',
    'tabIndex',
    'contentEditable',
    'autoComplete',
    'autoFocus',
    'readOnly',
    'maxLength',
    'minLength',
    'spellCheck',
    'autoCapitalize',
    'autoCorrect',
    'crossOrigin',
    'useMap',
    'itemProp',
    'itemRef',
    'itemScope',
    'itemType',
    'itemID',
    'allowFullScreen',
    'formNoValidate',
    'noValidate',
  ]

  if (specialAttributes.includes(attributeName)) {
    return true
  }

  // Standard HTML attributes that are allowed in React (common ones)
  const standardHtmlAttributes = [
    'id',
    'title',
    'lang',
    'dir',
    'role',
    'src',
    'alt',
    'href',
    'target',
    'rel',
    'type',
    'name',
    'value',
    'placeholder',
    'disabled',
    'required',
    'checked',
    'selected',
    'multiple',
    'size',
    'cols',
    'rows',
    'wrap',
    'accept',
    'action',
    'method',
    'width',
    'height',
    'controls',
    'loop',
    'muted',
    'poster',
    'preload',
    'autoplay',
    'defer',
    'async',
    'open',
    'reversed',
    'start',
    'step',
    'min',
    'max',
    'low',
    'high',
    'optimum',
    'pattern',
    'list',
    'autocomplete',
    'capture',
    'download',
    'form',
    'hidden',
    'cite',
    'datetime',
    'manifest',
    'scope',
    'span',
    'headers',
    'rowspan',
    'colspan',
    'translate',
    'content',
    'results',
    'autofocus',
    'sizes',
    'srcset',
    'crossorigin',
    'usemap',
    'ismap',
    'sandbox',
    'srclang',
    'default',
    'kind',
    'label',
    'srcdoc',
    'scoped',
    'color',
    'nonce',
    'slot',
    'is',
    'part',
    'inputmode',
    'enterkeyhint',
    'viewBox',
    'fill',
    'stroke',
    'strokeWidth',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'strokeOpacity',
    'fillOpacity',
    'fillRule',
    'clipRule',
    'clipPath',
    'mask',
    'opacity',
    'filter',
    'transform',
    'transformOrigin',
  ]

  if (standardHtmlAttributes.includes(attributeName)) {
    return true
  }

  // For other attributes, they should be camelCase (no dashes, start with lowercase)
  // Allow: onClick, backgroundColor, etc.
  // Disallow: click-handler, background-color, etc.
  return /^[a-z][a-zA-Z0-9]*$/.test(attributeName)
}

/**
 * Checks if a style value appears to be a valid object reference or expression
 */
function isValidStyleValue(styleValue: string): boolean {
  // If it starts and ends with {}, it's likely an object expression
  if (styleValue.trim().startsWith('{') && styleValue.trim().endsWith('}')) {
    return true
  }

  // If it's a variable reference (starts with a letter, no spaces)
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(styleValue.trim())) {
    return true
  }

  // If it looks like CSS string syntax, it's invalid for React
  if (styleValue.includes(':') && styleValue.includes(';')) {
    return false
  }

  // Empty or undefined is okay
  if (!styleValue.trim() || styleValue.trim() === 'undefined') {
    return true
  }

  // If it looks like an object property access
  if (
    /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(
      styleValue.trim(),
    )
  ) {
    return true
  }

  return false
}

// Helper function for quick validation without detailed errors
export function isValidJsx(jsxString: string): boolean {
  return isValidJsxString(jsxString).isValid
}
