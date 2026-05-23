"use client"

import { Award, Users, Lightbulb, Heart, TrendingUp, Shield } from "@/components/ui/icons"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const values = [
  {
    icon: Award,
    title: "Excelencia",
    description: "Nos comprometemos con la más alta calidad en todos nuestros programas académicos.",
    color: "bg-amber-500/10 group-hover:bg-amber-500/20",
    iconColor: "text-amber-600 group-hover:text-amber-700",
  },
  {
    icon: Users,
    title: "Compromiso",
    description: "Dedicados al éxito y desarrollo integral de cada uno de nuestros estudiantes.",
    color: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-600 group-hover:text-blue-700",
  },
  {
    icon: Lightbulb,
    title: "Innovación",
    description: "Incorporamos metodologías y tecnologías educativas de vanguardia.",
    color: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
    iconColor: "text-yellow-600 group-hover:text-yellow-700",
  },
  {
    icon: Heart,
    title: "Integridad",
    description: "Actuamos con ética, transparencia y responsabilidad en todas nuestras acciones.",
    color: "bg-rose-500/10 group-hover:bg-rose-500/20",
    iconColor: "text-rose-600 group-hover:text-rose-700",
  },
  {
    icon: TrendingUp,
    title: "Mejora Continua",
    description: "Buscamos constantemente la evolución y actualización de nuestros contenidos.",
    color: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
  },
  {
    icon: Shield,
    title: "Confianza",
    description: "Construimos relaciones basadas en la credibilidad y el respeto mutuo.",
    color: "bg-violet-500/10 group-hover:bg-violet-500/20",
    iconColor: "text-violet-600 group-hover:text-violet-700",
  },
]

export function AboutValues() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-[1cm] bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Nuestros Valores</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían nuestro quehacer educativo y definen nuestra identidad institucional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="group border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-up cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div
                        className={`p-4 rounded-xl transition-all duration-500 ${value.color} ${hoveredIndex === index ? "scale-110 rotate-6" : "scale-100 rotate-0"}`}
                      >
                        <Icon
                          className={`h-8 w-8 transition-all duration-500 ${value.iconColor} ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2 relative inline-block">
                          {value.title}
                          <span
                            className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500 ${hoveredIndex === index ? "w-full" : "w-0"}`}
                          />
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
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
