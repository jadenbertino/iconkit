import { ICONS_JSON_FILEPATH } from './constants.js'
import { createIconsList } from './parse/index.js'

await createIconsList(ICONS_JSON_FILEPATH)

