import { fs } from '@/lib/fs'
import path from 'path'
import { VersionSchema } from './client'

function getVersionFromChangelog(): string {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
  const content = fs.readFileSync(changelogPath, 'utf-8')
  const firstLine = content.split('\n')[0]?.trim()
  const validation = VersionSchema.safeParse(firstLine)
  if (!validation.success) {
    console.error(
      `❌ Error: Invalid version found in CHANGELOG.md: ${firstLine}`,
    )
    throw new Error('Invalid version found in CHANGELOG.md')
  }
  return validation.data
}

export { getVersionFromChangelog }
