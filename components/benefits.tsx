"use client"

import { useEffect, useRef, useState } from "react"
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
} from "lucide-react"

const benefits = [
  {
    icon: GraduationCap,
    title: "Docentes Expertos",
    description: "Profesionales con amplia experiencia en el campo académico y laboral.",
  },
  {
    icon: Medal,
    title: "Certificación Avalada",
    description: "Certificados con validez nacional para impulsar tu hoja de vida.",
  },
  {
    icon: Users2,
    title: "Grupos Reducidos",
    description: "Atención personalizada con grupos de máximo 30 estudiantes.",
  },
  {
    icon: CalendarClock,
    title: "Horarios Flexibles",
    description: "Programas en horarios nocturnos y fines de semana.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía de Calidad",
    description: "Contenido actualizado según las necesidades del mercado.",
  },
  {
    icon: BookMarked,
    title: "Material Incluido",
    description: "Acceso a plataforma virtual y material de estudio completo.",
  },
]

const stats = [
  { number: 5000, suffix: "+", label: "Graduados", icon: GraduationCap },
  { number: 50, suffix: "+", label: "Programas", icon: BookMarked },
  { number: 98, suffix: "%", label: "Satisfacción", icon: Target },
  { number: 10, suffix: "+", label: "Años", icon: Trophy },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, target])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

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

export function Benefits() {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  return (
    <section id="nosotros" className="py-12 md:py-16" ref={sectionRef}>
      <div className="container mx-auto px-4 mb-12">
        <div className={`text-center mb-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/20 text-primary text-sm font-medium mb-3 rounded border border-secondary/30">
            <Gem className="h-3.5 w-3.5" />
            Nuestras Ventajas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            ¿Por qué <span className="text-primary">elegirnos</span>?
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Más de 10 años formando líderes y profesionales de excelencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group p-5 bg-card border border-border hover:border-primary/40 transition-all duration-200 cursor-pointer rounded-lg hover:shadow-md ${
                isVisible ? `animate-fade-up stagger-${(index % 6) + 1}` : "opacity-0"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-primary/10 flex items-center justify-center rounded group-hover:bg-primary transition-colors duration-200">
                  <benefit.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
                <MoveUpRight className="h-4 w-4 text-transparent group-hover:text-primary transition-all duration-200 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 rounded-lg ${
                  isVisible ? `animate-fade-up stagger-${index + 1}` : "opacity-0"
                }`}
              >
                <div className="inline-flex items-center justify-center w-9 h-9 bg-secondary rounded mb-2">
                  <stat.icon className="h-4 w-4 text-secondary-foreground" />
                </div>
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                <p className="text-white/70 mt-1 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
