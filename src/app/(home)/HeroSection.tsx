import { SearchBox } from '@/components/SearchBox'
import { Badge } from '@/components/ui/badge'
import { ICON_LIBRARY_COUNT } from '@/constants/provider'
import { CLIENT_ENV } from '@/env/client'

const HeroSection = () => {
  return (
    <section className='container mx-auto px-4 pt-24 pb-16 text-center'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 mb-6 sm:mb-8'>
          Your favorite icons,
          <br />
          all in one place.
        </h1>

        <div className='max-w-2xl mx-auto mb-8'>
          <div className='flex flex-wrap justify-center gap-4'>
            <Badge
              variant='outline'
              className='text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100'
            >
              {CLIENT_ENV.ICON_COUNT.toLocaleString()}+ icons
            </Badge>
            <Badge
              variant='outline'
              className='text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100'
            >
              {ICON_LIBRARY_COUNT}+ libraries
            </Badge>
            <Badge
              variant='outline'
              className='text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100'
            >
              1 search bar
            </Badge>
          </div>
        </div>

        <SearchBox />

        <p className='text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed'>
          Find any icon from Font Awesome, Lucide, Hero Icons, and{' '}
          {ICON_LIBRARY_COUNT - 3} more of your favorite libraries.
        </p>
      </div>
    </section>
  )
}

export { HeroSection }
