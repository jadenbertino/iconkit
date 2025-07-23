import { ICON_PROVIDERS, type IconProviderSlug } from '@/constants/index'
import { execWithTimeout, fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import path from 'path'

/**
 * Generates sparse-checkout patterns from provider configuration
 */
function generateCheckoutPatterns(checkout: string[]): string[] {
  const patterns = [
    ...checkout, // Provider-specific patterns
    'LICENSE*', // LICENSE files (various extensions)
    'license*', // lowercase license files
    'License*', // Title case license files
  ]
  return patterns
}

async function cloneRepo(provider: IconProviderSlug): Promise<string> {
  const { git } = ICON_PROVIDERS[provider]
  const { url: gitUrl, branch, checkout } = git
  const randomId = 'dd000030-8ae8-4fda-adf8-c2d5416318af' as const // to avoid collisions
  const repoDir = path.join(`/tmp/iconProviders-${randomId}`, provider)

  // Generate checkout patterns
  const checkoutPatterns = generateCheckoutPatterns(checkout)

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

      // Update repo with sparse-checkout + return path
      await updateRepoWithSparseCheckout(repoDir, branch, checkoutPatterns)
      serverLogger.info(`⬇️ Updated repository with sparse-checkout`, {
        gitUrl,
        repoDir,
      })
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
  await fsp.mkdir(path.dirname(repoDir), { recursive: true })

  // Clone with sparse-checkout optimization
  await cloneRepoWithSparseCheckout(gitUrl, repoDir, branch, checkoutPatterns)
  serverLogger.info(`⬇️ Cloned repository with sparse-checkout`, {
    gitUrl,
    repoDir,
  })
  return repoDir
}

async function cloneRepoWithSparseCheckout(
  gitUrl: string,
  repoDir: string,
  branch: string,
  checkoutPatterns: string[],
): Promise<void> {
  // Clone without checking out files, single branch, depth 1, filtered
  await execWithTimeout(
    [
      'git',
      'clone',
      '--no-checkout',
      '--filter=blob:none',
      '--depth=1',
      '--single-branch',
      `--branch=${branch}`,
      gitUrl,
      repoDir,
    ],
    3 * 60 * 1000,
  )

  // Setup sparse-checkout for this repo
  await setupSparseCheckout(repoDir, branch, checkoutPatterns)
}

async function setupSparseCheckout(
  repoDir: string,
  branch: string,
  patterns: string[],
): Promise<void> {
  // Enable sparse-checkout
  await execWithTimeout(`cd ${repoDir} && git config core.sparseCheckout true`)

  // Write patterns to sparse-checkout file
  const sparseCheckoutContent = patterns.join('\n')
  await fsp.writeFile(
    path.join(repoDir, '.git', 'info', 'sparse-checkout'),
    sparseCheckoutContent,
  )

  // Checkout the specified branch with sparse-checkout
  await execWithTimeout(`cd ${repoDir} && git checkout ${branch}`)
}

async function updateRepoWithSparseCheckout(
  repoDir: string,
  branch: string,
  patterns: string[],
): Promise<void> {
  // Ensure sparse-checkout is still configured correctly
  await setupSparseCheckout(repoDir, branch, patterns)

  // Pull latest changes (shallow repos need --depth=1)
  await execWithTimeout(`cd ${repoDir} && git pull --depth=1`)
}

export { cloneRepo }
