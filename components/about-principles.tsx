"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"

const principles = [
  {
    title: "Formación integral",
    desc: "La Academia concibe al estudiante como una persona que desarrolla conocimientos y habilidades junto con capacidades éticas, sociales y ciudadanas. Los procesos formativos procurarán relacionar el saber con su aplicación responsable en contextos institucionales, laborales y comunitarios."
  },
  {
    title: "Aprendizaje permanente y actualización",
    desc: "La formación se entiende como un proceso continuo a lo largo de la vida. La Academia promoverá la adquisición, actualización y profundización de conocimientos, especialmente en áreas relacionadas con la gestión pública, atendiendo los cambios normativos, institucionales, tecnológicos y administrativos que inciden en el ejercicio de la función pública. Este enfoque corresponde a la finalidad de la ETDH de complementar y actualizar conocimientos."
  },
  {
    title: "Pertinencia de la formación",
    desc: "Los programas y actividades académicas responderán a necesidades reales de los estudiantes, servidores públicos, entidades y contextos institucionales en los que puedan aplicarse los conocimientos adquiridos. Los contenidos serán revisados periódicamente para conservar su correspondencia con el entorno y con los propósitos de cada programa."
  },
  {
    title: "Aprendizaje significativo y aplicado",
    desc: "La Academia privilegiará metodologías que relacionen los contenidos académicos con situaciones concretas. Se utilizarán análisis de casos, problemas, simulaciones, ejercicios de aplicación y casos hipotéticos inspirados en situaciones propias de las entidades públicas y del ejercicio de la función pública."
  },
  {
    title: "Autonomía y autogestión del aprendizaje",
    desc: "El estudiante tendrá un papel activo en su proceso formativo. Las estrategias sincrónicas y asincrónicas favorecerán la organización del tiempo, la responsabilidad, la búsqueda de información, el pensamiento crítico y la capacidad de gestionar el propio aprendizaje. La autogestión hace parte expresamente de los propósitos previstos para los programas de formación académica ETDH."
  },
  {
    title: "Flexibilidad educativa",
    desc: "Los procesos académicos serán organizados mediante estrategias que permitan responder a las características y necesidades de los estudiantes, aprovechando recursos tecnológicos y diferentes formas de interacción pedagógica, sin menoscabar los resultados de aprendizaje ni los criterios institucionales de calidad. La flexibilidad curricular forma parte de la concepción normativa de la ETDH."
  },
  {
    title: "Calidad y mejoramiento continuo",
    desc: "La Academia desarrollará procesos permanentes de planeación, seguimiento, autoevaluación y mejora de sus programas, contenidos, metodologías, recursos educativos, desempeño docente, atención al estudiante y gestión administrativa. Las decisiones de mejora estarán sustentadas en evidencias, resultados de evaluación y necesidades identificadas."
  },
  {
    title: "Mérito e igualdad de oportunidades",
    desc: "La Academia reconoce el mérito como principio asociado al esfuerzo, la preparación, el desarrollo de capacidades y la evaluación objetiva. En sus procesos educativos promoverá condiciones de igualdad, trato imparcial y acceso a oportunidades formativas, sin ofrecer ni garantizar resultados particulares en procesos de selección o concursos de carrera administrativa."
  },
  {
    title: "Ética e integridad",
    desc: "La formación promoverá comportamientos coherentes con la honestidad, la responsabilidad, el respeto por las normas, la prevalencia del interés general y el manejo adecuado de los recursos e información. En los programas relacionados con gestión pública, estos criterios serán incorporados transversalmente en los contenidos y casos analizados."
  },
  {
    title: "Legalidad y respeto por lo público",
    desc: "Los procesos formativos promoverán el conocimiento y respeto del ordenamiento jurídico, las instituciones democráticas y los deberes asociados al ejercicio de funciones públicas. La Academia fomentará el análisis de la gestión pública desde el cumplimiento normativo, el debido proceso y la responsabilidad institucional."
  },
  {
    title: "Participación democrática y ciudadanía",
    desc: "La Academia promoverá la participación responsable, el respeto por las diferencias, el diálogo argumentado y la comprensión del papel de los ciudadanos y servidores públicos dentro de las instituciones democráticas. La participación y la formación democrática forman parte de los propósitos atribuidos normativamente a los programas de formación académica ETDH."
  },
  {
    title: "Inclusión, equidad y respeto por la diversidad",
    desc: "La Academia brindará un trato digno y respetuoso, sin discriminación, reconociendo las diferencias sociales, culturales, territoriales y personales de sus estudiantes. Sus procesos educativos procurarán eliminar barreras injustificadas de participación y promover condiciones equitativas de aprendizaje."
  },
  {
    title: "Innovación pedagógica y uso responsable de la tecnología",
    desc: "La Academia incorporará tecnologías digitales cuando aporten al aprendizaje, la interacción, la evaluación y el acceso a los contenidos. Su utilización estará subordinada a objetivos pedagógicos definidos y al uso ético, seguro y responsable de la información."
  },
  {
    title: "Transparencia académica",
    desc: "Los estudiantes recibirán información clara sobre las características del programa, duración, metodología, requisitos, sistema de evaluación, certificación, costos y demás condiciones académicas aplicables. La Academia evitará publicidad o información que pueda inducir a error sobre la naturaleza de los programas, los certificados otorgados o los resultados de procesos de selección laboral."
  },
  {
    title: "Evaluación objetiva y formativa",
    desc: "La evaluación estará vinculada con los resultados de aprendizaje y criterios previamente definidos. Las actividades evaluativas buscarán determinar la comprensión y aplicación de los conocimientos mediante evidencias verificables y, cuando corresponda, mediante situaciones hipotéticas relacionadas con entidades públicas, servidores públicos y problemas propios de la gestión institucional."
  }
]

export function AboutPrinciples() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-[1cm] bg-muted/10 overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4 relative">
        {/* Adornos sutiles de color */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-4 h-4" />
                Nuestro ADN
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Principios Institucionales</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              La Academia de Formación Líderes del Mérito S.A.S. orienta su actividad educativa, administrativa y de relacionamiento con la comunidad a partir de los siguientes principios:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4 items-start">
            {principles.map((principle, index) => {
              const isOpen = openIndex === index
              const isLastAndOdd = index === principles.length - 1 && principles.length % 2 !== 0

              return (
                <div 
                  key={index} 
                  className={`rounded-xl overflow-hidden border bg-white ${
                    isOpen 
                        ? 'border-primary/50 shadow-md shadow-primary/10 scale-[1.01] transition-transform duration-300' 
                        : 'border-primary/30'
                  } ${isLastAndOdd ? 'md:col-span-2 md:w-[calc(50%-8px)] md:mx-auto w-full' : ''}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-4 py-3 md:px-5 md:py-4 flex items-center justify-between text-left focus:outline-none bg-primary/5 border-b border-primary/10"
                  >
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 bg-primary text-primary-foreground shadow-sm">
                            {index + 1}
                        </span>
                        <span className="font-bold text-sm text-primary">
                        {principle.title}
                        </span>
                    </div>
                    
                    <div className="p-1.5 rounded-full shrink-0 bg-primary/10">
                        <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-3 ml-10 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-primary/20 bg-white">
                          {principle.desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
