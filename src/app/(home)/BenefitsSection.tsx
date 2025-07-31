import { ICON_LIBRARY_COUNT } from '@/constants'
import { CLIENT_ENV } from '@/env/client'
import { Zap } from 'lucide-react'

const iconCount = CLIENT_ENV.ICON_COUNT.toLocaleString()
const libraryCount = ICON_LIBRARY_COUNT.toLocaleString()

const BENEFITS = [
  `Search ${iconCount}+ icons from ${libraryCount}+ libraries`,
  'Find the perfect icon in seconds',
  'Copy as SVG or JSX with one click',
]

const BenefitsSection = () => {
  return (
    <section className='container mx-auto px-4 py-16 pt-8'>
      <div className='max-w-3xl mx-auto text-center mb-16'>
        <div className='text-center mx-auto mb-8 sm:mb-12'>
          <h2 className='text-impact text-neutral-high mb-3 sm:mb-4'>
            Your icon workflow, simplified
          </h2>
          <h3 className='text-subheader text-neutral-low mb-6 sm:mb-8'>
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
              {BENEFITS.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center gap-3'
                >
                  <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0 fill-[var(--bg-success)]' />
                  <span className='text-body'>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export { BenefitsSection }
