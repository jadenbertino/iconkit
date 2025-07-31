import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from './Layout'

interface NavbarProps {
  as?: 'nav' | 'header'
  sticky?: boolean
}

export function Navbar({ as: Element = 'header', sticky = false }: NavbarProps) {
  return (
    <Element className={cn('border-b border-muted bg-surface/80 backdrop-blur-sm', sticky && 'sticky top-0 z-10')}>
      <Container>
        <div className='flex items-center gap-2'>
          <Package className='h-6 w-6 sm:h-8 sm:w-8 text-neutral-high' />
          <span className='text-subheader font-bold text-neutral-high'>
            IconKit
          </span>
        </div>
      </Container>
    </Element>
  )
}
