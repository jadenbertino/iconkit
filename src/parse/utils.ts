import { Icon, IconProviderId } from '@/constants.js'
import { formatSvg, fsp } from '@/lib/fs.js'
import path from 'path'

/**
 * Gets all svg files from a directory and returns an array of icons
 */
async function getIconsFromDir(
  dir: string,
  provider: IconProviderId,
): Promise<Icon[]> {
  const files = await fsp.readdir(dir)
  const svgFiles = files.filter((file) => file.endsWith('.svg'))
  return await Promise.all(
    svgFiles.map(async (file): Promise<Icon> => {
      const name = path.basename(file, '.svg')
      const svgFilePath = path.join(dir, file)
      const svgContent = await fsp.readFile(svgFilePath, 'utf-8')
      const formattedSvg = await formatSvg(svgContent)
      return {
        id: crypto.randomUUID(),
        name,
        pixels: null,
        style: null,
        svg_content: formattedSvg,
        provider,
      }
    }),
  )
}

export { getIconsFromDir }
