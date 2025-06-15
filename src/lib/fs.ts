import { default as fs, promises as fsp } from 'fs'
import * as fse from 'fs-extra'

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

export { fs, fse, fsp, pathExists }
