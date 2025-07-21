import Footer from '@/components/Footer'
import { Package } from 'lucide-react'
import { BenefitsSection } from './BenefitsSection'
import { HeroSection } from './HeroSection'
import { LibraryCarousel } from './LibraryCarousel'
import { PricingSection } from './PricingSection'
import { ThreeCardSection } from './ThreeCardSection'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-2'>
            <Package className='h-8 w-8 text-slate-900' />
            <span className='text-2xl font-bold text-slate-900'>IconKit</span>
          </div>
        </div>
      </header>

      <div className='space-y-0'>
        <HeroSection />
        <LibraryCarousel />
        <ThreeCardSection />
        <BenefitsSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  )
}
