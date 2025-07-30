// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
// export { Skeleton }

import { cn } from '@/lib'

/**
 * TODO: Use react-loading-skeleton instead
 */
const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('w-full h-full bg-overlay animate-pulse', className)} />
  )
}

export default Skeleton
