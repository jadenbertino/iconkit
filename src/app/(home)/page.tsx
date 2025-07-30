import Footer from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { BenefitsSection } from './BenefitsSection'
import { HeroSection } from './HeroSection'
import { LibraryCarousel } from './LibraryCarousel'
import { PricingSection } from './PricingSection'
import { ThreeCardSection } from './ThreeCardSection'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-canvas'>
      <Navbar />
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
