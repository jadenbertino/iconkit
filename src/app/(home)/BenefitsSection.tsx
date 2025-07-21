import { ICON_LIBRARY_COUNT } from '@/constants'
import { CLIENT_ENV } from '@/env/client'
import { Zap } from 'lucide-react'

const BenefitsSection = () => {
  const iconCount = CLIENT_ENV.ICON_COUNT.toLocaleString()
  const libraryCount = ICON_LIBRARY_COUNT.toLocaleString()

  return (
    <section className='container mx-auto px-4 py-16 pt-8'>
      <div className='max-w-3xl mx-auto text-center mb-16'>
        <div className='text-center mx-auto mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-4'>
            Your icon workflow, simplified
          </h2>
          <h3 className='text-xl text-slate-600 mb-8'>
            Search all your favorite libraries with one search bar.
          </h3>
          <div className='text-left text-slate-700 flex flex-col gap-4 pt-4'>
            <p>
              Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons,
              and 8 more libraries.
            </p>
            <p className='font-semibold'>
              One search replaces your entire icon workflow:
            </p>

            <ul className='space-y-3 text-slate-700'>
              <li className='flex items-center gap-3'>
                <Zap className='h-5 w-5 text-emerald-500 flex-shrink-0' />
                Search {iconCount}+ icons from {libraryCount}+ libraries
              </li>
              <li className='flex items-center gap-3'>
                <Zap className='h-5 w-5 text-emerald-500 flex-shrink-0' />
                Find the perfect icon in seconds
              </li>
              <li className='flex items-center gap-3'>
                <Zap className='h-5 w-5 text-emerald-500 flex-shrink-0' />
                Copy as SVG or JSX with one click
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export { BenefitsSection }
