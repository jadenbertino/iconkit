import Skeleton from '@/components/ui/skeleton'
import { PAGE_SIZE } from '@/constants'
import { cn } from '@/lib'
import { useIconQueries } from '@/lib/queries/icons'
import type { Icon } from '@/lib/schemas/database'
import { motion } from 'motion/react'
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
      <div className='min-h-[544px]'>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-4 justify-items-start'>
          {icons
            ? icons.map((icon) => (
                <motion.button
                  onClick={() => onIconClick(icon)}
                  key={icon.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  transition={{ type: 'spring', stiffness: 800, damping: 30 }}
                >
                  <SvgIcon
                    icon={icon}
                    className={cn(cardClasses, 'p-2 icon-gradient')}
                  />
                </motion.button>
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
      </div>
      <IconPagination hasMore={icons?.length === PAGE_SIZE} />
    </>
  )
}
