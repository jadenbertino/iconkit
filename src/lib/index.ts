import { promises as fsp } from 'fs'
import { z } from 'zod'
import { serialize } from './logs/index.js'

async function readJsonFile<T>(
  path: string,
  schema: z.ZodSchema<T> = z.unknown() as z.ZodSchema<T>,
): Promise<T> {
  // Read file
  try {
    await fsp.access(path)
  } catch (error) {
    console.error(`File does not exist: ${path}`)
    throw new Error(`File does not exist: ${path}`)
  }
  const file = await fsp.readFile(path, 'utf8')

  // Parse JSON
  let jsonContent: unknown
  try {
    jsonContent = JSON.parse(file)
  } catch (error) {
    console.error(`Error parsing JSON file: ${path}`, serialize(error))
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

export { readJsonFile }
