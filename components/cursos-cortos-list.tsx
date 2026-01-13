"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  ArrowRight,
  Presentation,
  FileSpreadsheet,
  Scale,
  Calculator,
  Users,
  Search,
  SlidersHorizontal,
  Banknote,
  CalendarDays,
  Sparkles,
  Flame,
} from "lucide-react"
import Link from "next/link"

const categories = ["Todos", "Ofimática", "Legal", "Finanzas", "Habilidades"]

const categoryIcons: Record<string, React.ElementType> = {
  Ofimática: FileSpreadsheet,
  Legal: Scale,
  Finanzas: Calculator,
  Habilidades: Users,
}

const badgeLabels: Record<string, { icon: React.ElementType; label: string }> = {
  nuevo: { icon: Sparkles, label: "Nuevo" },
  popular: { icon: Flame, label: "Popular" },
}

const cursos = [
  {
    id: 1,
    title: "Excel Avanzado para Empresas",
    description: "Domina fórmulas avanzadas, tablas dinámicas y automatización con macros.",
    duration: "20 horas",
    category: "Ofimática",
    image: "/excel-spreadsheet-business-data-analysis.jpg",
    price: "$280.000",
    startDate: "10 Feb 2025",
    badge: "popular",
    level: "Intermedio",
  },
  {
    id: 2,
    title: "Power BI Básico",
    description: "Crea dashboards interactivos y visualizaciones de datos profesionales.",
    duration: "16 horas",
    category: "Ofimática",
    image: "/power-bi-dashboard-data-visualization.jpg",
    price: "$320.000",
    startDate: "15 Feb 2025",
    badge: "nuevo",
    level: "Básico",
  },
  {
    id: 3,
    title: "Fundamentos de Derecho Laboral",
    description: "Conoce los conceptos básicos de la normatividad laboral colombiana.",
    duration: "12 horas",
    category: "Legal",
    image: "/labor-law-legal-documents-office.jpg",
    price: "$180.000",
    startDate: "18 Feb 2025",
    badge: null,
    level: "Básico",
  },
  {
    id: 4,
    title: "Liquidación de Nómina",
    description: "Aprende a calcular nómina, prestaciones sociales y seguridad social.",
    duration: "24 horas",
    category: "Finanzas",
    image: "/payroll-calculation-accounting-finance.jpg",
    price: "$350.000",
    startDate: "20 Feb 2025",
    badge: "popular",
    level: "Intermedio",
  },
  {
    id: 5,
    title: "Comunicación Efectiva",
    description: "Mejora tus habilidades de comunicación verbal y escrita en el trabajo.",
    duration: "8 horas",
    category: "Habilidades",
    image: "/effective-communication-business-presentation.jpg",
    price: "$150.000",
    startDate: "22 Feb 2025",
    badge: null,
    level: "Básico",
  },
  {
    id: 6,
    title: "Contratación Pública Básica",
    description: "Introducción a los procesos de contratación estatal en Colombia.",
    duration: "16 horas",
    category: "Legal",
    image: "/government-contract-legal-documents-signing.jpg",
    price: "$220.000",
    startDate: "25 Feb 2025",
    badge: null,
    level: "Básico",
  },
  {
    id: 7,
    title: "Liderazgo y Gestión de Equipos",
    description: "Desarrolla habilidades de liderazgo para dirigir equipos de alto rendimiento.",
    duration: "12 horas",
    category: "Habilidades",
    image: "/leadership-team-management-meeting.jpg",
    price: "$200.000",
    startDate: "1 Mar 2025",
    badge: "nuevo",
    level: "Intermedio",
  },
  {
    id: 8,
    title: "Presupuesto y Control Financiero",
    description: "Técnicas para elaborar y controlar presupuestos empresariales.",
    duration: "20 horas",
    category: "Finanzas",
    image: "/finance-budget-accounting-professional-calculator.jpg",
    price: "$300.000",
    startDate: "5 Mar 2025",
    badge: null,
    level: "Intermedio",
  },
]

export function CursosCortosList() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCursos = cursos.filter((c) => {
    const matchesCategory = activeCategory === "Todos" || c.category === activeCategory
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Buscar cursos..."
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
          Mostrando <span className="font-semibold text-foreground">{filteredCursos.length}</span> cursos
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCursos.map((curso) => {
            const CategoryIcon = categoryIcons[curso.category] || Presentation
            const badge = curso.badge ? badgeLabels[curso.badge] : null
            return (
              <Card
                key={curso.id}
                className="group overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-200 rounded-lg hover:shadow-lg p-0"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={curso.image || "/placeholder.svg"}
                    alt={curso.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 p-2 bg-white rounded shadow-sm">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                  </div>

                  {badge && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-white text-xs font-semibold rounded shadow-sm">
                      <badge.icon className="h-3 w-3" />
                      {badge.label}
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-1">
                      <Banknote className="h-4 w-4 text-secondary" />
                      <span className="font-bold text-lg text-white">{curso.price}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white/95 text-xs font-medium text-foreground rounded">
                      {curso.level}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {curso.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{curso.description}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{curso.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-primary" />
                      <span>{curso.startDate}</span>
                    </div>
                  </div>

                  <Link href={`/cursos-cortos/${curso.id}`}>
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

        {filteredCursos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron cursos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
