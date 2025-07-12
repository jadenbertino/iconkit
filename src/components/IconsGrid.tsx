import Skeleton from '@/components/ui/skeleton'
import { PAGE_SIZE } from '@/constants'
import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import { useIconQueries } from '@/lib/queries/icons'
import DOMPurify from 'dompurify'
import { useSearch } from '../context/SearchContext'
import IconPagination from './IconPagination'

export function IconsGrid() {
  const { search } = useSearch()
  const { useIconsQuery } = useIconQueries()
  const skip = (search.page - 1) * PAGE_SIZE

  const { data: icons, error } = useIconsQuery({
    skip,
    limit: PAGE_SIZE,
    searchText: search.text,
  })

  if (error && !icons) return <div>Error loading icons</div>

  const cardClasses =
    'relative w-16 h-16 bg-white rounded-lg shadow-md overflow-hidden'
  return (
    <>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-4 justify-items-start min-h-[544px]'>
        {icons
          ? icons.map((icon) => (
              <a
                href={icon.source_url}
                target='_blank'
                rel='noopener noreferrer'
                key={icon.id}
              >
                <div
                  className={cn(
                    cardClasses,
                    'p-2 text-black [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
                    centerClasses,
                  )}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(icon.svg),
                  }}
                />
              </a>
            ))
          : new Array(PAGE_SIZE).fill(null).map((_, index) => (
              <div
                key={index}
                className={cardClasses}
              >
                <Skeleton />
              </div>
            ))}
      </div>
      <IconPagination hasMore={icons?.length === PAGE_SIZE} />
    </>
  )
}
