import { exec } from 'child_process'
import { default as fs, promises as fsp } from 'fs'
import * as fse from 'fs-extra'
import tmp from 'tmp'
import { promisify } from 'util'
import { z } from 'zod'
import { withTimeout } from './error'
import { serialize } from './logs/utils'
import { serverLogger } from './logs/server'

const execAsync = promisify(exec)
tmp.setGracefulCleanup()

/**
 * Executes a command with timeout
 */
async function execWithTimeout(
  command: string | string[],
  timeoutMs: number = 60 * 1000, // 60 seconds
) {
  const commandString = Array.isArray(command) ? command.join(' ') : command
  return withTimeout(execAsync(commandString), timeoutMs, `Command: ${command}`)
}

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

async function readJsonFile<T>(
  path: string,
  schema: z.ZodSchema<T> = z.unknown() as z.ZodSchema<T>,
): Promise<T> {
  let jsonContent: unknown
  try {
    jsonContent = await fse.readJson(path)
  } catch (error) {
    serverLogger.error(`Error reading JSON file: ${path}`, serialize(error))
    throw error
  }

  // Validate JSON
  const validation = schema.safeParse(jsonContent)
  if (!validation.success) {
    serverLogger.error(
      `Error validating JSON file: ${path}`,
      serialize(validation.error),
    )
    throw validation.error
  }

  return validation.data
}

export {
  execAsync,
  execWithTimeout,
  fs,
  fse,
  fsp,
  pathExists,
  readJsonFile,
  tmp,
}
