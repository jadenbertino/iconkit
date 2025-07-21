'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const PricingSection = () => {
  const router = useRouter()

  const handleCTAClick = () => {
    router.push('/search')
  }

  return (
    <div className='py-16 text-center space-y-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold text-foreground'>Pricing</h2>
        <h3 className='text-2xl font-semibold text-foreground'>
          Just kidding!
        </h3>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        <p className='text-lg text-foreground'>
          IconKit is 100% free—no subscriptions, no premium tiers, no catch. We
          built this because we got tired of paying for icons too.
        </p>

        <Button
          onClick={handleCTAClick}
          size='lg'
          className='text-lg px-8 py-4'
        >
          Search 40,000+ Icons Now
        </Button>
      </div>
    </div>
  )
}

export { PricingSection }
