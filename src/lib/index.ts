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
      const reactKey = key.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      )
      acc[reactKey] = value
      return acc
    },
    {} as Record<string, string>,
  )
}

export { htmlAttributesToReact, toGithubUrl }
