import { ICON_PROVIDERS } from '@/constants/provider'
import Marquee from 'react-fast-marquee'

const LibraryCarousel = () => {
  const libraryNames = Object.values(ICON_PROVIDERS).map(
    (provider) => provider.name,
  )
  const numVisibleLibraries = libraryNames.length // in case we want to hide libraries
  const visibleLibraries = libraryNames.slice(0, numVisibleLibraries)
  const remainingCount = libraryNames.length - visibleLibraries.length

  return (
    <section className='container mx-auto px-4 mb-16'>
      <Marquee
        speed={30}
        gradient={true}
        autoFill={true}
      >
        {visibleLibraries.map((name, index) => (
          <div
            key={index}
            className='rounded-full border border-input px-4 py-2 text-sm font-medium bg-transparent hover:bg-slate-100 transition-colors mx-2 select-none'
          >
            {name}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className='rounded-full border border-input px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors mx-2 select-none'
          >
            {remainingCount}+ more
          </div>
        )}
      </Marquee>
    </section>
  )
}

export { LibraryCarousel }
