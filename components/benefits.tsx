"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useRef } from "react"
import {
  GraduationCap,
  Medal,
  Users2,
  CalendarClock,
  ShieldCheck,
  BookMarked,
  MoveUpRight,
  Gem,
  Trophy,
  Target,
} from "@/components/ui/icons"

const benefits = [
  {
    icon: GraduationCap,
    title: "Docentes Expertos",
    description: "Profesionales con amplia experiencia en el campo académico, aportando conocimientos prácticos del sector laboral actual.",
  },
  {
    icon: Medal,
    title: "Certificación Avalada",
    description: "Certificados con validez nacional diseñados específicamente para impulsar tu hoja de vida y oportunidades.",
  },
  {
    icon: Users2,
    title: "Grupos Reducidos",
    description: "Aprendizaje garantizado gracias a nuestra atención personalizada con grupos de máximo 30 estudiantes.",
  },
  {
    icon: CalendarClock,
    title: "Horarios Flexibles",
    description: "Equilibra tu vida profesional y educativa con nuestros programas en horarios nocturnos y fines de semana.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía de Calidad",
    description: "Contenido curricular rigurosamente actualizado según las necesidades reales y urgentes del mercado competitivo.",
  },
  {
    icon: BookMarked,
    title: "Material Incluido",
    description: "Acceso 24/7 a nuestra plataforma virtual especializada y todo el material de estudio completo sin costo adicional.",
  },
]

const stats = [
  { number: 5000, suffix: "+", label: "Graduados", icon: GraduationCap },
  { number: 50, suffix: "+", label: "Programas", icon: BookMarked },
  { number: 98, suffix: "%", label: "Satisfacción", icon: Target },
  { number: 10, suffix: "+", label: "Años", icon: Trophy },
]

// Smooth animated counter using basic React effects for reliability, triggered by standard Intersection Observer via framer-motion's useInView
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let current = 0
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime
    const increment = target / steps

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-md">
      {count.toLocaleString()}
      <span className="text-secondary">{suffix}</span>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } }
}

export function Benefits() {
  return (
    <section id="nosotros" className="py-8 md:py-10 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 bg-secondary/5 text-secondary-foreground border-l-4 border-secondary text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-6 shadow-[4px_4px_0_0_rgba(197,160,89,0.3)]">
            <Gem className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
            Nuestras Ventajas
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            ¿Por qué <span className="text-primary">elegirnos</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Más de 10 años formando líderes y profesionales de excelencia con los más altos estándares educativos.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-8 bg-white/50 backdrop-blur-sm border border-border/60 hover:border-primary/40 rounded-none shadow-sm hover:shadow-[8px_8px_0_0_#C5A059] transition-all duration-300 relative overflow-hidden flex flex-col h-full"
            >
              {/* Subtle gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300 shadow-sm">
                  <benefit.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{benefit.description}</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                <MoveUpRight className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
