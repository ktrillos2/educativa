"use client"

import { GraduationCap, BookOpen, Users, Award } from "@/components/ui/icons"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import type { LucideIcon } from "@/components/ui/icons"

const stats = [
  {
    icon: GraduationCap,
    number: 5000,
    suffix: "+",
    label: "Estudiantes Graduados",
  },
  {
    icon: BookOpen,
    number: 50,
    suffix: "+",
    label: "Programas Académicos",
  },
  {
    icon: Users,
    number: 80,
    suffix: "+",
    label: "Docentes Expertos",
  },
  {
    icon: Award,
    number: 15,
    suffix: "+",
    label: "Años de Experiencia",
  },
]

function StatCard({
  icon: Icon,
  number,
  suffix,
  label,
  index,
  isVisible,
}: {
  icon: LucideIcon
  number: number
  suffix: string
  label: string
  index: number
  isVisible: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const duration = 2000
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * number))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [number, isVisible])

  return (
    <Card
      className="group bg-card border-primary-foreground/20 hover:border-primary-foreground/60 hover:scale-105 transition-all duration-500 hover:shadow-2xl animate-fade-up cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-3 bg-secondary/20 group-hover:bg-secondary/30 rounded-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
            <Icon className="h-8 w-8 text-secondary group-hover:animate-pulse" />
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
              {count.toLocaleString()}
              {suffix}
            </p>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AboutStats() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Nuestro Impacto</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Cifras que respaldan nuestro compromiso con la educación de calidad.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
