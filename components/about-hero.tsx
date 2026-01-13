import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative bg-primary pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/professional-education-classroom-students-learning.jpg"
          alt="Academia background"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up text-balance">
            Quiénes Somos
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed animate-fade-up stagger-1 text-pretty">
            Academia de Formación Líderes del Mérito S.A.S. es una institución educativa comprometida con la excelencia
            académica y el desarrollo integral de profesionales que buscan destacar en sus campos de acción.
          </p>
        </div>
      </div>
    </section>
  )
}
