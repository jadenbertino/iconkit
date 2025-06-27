import {
  ICON_PROVIDER_IDS,
  ICON_PROVIDERS,
  type IconProviderId,
} from '@/constants/index'
import { SERVER_ENV } from '@/env/server'
import { execAsync, fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { IconSchema } from '@/lib/schemas/database'
import path from 'path'
import type { z } from 'zod'

type LocalIcon = Omit<
  z.infer<typeof IconSchema.Insert>,
  'provider_id' | 'created_at'
>

async function getAllIcons(outputDir: string): Promise<void> {
  await fsp.mkdir(outputDir, { recursive: true })
  await Promise.all(
    ICON_PROVIDER_IDS.map((provider) => {
      const outputFile = path.join(outputDir, `${provider}.json`)
      return getIconsFromProvider(provider, outputFile)
    }),
  )
}

async function getIconsFromProvider(
  provider: IconProviderId,
  outputFile: string,
) {
  // Clone repo to tmp dir
  const start = Date.now()
  const repoDir = await cloneRepo(provider)
  const { git } = ICON_PROVIDERS[provider]
  const iconsDir = path.join(repoDir, git.iconsDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(
      `Icons directory for ${provider} does not exist: ${iconsDir}`,
    )
  }

  // Get all files recursively
  const filenames = await fsp.readdir(iconsDir, { recursive: true })
  const files = filenames.map((f) => path.join(iconsDir, f))
  const svgFiles = files.filter((file) => file.endsWith('.svg'))

  // Parse svg files
  const icons = await Promise.all(
    svgFiles.map(async (filePath): Promise<LocalIcon> => {
      const name = path.basename(filePath, '.svg')
      const svgContent = await fsp.readFile(filePath, 'utf-8')
      // Remove the SVG wrapper tags and get the inner content
      const cleanedSvgContent = svgContent
        .replace(/"/g, "'") // replace " with '
        .trim()

      // Construct source URL
      const relativePath = path.relative(repoDir, filePath)
      const repoUrl = git.url.replace(/\.git$/, '') // Remove .git suffix if present
      const source_url = `${repoUrl}/blob/${git.branch}/${relativePath}`

      return {
        name,
        svg: cleanedSvgContent,
        version: SERVER_ENV.VERSION,
        source_url,
      }
    }),
  )

  // Log and write to file
  const stop = Date.now()
  const seconds = (stop - start) / 1000
  serverLogger.info(`${provider} Icons parsed`, {
    count: icons.length,
    seconds,
  })
  await fsp.writeFile(outputFile, JSON.stringify(icons, null, 2))
  serverLogger.info(
    `Successfully generated icon list for ${provider} with ${icons.length} icons`,
  )
}

async function cloneRepo(provider: IconProviderId): Promise<string> {
  const { git } = ICON_PROVIDERS[provider]
  const { url: gitUrl, branch } = git
  const randomId = 'dd000030-8ae8-4fda-adf8-c2d5416318af' as const // to avoid collisions
  const repoDir = path.join(`/tmp/iconProviders-${randomId}`, provider)

  // Cache hit
  if (await pathExists(repoDir)) {
    try {
      const { stdout: currentRemote } = await execAsync(
        `cd ${repoDir} && git remote get-url origin`,
      )
      if (currentRemote.trim() === gitUrl) {
        await execAsync(`cd ${repoDir} && git checkout ${branch}`)
        await execAsync(`cd ${repoDir} && git pull`)
        const { stdout: currentBranch } = await execAsync(
          `cd ${repoDir} && git branch --show-current`,
        )
        serverLogger.info(`Updated ${provider} repo.`, {
          branch: currentBranch.trim(),
        })
        return repoDir
      } else {
        throw new Error('Invalid git repository remote')
      }
    } catch {
      // If git command fails, directory might be corrupted
      serverLogger.warn(`Invalid git repository at ${repoDir}, removing...`)
      await execAsync(`rm -rf ${repoDir}`)
    }
  }

  // Cache miss / invalid remote
  await fsp.mkdir(path.dirname(repoDir), { recursive: true })
  await execAsync(`git clone ${gitUrl} ${repoDir}`)
  await execAsync(`cd ${repoDir} && git checkout ${branch}`)
  await execAsync(`cd ${repoDir} && git pull`)
  const { stdout: currentBranch } = await execAsync(
    `cd ${repoDir} && git branch --show-current`,
  )
  serverLogger.info(`Cloned repo from ${gitUrl} to ${repoDir}`, {
    branch: currentBranch.trim(),
  })
  return repoDir
}

export { getAllIcons }
