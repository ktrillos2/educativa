"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Users,
  ArrowRight,
  Building2,
  Landmark,
  Cpu,
  HeartPulse,
  Banknote,
  CalendarDays,
  BadgeCheck,
  Flame,
  Sparkles,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"

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

const diplomados = [
  {
    id: 1,
    title: "Diplomado en Gestión Empresarial",
    description:
      "Desarrolla habilidades directivas y de liderazgo para la gestión efectiva de organizaciones modernas.",
    duration: "120 horas",
    students: "25 cupos",
    badge: "Nuevo",
    category: "Gestión",
    image: "/business-management-corporate-meeting-professional.jpg",
    price: "$1.200.000",
    startDate: "15 Feb 2025",
    modules: 8,
  },
  {
    id: 2,
    title: "Diplomado en Seguridad y Salud en el Trabajo",
    description: "Aprende a implementar sistemas de gestión de SST según la normatividad vigente colombiana.",
    duration: "100 horas",
    students: "30 cupos",
    badge: "Popular",
    category: "Salud",
    image: "/workplace-safety-health-professional-training-equi.jpg",
    price: "$980.000",
    startDate: "20 Feb 2025",
    modules: 6,
  },
  {
    id: 3,
    title: "Diplomado en Contratación Estatal",
    description: "Domina los procesos de contratación pública y la normatividad aplicable en Colombia.",
    duration: "80 horas",
    students: "20 cupos",
    badge: null,
    category: "Legal",
    image: "/government-contract-legal-documents-signing.jpg",
    price: "$850.000",
    startDate: "1 Mar 2025",
    modules: 5,
  },
  {
    id: 4,
    title: "Diplomado en Gestión del Talento Humano",
    description: "Estrategias modernas para la administración y desarrollo del capital humano organizacional.",
    duration: "90 horas",
    students: "25 cupos",
    badge: "Certificado",
    category: "Gestión",
    image: "/human-resources-team-management-diverse-workplace.jpg",
    price: "$920.000",
    startDate: "10 Mar 2025",
    modules: 6,
  },
  {
    id: 5,
    title: "Diplomado en Marketing Digital",
    description: "Aprende estrategias digitales para posicionar marcas y generar resultados medibles.",
    duration: "80 horas",
    students: "30 cupos",
    badge: "Nuevo",
    category: "Tecnología",
    image: "/digital-marketing-social-media-analytics-screens.jpg",
    price: "$1.100.000",
    startDate: "15 Mar 2025",
    modules: 7,
  },
  {
    id: 6,
    title: "Diplomado en Finanzas y Presupuesto Público",
    description: "Gestión financiera y presupuestal para entidades del sector público colombiano.",
    duration: "100 horas",
    students: "20 cupos",
    badge: null,
    category: "Gestión",
    image: "/finance-budget-accounting-professional-calculator.jpg",
    price: "$950.000",
    startDate: "22 Mar 2025",
    modules: 6,
  },
  {
    id: 7,
    title: "Diplomado en Derecho Laboral",
    description: "Normatividad laboral colombiana, contratos de trabajo y relaciones laborales.",
    duration: "90 horas",
    students: "25 cupos",
    badge: "Popular",
    category: "Legal",
    image: "/labor-law-legal-documents-office.jpg",
    price: "$880.000",
    startDate: "5 Abr 2025",
    modules: 6,
  },
  {
    id: 8,
    title: "Diplomado en Transformación Digital",
    description: "Lidera procesos de transformación digital en organizaciones de cualquier sector.",
    duration: "100 horas",
    students: "20 cupos",
    badge: "Nuevo",
    category: "Tecnología",
    image: "/digital-transformation-technology-innovation.jpg",
    price: "$1.300.000",
    startDate: "12 Abr 2025",
    modules: 8,
  },
]

export function DiplomadosList() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDiplomados = diplomados.filter((d) => {
    const matchesCategory = activeCategory === "Todos" || d.category === activeCategory
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar diplomados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:block" />
            {categories.map((category) => {
              const Icon = categoryIcons[category]
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded border ${activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Mostrando <span className="font-semibold text-foreground">{filteredDiplomados.length}</span> diplomados
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDiplomados.map((diplomado) => {
            const CategoryIcon = categoryIcons[diplomado.category] || Building2
            const BadgeIcon = diplomado.badge ? badgeIcons[diplomado.badge] : null
            return (
              <Card
                key={diplomado.id}
                className="group overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-200 rounded-lg hover:shadow-lg p-0"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={diplomado.image || "/placeholder.svg"}
                    alt={diplomado.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 p-2 bg-white rounded shadow-sm">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                  </div>

                  {diplomado.badge && BadgeIcon && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-white text-xs font-semibold rounded shadow-sm">
                      <BadgeIcon className="h-3 w-3" />
                      {diplomado.badge}
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-secondary" />
                        <span className="font-bold text-lg text-white">{diplomado.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/95 px-2 py-1 rounded text-xs">
                      <CalendarDays className="h-3 w-3 text-primary" />
                      <span className="font-medium text-foreground">{diplomado.startDate}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {diplomado.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{diplomado.description}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{diplomado.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{diplomado.students}</span>
                    </div>
                  </div>

                  <Link href={`/diplomados/${diplomado.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm h-9">
                      Ver Detalles
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredDiplomados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron diplomados con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
