import {
  ICON_PROVIDERS,
  IconProviderId,
  prettierSvgConfig,
} from '@/constants.js'
import { exec } from 'child_process'
import { default as fs, promises as fsp } from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import prettier from 'prettier'
import tmp from 'tmp'
import { promisify } from 'util'
import { z } from 'zod'
import { logger, serialize } from './logs/index.js'

const execAsync = promisify(exec)
tmp.setGracefulCleanup()

/**
 * Helper function to check if a path exists
 */
async function pathExists(path: string): Promise<boolean> {
  try {
    await fsp.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Clones a git repository to a temporary directory
 * @param gitUrl - The git repository URL to clone
 * @param repoName - Optional name for the repository directory (defaults to 'repo')
 * @returns The path to the cloned repository directory
 */
async function cloneRepo(gitUrl: string, repoName: string): Promise<string> {
  if (!isValidGitUrl(gitUrl)) {
    throw new Error(`Invalid git URL: ${gitUrl}`)
  }
  const tmpDir = tmp.dirSync({ unsafeCleanup: true })
  const repoDir = path.join(tmpDir.name, repoName)
  await execAsync(`git clone ${gitUrl} ${repoDir}`)
  logger.info(`Cloned repo from ${gitUrl} to ${repoDir}`)
  return repoDir
}

function isValidGitUrl(gitUrl: string): boolean {
  return (
    gitUrl.endsWith('.git') &&
    (gitUrl.startsWith('https://') ||
      gitUrl.startsWith('http://') ||
      gitUrl.startsWith('git@'))
  )
}

async function readJsonFile<T>(
  path: string,
  schema: z.ZodSchema<T> = z.unknown() as z.ZodSchema<T>,
): Promise<T> {
  let jsonContent: unknown
  try {
    jsonContent = await fse.readJson(path)
  } catch (error) {
    console.error(`Error reading JSON file: ${path}`, serialize(error))
    throw error
  }

  // Validate JSON
  const validation = schema.safeParse(jsonContent)
  if (!validation.success) {
    console.error(
      `Error validating JSON file: ${path}`,
      serialize(validation.error),
    )
    throw validation.error
  }

  return validation.data
}

/**
 * Creates a temporary directory for an icon provider
 * and returns the path to the icons directory
 */
async function getIconDir(provider: IconProviderId): Promise<string> {
  const { gitUrl, subDir } = ICON_PROVIDERS[provider]
  const repoDir = await cloneRepo(gitUrl, provider)
  const iconsDir = path.join(repoDir, subDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(
      `Icons directory for ${provider} does not exist: ${iconsDir}`,
    )
  }
  return iconsDir
}

async function formatSvg(svgContent: string): Promise<string> {
  return await prettier.format(svgContent, prettierSvgConfig)
}

export {
  cloneRepo,
  execAsync,
  formatSvg,
  fs,
  fse,
  fsp,
  getIconDir,
  pathExists,
  readJsonFile,
  tmp,
}
