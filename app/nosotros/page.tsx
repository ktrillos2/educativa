import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutValues } from "@/components/about-values"
import { AboutTeam } from "@/components/about-team"
import { AboutStats } from "@/components/about-stats"
import { CTASection } from "@/components/cta-section"

export const metadata = {
  title: "Nosotros - Academia de Formación Líderes del Mérito",
  description:
    "Conoce nuestra historia, misión, visión y valores. Somos una institución comprometida con la excelencia académica y el desarrollo profesional.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStats />
      <AboutTeam />
      <CTASection />
    </main>
  )
}
