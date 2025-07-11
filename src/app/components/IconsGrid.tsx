import Skeleton from '@/components/ui/skeleton'
import { PAGE_SIZE } from '@/constants'
import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import { useIconQueries } from '@/lib/queries/icons'
import DOMPurify from 'dompurify'
import { useSearch } from '../context/SearchContext'

export function IconsGrid() {
  const { search } = useSearch()
  const { useIconsQuery } = useIconQueries()
  const skip = (search.page - 1) * PAGE_SIZE
  const SkeletonIcons = new Array(100).fill(null)

  const { data: icons, error } = useIconsQuery({
    skip,
    limit: PAGE_SIZE,
    searchText: search.text,
  })
  if (error && !icons) return <div>Error loading icons</div>

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 justify-items-start'>
      {icons
        ? icons.map((icon) => (
            <a
              href={icon.source_url}
              target='_blank'
              rel='noopener noreferrer'
              key={icon.id}
            >
              <Card
                className={cn(
                  'p-2 text-black [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
                  centerClasses,
                )}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(icon.svg),
                }}
              />
            </a>
          ))
        : SkeletonIcons.map((_, index) => (
            <Card key={index}>
              <Skeleton />
            </Card>
          ))}
    </div>
  )
}

const Card = ({
  children,
  className,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode
  className?: string
  dangerouslySetInnerHTML?: { __html: string }
}) => {
  return (
    <div
      className={cn(
        'relative w-16 h-16 bg-white rounded-lg shadow-md overflow-hidden',
        className,
      )}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </div>
  )
}
