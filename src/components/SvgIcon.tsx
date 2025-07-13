import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import type { Icon } from '@/lib/schemas/database'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

const SvgIcon = ({ icon, className }: { icon: Icon; className?: string }) => {
  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
        centerClasses,
        className,
      )}
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
  return (
    <div
      className={cn(
        '[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
        centerClasses,
        className,
      )}
    >
      {parse(icon.jsx)}
    </div>
  )
}
export default SvgIcon
export { JsxIcon }
