import { BenefitsSection } from './BenefitsSection'
import { HeroSection } from './HeroSection'
import { LibraryCarousel } from './LibraryCarousel'
import { PricingSection } from './PricingSection'
import { ThreeCardSection } from './ThreeCardSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LibraryCarousel />
      <ThreeCardSection />
      <BenefitsSection />
      <PricingSection />
    </>
  )
}
