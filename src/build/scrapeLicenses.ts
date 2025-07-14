import { getProviders } from '@/app/api/providers/GET'
import { ICON_PROVIDERS } from '@/constants'
import { withTimeout } from '@/lib'
import { fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { Provider, ScrapedLicense } from '@/lib/schemas/database'
import path from 'path'
import { cloneRepo } from './utils'

// Timeout constants (in milliseconds)
const SCRAPE_OPERATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes for overall scraping
const FILE_READ_TIMEOUT = 30 * 1000 // 30 seconds for file operations

async function scrapeLicenses(): Promise<ScrapedLicense[]> {
  // Wrap the entire scraping operation with timeout
  return withTimeout(
    _scrapeLicensesInternal(),
    SCRAPE_OPERATION_TIMEOUT,
    'Scraping licenses for all providers',
  )
}

async function _scrapeLicensesInternal(): Promise<ScrapedLicense[]> {
  const providers = await getProviders()
  serverLogger.info(
    `Found ${providers.length} providers to scrape licenses for`,
  )
  return await Promise.all(providers.map(scrapeLicenseForProvider))
}

async function scrapeLicenseForProvider(
  provider: Provider,
): Promise<ScrapedLicense> {
  // Clone repo
  const providerSlug = Object.keys(ICON_PROVIDERS).find((slug) => {
    const iconProvider = ICON_PROVIDERS[slug as keyof typeof ICON_PROVIDERS]
    return iconProvider.git.url === provider.git_url
  }) as keyof typeof ICON_PROVIDERS | undefined
  if (!providerSlug) {
    throw new Error(
      `Could not find provider slug for provider: ${provider.name}`,
    )
  }
  const repoDir = await cloneRepo(providerSlug)

  // Get license URL
  const licenseFile = await findLicenseFile(repoDir)
  const relativePath = path.relative(repoDir, licenseFile)
  const repoUrl = provider.git_url.replace(/\.git$/, '') // Remove .git suffix if present
  const licenseUrl = `${repoUrl}/blob/${provider.git_branch}/${relativePath}`

  // Get license type
  const licenseContent = await withTimeout(
    fsp.readFile(licenseFile, 'utf-8'),
    FILE_READ_TIMEOUT,
    `Reading license file: ${licenseFile}`,
  )
  const licenseType = detectLicenseType(licenseContent)

  return {
    type: licenseType,
    url: licenseUrl,
    provider_id: provider.id,
  }
}

async function findLicenseFile(repoDir: string): Promise<string> {
  try {
    // Get all files in the root directory
    const files = await fsp.readdir(repoDir)

    // Look for LICENSE files with common variations
    const licensePattern = /^LICENSE([^\/]*)?$/i
    const licenseFile = files.find((file) => licensePattern.test(file))

    if (licenseFile) {
      const fullPath = path.join(repoDir, licenseFile)
      if (!(await pathExists(fullPath))) {
        throw new Error(`LICENSE file not found at ${fullPath}`)
      }
      return fullPath
    }

    throw new Error(`LICENSE file not found in ${repoDir}`)
  } catch (error) {
    serverLogger.error(`Error finding LICENSE file in ${repoDir}`, { error })
    throw error
  }
}

function detectLicenseType(content: string): string {
  const lowercaseContent = content.toLowerCase()

  // Common license patterns
  if (
    lowercaseContent.includes('mit license') ||
    (lowercaseContent.includes('mit') &&
      lowercaseContent.includes('permission is hereby granted'))
  ) {
    return 'MIT'
  }

  if (
    lowercaseContent.includes('apache license') ||
    lowercaseContent.includes('apache-2.0') ||
    (lowercaseContent.includes('apache') &&
      lowercaseContent.includes('version 2.0'))
  ) {
    return 'Apache 2.0'
  }

  if (
    lowercaseContent.includes('creative commons') &&
    lowercaseContent.includes('attribution 4.0')
  ) {
    return 'CC BY 4.0'
  }

  if (
    lowercaseContent.includes('creative commons') &&
    lowercaseContent.includes('cc0')
  ) {
    return 'CC0'
  }

  if (
    lowercaseContent.includes('isc license') ||
    (lowercaseContent.includes('isc') &&
      lowercaseContent.includes('permission to use'))
  ) {
    return 'ISC'
  }

  if (lowercaseContent.includes('bsd') && lowercaseContent.includes('clause')) {
    if (
      lowercaseContent.includes('3-clause') ||
      lowercaseContent.includes('three clause')
    ) {
      return 'BSD 3-Clause'
    }
    if (
      lowercaseContent.includes('2-clause') ||
      lowercaseContent.includes('two clause')
    ) {
      return 'BSD 2-Clause'
    }
    return 'BSD'
  }

  if (
    lowercaseContent.includes('gnu general public license') ||
    lowercaseContent.includes('gpl')
  ) {
    if (
      lowercaseContent.includes('version 3') ||
      lowercaseContent.includes('gplv3')
    ) {
      return 'GPL 3.0'
    }
    if (
      lowercaseContent.includes('version 2') ||
      lowercaseContent.includes('gplv2')
    ) {
      return 'GPL 2.0'
    }
    return 'GPL'
  }

  throw new Error(`Could not detect license type for ${content}`)
}

export { scrapeLicenses }
