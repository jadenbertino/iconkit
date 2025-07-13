'use client'

import { useState } from 'react'
import BoxIcon from './icons/BoxIcon'
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
          <BoxIcon />
          <h1 className='text-xl font-semibold text-foreground'>IconKit</h1>
        </div>
        <Button
          variant='outline'
          size='icon'
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </nav>
  )
}
