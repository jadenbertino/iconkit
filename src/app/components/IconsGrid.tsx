import { useIconQueries } from '@/lib/queries/icons'
import { useSearch } from '../context/SearchContext'
import { SvgThumnail } from './SvgThumbnail'

export function IconsGrid() {
  const { search } = useSearch()
  const { getIconsQuery } = useIconQueries()
  const pageSize = 100
  const skip = (search.page - 1) * pageSize

  const {
    data: icons,
    isLoading,
    error,
  } = getIconsQuery({
    skip,
    limit: pageSize,
    searchText: search.text,
  })

  if (isLoading && !icons) return <div>Loading...</div>
  if (error && !icons) return <div>Error loading icons</div>

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 justify-items-start'>
      {icons?.map((icon) => (
        <a
          href={icon.source_url}
          target='_blank'
          rel='noopener noreferrer'
          key={icon.id}
        >
          <div className='relative'>
            <SvgThumnail
              icon={icon}
              // TODO: implement loading state
              // className={cn(isFetching && 'bg-gray-400 animate-pulse')}
            />
          </div>
        </a>
      ))}
    </div>
  )
}
