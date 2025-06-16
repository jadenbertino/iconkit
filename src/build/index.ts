import path from 'path'
import { getAllIcons } from './parse.js'

const outputDir = path.join(process.cwd(), 'icons')
await getAllIcons(outputDir)
