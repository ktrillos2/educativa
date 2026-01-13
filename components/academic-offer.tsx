"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock3,
  Users2,
  MoveUpRight,
  Building2,
  Landmark,
  Cpu,
  HeartPulse,
  Banknote,
  CalendarDays,
  BadgeCheck,
  Flame,
  Sparkles,
  ChevronRight,
} from "lucide-react"

const categories = ["Todos", "Gestión", "Legal", "Tecnología", "Salud"]

const categoryIcons: Record<string, React.ElementType> = {
  Gestión: Building2,
  Legal: Landmark,
  Tecnología: Cpu,
  Salud: HeartPulse,
}

const badgeIcons: Record<string, React.ElementType> = {
  Nuevo: Sparkles,
  Popular: Flame,
  Certificado: BadgeCheck,
}

const programs = [
  {
    title: "Diplomado en Gestión Empresarial",
    description: "Desarrolla habilidades directivas y de liderazgo para la gestión efectiva de organizaciones.",
    duration: "120 horas",
    students: "25 cupos",
    badge: "Nuevo",
    category: "Gestión",
    image: "/business-management-corporate-meeting-professional.jpg",
    price: "$1.200.000",
    startDate: "15 Feb 2025",
  },
  {
    title: "Diplomado en Seguridad y Salud en el Trabajo",
    description: "Aprende a implementar sistemas de gestión de SST según la normatividad vigente.",
    duration: "100 horas",
    students: "30 cupos",
    badge: "Popular",
    category: "Salud",
    image: "/workplace-safety-health-professional-training-equi.jpg",
    price: "$980.000",
    startDate: "20 Feb 2025",
  },
  {
    title: "Diplomado en Contratación Estatal",
    description: "Domina los procesos de contratación pública y la normatividad aplicable.",
    duration: "80 horas",
    students: "20 cupos",
    badge: null,
    category: "Legal",
    image: "/government-contract-legal-documents-signing.jpg",
    price: "$850.000",
    startDate: "1 Mar 2025",
  },
  {
    title: "Diplomado en Gestión del Talento Humano",
    description: "Estrategias modernas para la administración y desarrollo del capital humano.",
    duration: "90 horas",
    students: "25 cupos",
    badge: "Certificado",
    category: "Gestión",
    image: "/human-resources-team-management-diverse-workplace.jpg",
    price: "$920.000",
    startDate: "10 Mar 2025",
  },
  {
    title: "Diplomado en Marketing Digital",
    description: "Aprende estrategias digitales para posicionar marcas y generar resultados.",
    duration: "80 horas",
    students: "30 cupos",
    badge: "Nuevo",
    category: "Tecnología",
    image: "/digital-marketing-social-media-analytics-screens.jpg",
    price: "$1.100.000",
    startDate: "15 Mar 2025",
  },
  {
    title: "Diplomado en Finanzas y Presupuesto Público",
    description: "Gestión financiera y presupuestal para entidades del sector público.",
    duration: "100 horas",
    students: "20 cupos",
    badge: null,
    category: "Gestión",
    image: "/finance-budget-accounting-professional-calculator.jpg",
    price: "$950.000",
    startDate: "22 Mar 2025",
  },
]

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export function AcademicOffer() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  const filteredPrograms = activeCategory === "Todos" ? programs : programs.filter((p) => p.category === activeCategory)

  return (
    <section id="oferta" className="py-12 md:py-16 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium mb-3 rounded border border-primary/20">
            <BadgeCheck className="h-3.5 w-3.5" />
            Oferta Académica 2025
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Programas de <span className="text-primary">Formación</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Elige el diplomado que impulsará tu desarrollo profesional.
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-2 mb-8 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded border ${activeCategory === category
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {category}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((program, index) => {
            const CategoryIcon = categoryIcons[program.category] || Building2
            const BadgeIcon = program.badge ? badgeIcons[program.badge] : null
            return (
              <Card
                key={`${program.title}-${activeCategory}`}
                className={`group overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-200 rounded-lg hover:shadow-lg p-0 ${isVisible ? `animate-fade-up stagger-${(index % 6) + 1}` : "opacity-0"
                  }`}
              >
                {/* Image Header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category icon */}
                  <div className="absolute top-3 left-3 p-2 bg-white rounded shadow-sm">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                  </div>

                  {/* Badge */}
                  {program.badge && BadgeIcon && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-white text-xs font-semibold rounded shadow-sm">
                      <BadgeIcon className="h-3 w-3" />
                      {program.badge}
                    </span>
                  )}

                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-white/70 text-xs mb-0.5">Inversión</p>
                      <div className="flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-secondary" />
                        <span className="font-bold text-lg text-white">{program.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/95 px-2 py-1 rounded text-xs">
                      <CalendarDays className="h-3 w-3 text-primary" />
                      <span className="font-medium text-foreground">{program.startDate}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {program.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{program.description}</p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users2 className="h-3.5 w-3.5 text-primary" />
                      <span>{program.students}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm h-9">
                      Inscribirse
                      <MoveUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded border-border hover:border-primary hover:bg-primary/5 bg-transparent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className={`text-center mt-8 ${isVisible ? "animate-fade-up stagger-6" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-3">
            <Button
              variant="outline"
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded text-sm h-10 px-5 bg-transparent"
            >
              Ver Todos los Programas
              <MoveUpRight className="ml-2 h-3.5 w-3.5" />
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded text-sm h-10 px-5">
              Asesoría Gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
