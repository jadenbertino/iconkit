'use client'

import { Icon } from '@/constants'
import { ReactNode, useEffect, useState } from 'react'
import { getIcons } from './api/icons/client'

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([])

  useEffect(() => {
    getIcons().then(setIcons)
  }, [])

  return (
    <Container>
      <div className='flex flex-wrap gap-2'>
        {icons.map((icon) => (
          <SvgIcon
            key={icon.name}
            icon={icon}
          />
        ))}
      </div>
    </Container>
  )
}

const SvgIcon = ({ icon }: { icon: Icon }) => {
  const innerSvg = icon.innerSvgContent

  return (
    <div className='w-20 h-20 p-2 bg-white rounded-lg shadow-md'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        preserveAspectRatio='xMidYMid meet'
        fill='currentColor'
        className='text-black hover:text-blue-500 transition-colors duration-300 cursor-pointer w-full h-full'
        dangerouslySetInnerHTML={{ __html: innerSvg }}
      />
    </div>
  )
}

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='max-w-[1200px]'>{children}</div>
    </div>
  )
}
