import { fs } from '@/lib/fs'
import path from 'path'

function getVersionFromChangelog(): string {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    const content = fs.readFileSync(changelogPath, 'utf-8')
    const versionRegex = /(\d+\.\d+\.\d+)/ // e.g. 1.0.0
    const versionMatch = content.match(versionRegex)
    return versionMatch?.[1] ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

export { getVersionFromChangelog }