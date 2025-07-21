'use client'

import { Button } from '@/components/ui/button'
import { CLIENT_ENV } from '@/env/client'
import { useRouter } from 'next/navigation'

const PricingSection = () => {
  const router = useRouter()

  const handleCTAClick = () => {
    router.push('/search')
  }

  return (
    <section className='bg-slate-900 text-white py-20'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>Pricing</h2>
        <p className='text-xl text-slate-300 mb-2'>IconKit is 100% free!</p>
        <p className='text-slate-400 mb-4'>
          No subscriptions, no premium tiers, no gotchas.
        </p>
        <p className='text-slate-400 mb-8 max-w-md mx-auto'>
          We built this because we got tired of paying for icons too.
        </p>

        <Button
          onClick={handleCTAClick}
          size='lg'
          className='bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4 rounded-full font-semibold'
        >
          Search {CLIENT_ENV.ICON_COUNT.toLocaleString()}+ Icons Now
        </Button>
      </div>
    </section>
  )
}

export { PricingSection }
