import { ICONS_JSON_FILEPATH, IconSchema } from '@/constants.js'
import { readJsonFile } from '@/lib/fs.js'
import { z } from 'zod'
import { createIconsList } from './heroIcons.js'

await createIconsList()
const result = await readJsonFile(ICONS_JSON_FILEPATH, z.array(IconSchema))
console.log(result.slice(0, 5))
