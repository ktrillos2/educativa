"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
} from "@/components/ui/icons"
import { diplomados as allDiplomados } from "@/lib/data"
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

const programs = allDiplomados.slice(0, 6)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
}

export function AcademicOffer() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filteredPrograms = activeCategory === "Todos"
    ? programs
    : programs.filter((p) => p.category === activeCategory)

  return (
    <section id="oferta" className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4 rounded-full border border-primary/20">
            <BadgeCheck className="h-4 w-4" />
            Oferta Académica 2025
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Nuestros <span className="text-primary">Programas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el área de tu interés e inscríbete en nuestros programas diseñados para multiplicar tus oportunidades laborales.
          </p>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-full border shadow-sm ${isActive
                  ? "bg-primary text-white border-primary scale-105 shadow-primary/30"
                  : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-secondary' : ''}`} />}
                {category}
              </button>
            )
          })}
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((program) => {
              const CategoryIcon = categoryIcons[program.category] || Building2
              const BadgeIcon = program.badge ? badgeIcons[program.badge] : null
              return (
                <motion.div
                  layout
                  key={program.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>

                    {program.badge && BadgeIcon && (
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                        <BadgeIcon className="h-4 w-4" />
                        {program.badge}
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-wide mb-1">Inversión</p>
                        <div className="flex items-center gap-1.5">
                          <Banknote className="h-5 w-5 text-secondary" />
                          <span className="font-extrabold text-xl text-white drop-shadow-md">{program.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-primary">{program.startDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {program.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                        {program.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pt-5 border-t border-border/60">
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md">
                          <Clock3 className="h-4 w-4 text-primary" />
                          <span className="font-medium">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md">
                          <Users2 className="h-4 w-4 text-primary" />
                          <span className="font-medium">{program.students}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/diplomados/${program.id}`} className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-semibold group/btn overflow-hidden relative">
                            <span className="relative z-10 transition-transform group-hover/btn:-translate-x-1">Ver Diplomado</span>
                            <MoveUpRight className="absolute right-4 w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all group-hover/btn:translate-x-1" />
                            <div className="absolute inset-0 bg-white/20 scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-300 ease-out" />
                          </Button>
                        </Link>
                        <Link href={`/diplomados/${program.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-xl border-border hover:border-primary hover:bg-primary/5 hover:text-primary bg-transparent transition-colors"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link href="/diplomados">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full text-base font-bold h-12 px-8 bg-transparent transition-all"
              >
                Ver Catálogo Completo
                <MoveUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full text-base font-bold h-12 px-8 shadow-lg shadow-secondary/20">
              Solicitar Asesoría Gratuita
            </Button>
          </div>
        </motion.div>
      </div>
    </section >
  )
}
