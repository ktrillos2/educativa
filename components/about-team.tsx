"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Star, Trophy } from "@/components/ui/icons"
import { ShieldCheck } from "lucide-react"
import { useState } from "react"

const teamAspects = [
  {
    icon: Briefcase,
    title: "Idoneidad y experiencia",
    description:
      "Nuestros formadores cuentan con formación académica y experiencia profesional relacionada con las áreas de conocimiento de cada programa, de acuerdo con los perfiles establecidos institucionalmente.",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-600 group-hover:text-blue-700",
  },
  {
    icon: Trophy,
    title: "Pertinencia académica",
    description:
      "La asignación de formadores se realiza teniendo en cuenta la correspondencia entre su perfil profesional, experiencia y los contenidos, resultados de aprendizaje y características específicas de cada programa académico.",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    iconColor: "text-amber-600 group-hover:text-amber-700",
  },
  {
    icon: Star,
    title: "Selección y verificación de perfiles",
    description: "La Academia verifica la formación académica, experiencia y soportes de los formadores antes de su vinculación, conforme a los criterios definidos en el Proyecto Educativo Institucional —PEI— y en sus procedimientos académicos.",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
  },
]

export function AboutTeam() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-[1cm] bg-background overflow-hidden">
      <div className="container mx-auto px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Nuestro Equipo de Formadores</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Profesionales seleccionados por su formación, experiencia e idoneidad para acompañar procesos educativos pertinentes y de calidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamAspects.map((aspect, index) => {
              const Icon = aspect.icon
              return (
                <Card
                  key={index}
                  className="group border-border hover:border-secondary hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 animate-fade-up cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardContent className="p-6 relative">
                    <div
                      className={`absolute -right-6 -top-6 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${aspect.iconBg}`}
                    />

                    <div className="flex flex-col items-center text-center gap-3 relative z-10">
                      <div
                        className={`p-3 transition-all duration-500 ${aspect.iconBg} ${hoveredIndex === index ? "scale-110 -rotate-6" : "scale-100 rotate-0"}`}
                      >
                        <Icon
                          className={`h-7 w-7 transition-all duration-500 ${aspect.iconColor} ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3 relative inline-block">
                          {aspect.title}
                          <span
                            className={`absolute -bottom-1 left-0 h-1 bg-secondary transition-all duration-500 ${hoveredIndex === index ? "w-full" : "w-0"}`}
                          />
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{aspect.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="mt-12 max-w-4xl mx-auto border-border overflow-hidden">
            <CardContent className="p-6 md:p-8 relative">
              {/* Adorno de la esquina igual al de las tarjetas */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10" />

              <div className="flex flex-col items-center text-center gap-4 relative z-10">
                {/* Icono centrado idéntico a las tarjetas */}
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                
                {/* Título y barra como en las tarjetas */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 relative inline-block">
                    Respaldo Institucional
                    <span className="absolute -bottom-1.5 left-0 h-1 bg-secondary w-full" />
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    La Academia de Formación Líderes del Mérito S.A.S. asegura la idoneidad de sus formadores mediante criterios de selección, verificación y asignación basados en la formación académica, la experiencia profesional y la pertinencia del perfil frente a cada programa. Los formadores deberán cumplir los requisitos establecidos en el Proyecto Educativo Institucional PEI y en los documentos académicos de la institución.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
