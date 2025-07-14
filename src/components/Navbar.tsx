'use client'

import { useState } from 'react'
import BoxIcon, { BoxFillIcon } from './icons/BoxIcon'
import BoxOpen from './icons/BoxOpenIcon'
import MoonIcon from './icons/MoonIcon'
import SunIcon from './icons/SunIcon'
import { Button } from './ui/button'

export function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <nav className='w-full bg-background'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {/* <BoxIcon /> */}
          <BoxFillIcon className='size-8' />
          <h1 className='text-2xl font-semibold text-foreground pointer-events-none select-none pb-1'>
            IconKit
          </h1>
        </div>
        {/* TODO: Add light / dark mode */}
        {/* <Button
          variant='outline'
          size='icon'
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button> */}
      </div>
    </nav>
  )
}
