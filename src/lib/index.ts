import { Icon, ICON_PROVIDERS } from '@/constants'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

function toGithubUrl(icon: Icon) {
  const { git } = ICON_PROVIDERS[icon.provider]
  const repoUrl = git.url.slice(0, -4) // remove .git
  const blobPath = icon.blobPath
  if (!blobPath) {
    throw new Error(`Icon ${icon.name} has no blob path`)
  }
  return `${repoUrl}/blob/${git.branch}/${blobPath}`
}

const htmlAttributesToReact = (attrs: Record<string, string>) => {
  return Object.entries(attrs).reduce(
    (acc, [key, value]) => {
      // Special handling for ARIA attributes - they should be lowercase
      if (key.startsWith('aria-')) {
        acc[key] = value
        return acc
      }
      // Special handling for data attributes - keep original form
      if (key.startsWith('data-')) {
        acc[key] = value
        return acc
      }
      // Handle style attribute - convert string to object
      if (key === 'style') {
        const styleObject = value.split(';').reduce(
          (style, rule) => {
            const [property, value] = rule.split(':').map((s) => s.trim())
            if (property && value) {
              // Convert CSS property to camelCase
              const reactProperty = property.replace(/-([a-z])/g, (_, letter) =>
                letter.toUpperCase(),
              )
              style[reactProperty] = value
            }
            return style
          },
          {} as Record<string, string>,
        )
        acc[key] = styleObject
        return acc
      }
      // Handle XML namespace attributes and other special cases
      if (key.includes(':')) {
        const parts = key.split(':')
        if (parts.length === 2) {
          const [prefix, suffix] = parts as [string, string]
          const reactKey = `${prefix}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`
          acc[reactKey] = value
          return acc
        }
      }
      const reactKey = key.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      )
      acc[reactKey] = value
      return acc
    },
    {} as Record<string, string | Record<string, string>>,
  )
}

export { htmlAttributesToReact, toGithubUrl }
