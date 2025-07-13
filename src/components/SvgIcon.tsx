import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import type { Icon } from '@/lib/schemas/database'
import DOMPurify from 'dompurify'

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

export default SvgIcon
