import { ICONS_JSON_FILEPATH } from '../constants.js'
import { getAllIcons } from './parse.js'

await getAllIcons(ICONS_JSON_FILEPATH)
