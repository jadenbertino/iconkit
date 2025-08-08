import { PAGE_SIZE } from '@/constants'
import { CLIENT_ENV } from '@/env/client'
import { cn } from '@/lib'
import { clientLogger } from '@/lib/logs/client'
import { useIconQueries } from '@/lib/queries/icons'
import DEFAULT_ICONS from '@/lib/queries/icons/default'
import type { Icon } from '@/lib/schemas/database'
import * as Sentry from '@sentry/nextjs'
import { motion } from 'motion/react'
import { usePostHog } from 'posthog-js/react'
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
  const posthog = usePostHog()

  const {
    data: icons = DEFAULT_ICONS,
    error,
    isFetching,
  } = useIconsQuery({
    skip,
    limit: PAGE_SIZE,
    searchText: search.text,
  })

  useEffect(() => {
    if (error) {
      clientLogger.error('Error loading icons', error)
      toast.error('Error loading icons')
      Sentry.captureException(error)
      return
    }

    if (isFetching || !search.text.trim().length) return
    const meta = {
      search_query: search.text.trim(),
      search_terms: search.text.split(' '),
    }
    clientLogger.debug('Fetched icons', meta)
    posthog.capture('search_icons', {
      ...meta,
      version: CLIENT_ENV.VERSION,
      environment: CLIENT_ENV.ENVIRONMENT,
    })
  }, [error, isFetching, search.text])

  const cardClasses =
    'relative w-16 h-16 bg-surface rounded-lg shadow-md overflow-hidden'

  return (
    <>
      <div className='min-h-[544px] relative'>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-4 justify-items-start'>
          {icons.length > 0 ? (
            icons.map((icon) => (
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
            ))
          ) : (
            <div className='absolute inset-0 flex justify-center top-4'>
              <p className='text-small text-neutral-low text-center'>
                No icons found for
                <br />
                <span className='font-semibold pt-1'>
                  &ldquo;{search.text.trim()}&rdquo;
                </span>
              </p>
            </div>
          )}
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
