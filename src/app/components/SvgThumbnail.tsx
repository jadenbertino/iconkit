import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import type { Icon } from '@/lib/schemas/database'

const SvgThumnail = ({
  icon,
  className,
}: {
  icon: Icon
  className?: string
}) => {
  return (
    <div
      className={cn(
        'w-16 h-16 p-2 bg-white rounded-lg shadow-md',
        'text-black [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
        centerClasses,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

export { SvgThumnail }
