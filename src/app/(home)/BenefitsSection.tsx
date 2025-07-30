import { ICON_LIBRARY_COUNT } from '@/constants'
import { CLIENT_ENV } from '@/env/client'
import { Zap } from 'lucide-react'

const BenefitsSection = () => {
  const iconCount = CLIENT_ENV.ICON_COUNT.toLocaleString()
  const libraryCount = ICON_LIBRARY_COUNT.toLocaleString()

  return (
    <section className='container mx-auto px-4 py-16 pt-8'>
      <div className='max-w-3xl mx-auto text-center mb-16'>
        <div className='text-center mx-auto mb-8 sm:mb-12'>
          <h2 className='text-heading text-neutral-high mb-3 sm:mb-4'>
            Your icon workflow, simplified
          </h2>
          <h3 className='text-subheading text-neutral-low mb-6 sm:mb-8'>
            Search all your favorite libraries with one search bar.
          </h3>
          <div className='text-left text-neutral flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4'>
            <p className='text-body'>
              Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons,
              and 8 more libraries.
            </p>
            <p className='font-semibold text-body'>
              One search replaces your entire icon workflow:
            </p>

            <ul className='space-y-2 sm:space-y-3 text-neutral'>
              <li className='flex items-center gap-3'>
                <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0' />
                <span className='text-body'>
                  Search {iconCount}+ icons from {libraryCount}+ libraries
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0' />
                <span className='text-body'>
                  Find the perfect icon in seconds
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0' />
                <span className='text-body'>
                  Copy as SVG or JSX with one click
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export { BenefitsSection }
