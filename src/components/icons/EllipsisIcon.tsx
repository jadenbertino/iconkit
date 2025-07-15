import { cn } from '@/lib'

const EllipsisIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    stroke-linejoin='round'
    className={cn('lucide lucide-ellipsis-icon lucide-ellipsis', className)}
  >
    <circle
      cx='12'
      cy='12'
      r='1'
    />
    <circle
      cx='19'
      cy='12'
      r='1'
    />
    <circle
      cx='5'
      cy='12'
      r='1'
    />
  </svg>
)

export { EllipsisIcon }
