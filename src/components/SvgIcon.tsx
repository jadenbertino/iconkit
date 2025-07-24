import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import type { Icon } from '@/lib/schemas/database'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

const SvgIcon = ({ icon, className }: { icon: Icon; className?: string }) => {
  const tags = icon.tags ? JSON.parse(icon.tags) : []
  const firstFiveTags = tags.slice(0, 5)
  
  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain aspect-square',
        centerClasses,
        className,
      )}
      data-tags={JSON.stringify(firstFiveTags)}
      data-search-terms={firstFiveTags.join(' ')}
      aria-label={`${icon.name} icon${firstFiveTags.length > 0 ? ` - ${firstFiveTags.slice(0, 3).join(', ')}` : ''}`}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(icon.svg),
      }}
    />
  )
}

/**
 * WARNING: NOT XSS SAFE
 * Can use it locally for testing that jsx icons are working
 */
const JsxIcon = ({ icon, className }: { icon: Icon; className?: string }) => {
  const tags = icon.tags ? JSON.parse(icon.tags) : []
  const firstFiveTags = tags.slice(0, 5)
  
  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain aspect-square',
        centerClasses,
        className,
      )}
      data-tags={JSON.stringify(firstFiveTags)}
      data-search-terms={firstFiveTags.join(' ')}
      aria-label={`${icon.name} icon${firstFiveTags.length > 0 ? ` - ${firstFiveTags.slice(0, 3).join(', ')}` : ''}`}
    >
      {parse(icon.jsx)}
    </div>
  )
}
export default SvgIcon
export { JsxIcon }
