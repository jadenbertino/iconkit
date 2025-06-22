import path from 'path'
import { getAllIcons } from './parse'

const outputDir = path.join(process.cwd(), 'icons')
await getAllIcons(outputDir)
