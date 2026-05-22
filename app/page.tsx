// Header removed (moved to layout)
import { HeroBanner } from "@/components/hero-banner"
import { AcademicOffer } from "@/components/academic-offer"
import { Benefits } from "@/components/benefits"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
// Footer removed (moved to layout)

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <AcademicOffer />
      <Benefits />
      <FAQSection />
      <CTASection />
    </main>
  )
}
