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
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                La Academia de Formación Líderes del Mérito S.A.S. tiene como misión ofrecer programas de formación académica y actividades de actualización orientados al fortalecimiento de conocimientos y habilidades en gestión pública, dirigidos a personas interesadas en participar en procesos de selección por mérito para empleos públicos de carrera administrativa y a servidores públicos que requieran actualización, inducción, reinducción y fortalecimiento de capacidades para el ejercicio de sus funciones.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Desarrollamos procesos formativos de carácter práctico mediante estrategias sincrónicas y asincrónicas, análisis de casos hipotéticos, simulaciones y situaciones contextualizadas en el funcionamiento de las entidades públicas y en el ejercicio de la función pública, promoviendo el aprendizaje significativo, la autogestión, la participación responsable y la aplicación de los conocimientos en contextos institucionales y comunitarios.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestra Visión</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Para el año 2030, la Academia de Formación Líderes del Mérito S.A.S. será reconocida a nivel nacional como una institución de Educación para el Trabajo y el Desarrollo Humano referente en formación académica, actualización y educación continua, mediante una oferta pertinente y de calidad orientada a la gestión pública, la preparación para procesos de selección por mérito y la actualización, inducción y reinducción de servidores públicos.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                La Academia se proyecta como una institución destacada por la incorporación de metodologías pedagógicas aplicadas, tecnologías digitales y modalidades de formación sincrónica y asincrónica, mediante programas y actividades formativas que favorezcan el aprendizaje autónomo, el análisis de situaciones propias de las entidades públicas y el desarrollo de conocimientos y habilidades para el ejercicio responsable, eficiente, transparente y orientado al ciudadano de la función pública.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Asimismo, buscará consolidar una oferta académica accesible y pertinente para personas de diferentes regiones del país, contribuyendo a la cultura del mérito, la ética en el servicio público, la actualización permanente del talento humano y el fortalecimiento institucional, mediante procesos educativos vinculados con las necesidades reales de la administración pública colombiana.
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
