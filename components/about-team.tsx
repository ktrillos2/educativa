"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Star, Trophy } from "@/components/ui/icons"
import { useState } from "react"

const teamAspects = [
  {
    icon: Briefcase,
    title: "Experiencia Profesional",
    description:
      "Nuestros docentes son profesionales activos en sus campos, trayendo experiencia práctica del mundo real a cada clase.",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-600 group-hover:text-blue-700",
  },
  {
    icon: Trophy,
    title: "Formación Académica",
    description:
      "Contamos con un equipo altamente calificado con maestrías, doctorados y certificaciones internacionales.",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    iconColor: "text-amber-600 group-hover:text-amber-700",
  },
  {
    icon: Star,
    title: "Enfoque Personalizado",
    description: "Mantenemos grupos reducidos para garantizar atención personalizada y un aprendizaje más efectivo.",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
  },
]

export function AboutTeam() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Nuestro Equipo Docente</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profesionales expertos comprometidos con tu crecimiento académico y profesional.
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
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${aspect.iconBg}`}
                    />

                    <div className="flex flex-col items-center text-center gap-4 relative z-10">
                      <div
                        className={`p-4 rounded-xl transition-all duration-500 ${aspect.iconBg} ${hoveredIndex === index ? "scale-110 -rotate-6" : "scale-100 rotate-0"}`}
                      >
                        <Icon
                          className={`h-10 w-10 transition-all duration-500 ${aspect.iconColor} ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 relative inline-block">
                          {aspect.title}
                          <span
                            className={`absolute -bottom-1 left-0 h-1 bg-secondary rounded-full transition-all duration-500 ${hoveredIndex === index ? "w-full" : "w-0"}`}
                          />
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{aspect.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
