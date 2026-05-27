import Image from "next/image"

export function AboutMission() {
  return (
    <section className="py-[1cm] bg-background overflow-hidden">
      <div className="container mx-auto px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="relative h-96  overflow-hidden shadow-lg">
                <Image
                  src="/professional-teacher-instructor-training.jpg"
                  alt="Misión académica"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestra Misión</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Proporcionar formación profesional de alta calidad mediante diplomados, cursos y certificaciones que
                permitan a nuestros estudiantes desarrollar competencias sólidas y actualizadas. Nos comprometemos a
                formar líderes íntegros y competentes que contribuyan al progreso de sus organizaciones y de la
                sociedad.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestra Visión</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ser reconocidos como la academia líder en formación profesional especializada, distinguiéndonos por la
                calidad de nuestros programas, la excelencia de nuestros docentes y el impacto positivo de nuestros
                egresados en el ámbito profesional y empresarial de Colombia.
              </p>
            </div>
            <div>
              <div className="relative h-96  overflow-hidden shadow-lg">
                <Image
                  src="/graduation-ceremony-academic-success.jpg"
                  alt="Visión académica"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
