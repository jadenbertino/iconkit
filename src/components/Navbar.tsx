import { Package } from 'lucide-react'
import { Container } from './Layout'

export function Navbar() {
  return (
    <nav className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
      <Container>
        <div className='flex items-center gap-2'>
          <Package className='h-6 w-6 sm:h-8 sm:w-8 text-slate-900' />
          <span className='text-xl sm:text-2xl font-bold text-slate-900'>
            IconKit
          </span>
        </div>
      </Container>
    </nav>
  )
}
