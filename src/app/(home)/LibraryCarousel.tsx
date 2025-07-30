'use client'

import { ICON_PROVIDERS } from '@/constants/provider'
import Marquee from 'react-fast-marquee'
import { useWindowSize } from 'usehooks-ts'

const libraryNames = Object.values(ICON_PROVIDERS).map(
  (provider) => provider.name,
)
const numVisibleLibraries = libraryNames.length // in case we want to hide libraries
const visibleLibraries = libraryNames.slice(0, numVisibleLibraries)
const remainingCount = libraryNames.length - visibleLibraries.length

const LibraryCarousel = () => {
  const { width = 0 } = useWindowSize()
  const gradientWidth = width < 768 ? 50 : 200

  return (
    <section className='container mx-auto px-4 mb-16 min-h-[40px]'>
      <Marquee
        speed={30}
        gradient={true}
        gradientWidth={gradientWidth}
        autoFill={true}
      >
        {visibleLibraries.map((name, index) => (
          <div
            key={index}
            className='rounded-full border border-input px-4 py-2 text-small font-medium bg-transparent bg-hover transition-colors mx-2 select-none'
          >
            {name}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className='rounded-full border border-input px-4 py-2 text-small font-medium bg-inverse transition-colors mx-2 select-none'>
            {remainingCount}+ more
          </div>
        )}
      </Marquee>
    </section>
  )
}

export { LibraryCarousel }
