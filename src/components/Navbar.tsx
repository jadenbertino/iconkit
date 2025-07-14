'use client'


export function Navbar() {
  return (
    <nav className='w-full bg-background'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img
            src={'/logo.png'}
            alt='IconKit'
            className='size-8'
          />
          <h1 className='text-2xl font-semibold text-foreground pointer-events-none select-none pb-1'>
            IconKit
          </h1>
        </div>
      </div>
    </nav>
  )
}
