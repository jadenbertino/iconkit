'use client'


export function Navbar() {
  return (
    <nav className='w-full bg-background'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={'/logo.png'}
            alt='IconKit'
            className='size-8'
          />
          <h1 className='text-2xl font-semibold text-foreground pointer-events-none select-none'>
            IconKit
          </h1>
        </div>
      </div>
    </nav>
  )
}
