import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import type { Icon } from '@/lib/schemas/database'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

const SvgIcon = ({ icon, className }: { icon: Icon; className?: string }) => {
  const firstFiveTags = icon.tags?.slice(0, 5) || []

  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain aspect-square text-neutral-high',
        centerClasses,
        className,
      )}
      data-tags={JSON.stringify(firstFiveTags)}
      data-search-terms={firstFiveTags.join(' ')}
      aria-label={`${icon.name} icon${firstFiveTags.length > 0 ? ` - ${firstFiveTags.slice(0, 3).join(', ')}` : ''}`}
      dangerouslySetInnerHTML={{
        __html: preprocessSvg(icon.svg),
      }}
    />
  )
}

/**
 * WARNING: NOT XSS SAFE
 * Can use it locally for testing that jsx icons are working
 */
const JsxIcon = ({ icon, className }: { icon: Icon; className?: string }) => {
  const firstFiveTags = icon.tags?.slice(0, 5) || []

  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain aspect-square text-neutral-low',
        centerClasses,
        className,
      )}
      data-tags={JSON.stringify(firstFiveTags)}
      data-search-terms={firstFiveTags.join(' ')}
      aria-label={`${icon.name} icon${firstFiveTags.length > 0 ? ` - ${firstFiveTags.slice(0, 3).join(', ')}` : ''}`}
    >
      {parse(preprocessSvg(icon.jsx))}
    </div>
  )
}

const preprocessSvg = (svgString: string): string => {
  let processedSvg = svgString

  // Add fill="currentColor" to the svg tag if it doesn't exist
  // shouldn't add to all because some have fill="none"
  if (!/fill\s*=/.test(svgString)) {
    processedSvg = svgString.replace(
      /<svg([^>]*)>/,
      '<svg$1 fill="currentColor">',
    )
  }

  return DOMPurify.sanitize(processedSvg)
}

// Old DOM-based implementation (more robust but heavier):
// const preprocessSvg = (svgString: string): string => {
//   // Parse the SVG string to check for existing fill attribute
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(svgString, 'image/svg+xml')
//   const svg = doc.querySelector('svg')
//
//   if (!svg) return svgString
//
//   // Check if fill attribute already exists
//   const hasFill = svg.hasAttribute('fill')
//
//   // If fill already exists, return as-is
//   if (hasFill) return svgString
//
//   // Clone the SVG element to modify it
//   const modifiedSvg = svg.cloneNode(true) as SVGElement
//
//   // Add fill="currentColor" if not present
//   modifiedSvg.setAttribute('fill', 'currentColor')
//
//   return modifiedSvg.outerHTML
// }

export default SvgIcon
export { JsxIcon }
