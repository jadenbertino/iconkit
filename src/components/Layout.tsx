import { cn } from '@/lib'
import type { ReactNode } from 'react'

type Wrapper = {
  children?: ReactNode
  className?: string
}

const Container = ({ children, className }: Wrapper) => {
  return (
    <div
      className={cn(
        'max-w-[1200px] w-full flex flex-col m-auto px-4 py-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

const Row = ({ children, className }: Wrapper) => {
  return (
    <div className={cn('pt-4 flex flex-col gap-2', className)}>{children}</div>
  )
}

export { Container, Row }
