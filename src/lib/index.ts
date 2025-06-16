import { Icon, ICON_PROVIDERS } from '@/constants'

function toGithubUrl(icon: Icon) {
  const { git } = ICON_PROVIDERS[icon.provider]
  const repoUrl = git.url.slice(0, -4) // remove .git
  const blobPath = icon.blobPath
  if (!blobPath) {
    throw new Error(`Icon ${icon.name} has no blob path`)
  }
  return `${repoUrl}/blob/${git.branch}/${blobPath}`
}

export { toGithubUrl }
