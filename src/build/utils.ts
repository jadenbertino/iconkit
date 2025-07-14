import { ICON_PROVIDERS, type IconProviderSlug } from '@/constants/index'
import { execWithTimeout, fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import path from 'path'

async function cloneRepo(provider: IconProviderSlug): Promise<string> {
  const { git } = ICON_PROVIDERS[provider]
  const { url: gitUrl, branch } = git
  const randomId = 'dd000030-8ae8-4fda-adf8-c2d5416318af' as const // to avoid collisions
  const repoDir = path.join(`/tmp/iconProviders-${randomId}`, provider)

  // Cache hit
  if (await pathExists(repoDir)) {
    try {
      // Validate remote is the same
      const { stdout: currentRemote } = await execWithTimeout(
        `cd ${repoDir} && git remote get-url origin`,
      )
      if (currentRemote.trim() !== gitUrl) {
        throw new Error('Invalid git repository remote')
      }

      // Update repo + return path
      await updateRepo(repoDir, branch)
      return repoDir
    } catch (error) {
      // If git command fails, directory might be corrupted, remove it
      serverLogger.warn(`Invalid git repository at ${repoDir}, removing...`, {
        error,
      })
      await execWithTimeout(`rm -rf ${repoDir}`)
    }
  }

  // Cache miss / invalid remote
  serverLogger.info(`Cloning repository ${gitUrl} to ${repoDir}...`)
  await fsp.mkdir(path.dirname(repoDir), { recursive: true })
  await execWithTimeout(
    `git clone ${gitUrl} ${repoDir}`,
    3 * 60 * 1000, // tabler takes a while to clone
  )
  await updateRepo(repoDir, branch)
  return repoDir
}

async function updateRepo(repoDir: string, branch: string) {
  await execWithTimeout(`cd ${repoDir} && git checkout ${branch}`)
  await execWithTimeout(`cd ${repoDir} && git pull`)
}

export { cloneRepo }
