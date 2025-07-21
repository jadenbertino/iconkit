import { Container } from '@/components/Layout'
import { Navbar } from '@/components/Navbar'
import { BenefitsSection } from './BenefitsSection'
import { HeroSection } from './HeroSection'
import { LibraryCarousel } from './LibraryCarousel'
import { PricingSection } from './PricingSection'
import { ThreeCardSection } from './ThreeCardSection'

export default function HomePage() {
  return (
    <Container>
      <Navbar />
      <div className='space-y-0'>
        <HeroSection />
        <LibraryCarousel />
        <BenefitsSection />
        <ThreeCardSection />
        <PricingSection />
      </div>
    </Container>
  )
}
