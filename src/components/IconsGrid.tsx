import { PAGE_SIZE } from '@/constants'
import { cn } from '@/lib'
import { clientLogger } from '@/lib/logs/client'
import { useIconQueries } from '@/lib/queries/icons'
import DEFAULT_ICONS from '@/lib/queries/icons/default'
import type { Icon } from '@/lib/schemas/database'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useSearch } from '../context/SearchContext'
import IconPagination from './IconPagination'
import './Icons.css'
import SvgIcon from './SvgIcon'

export function IconsGrid({
  onIconClick,
}: {
  onIconClick: (icon: Icon) => void
}) {
  const { search } = useSearch()
  const { useIconsQuery } = useIconQueries()
  const skip = (search.page - 1) * PAGE_SIZE

  const {
    data: icons,
    error,
    isFetching,
  } = useIconsQuery({
    skip,
    limit: PAGE_SIZE,
    searchText: search.text,
  })

  useEffect(() => {
    if (error && icons?.length) {
      clientLogger.error('Error loading icons', error)
      toast.error('Error loading icons')
    }
  }, [error, icons])

  const cardClasses =
    'relative w-16 h-16 bg-surface rounded-lg shadow-md overflow-hidden'

  return (
    <>
      <div className='min-h-[544px]'>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-4 justify-items-start'>
          {(icons || DEFAULT_ICONS).map((icon) => (
            <motion.button
              onClick={() => onIconClick(icon)}
              key={icon.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98, y: 1 }}
              transition={{ type: 'spring', stiffness: 800, damping: 30 }}
              disabled={isFetching}
              className='disabled:opacity-50 disabled:pointer-events-none'
            >
              <SvgIcon
                icon={icon}
                className={cn(cardClasses, 'p-2 bg-hover')}
              />
            </motion.button>
          ))}
        </div>
      </div>
      <IconPagination hasMore={icons?.length === PAGE_SIZE} />
    </>
  )
}

/* used to have a skeleton like this but I don't think there's a use case for it anymore
new Array(PAGE_SIZE).fill(null).map((_, index) => (
  <div
    key={index}
    className={cardClasses}
  >
    <Skeleton />
  </div>
))
*/
