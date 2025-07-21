import { CLIENT_ENV } from '@/env/client'

const BenefitsSection = () => {
  return (
    <div className='py-16 space-y-8'>
      <h2 className='text-3xl font-bold text-center text-foreground'>
        Your favorite icons, all in one place.
      </h2>

      <div className='max-w-4xl mx-auto space-y-6'>
        <p className='text-lg text-foreground'>
          IconKit searches every major open-source library at once, so you find
          what you need in seconds. No more bookmarking 6 different icon sites
          or settling for &ldquo;close enough&rdquo; icons.
        </p>

        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-foreground'>
            One search replaces your entire icon workflow:
          </h3>
          <ul className='space-y-2 pl-4'>
            <li className='text-lg text-foreground'>
              • Find the perfect icon instantly
            </li>
            <li className='text-lg text-foreground'>
              • Browse {CLIENT_ENV.ICON_COUNT.toLocaleString()}+ icons from top libraries
            </li>
            <li className='text-lg text-foreground'>
              • Copy as SVG or JSX with one click
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { BenefitsSection }
