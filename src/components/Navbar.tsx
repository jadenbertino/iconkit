import { Package } from 'lucide-react'
import { Container } from './Layout'

interface NavbarProps {
  as?: 'nav' | 'header'
}

export function Navbar({ as: Element = 'header' }: NavbarProps) {
  return (
    <Element className='border-b border-muted bg-white/80 backdrop-blur-sm sticky top-0 z-10'>
      <Container>
        <div className='flex items-center gap-2'>
          <Package className='h-6 w-6 sm:h-8 sm:w-8 text-neutral-high' />
          <span className='text-subheading font-bold text-neutral-high'>
            IconKit
          </span>
        </div>
      </Container>
    </Element>
  )
}
