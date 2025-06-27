import { useIconQueries } from '@/lib/queries/icons'
import { useSearch } from '../context/SearchContext'
import { SvgThumnail } from './SvgThumbnail'

export function IconsGrid() {
  const { search } = useSearch()
  const { getIconsQuery } = useIconQueries()
  const {
    data: icons,
    isLoading,
    error,
  } = getIconsQuery({
    skip: 0,
    limit: 100,
    searchText: search.text,
  })

  if (isLoading && !icons) return <div>Loading...</div>
  if (error && !icons) return <div>Error loading icons</div>

  return (
    <div className='flex flex-wrap gap-2'>
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
