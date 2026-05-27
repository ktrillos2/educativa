"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from "@/components/ui/icons"

const testimonials = [
  {
    name: "María Fernanda López",
    role: "Gerente de Recursos Humanos",
    company: "Empresa ABC",
    content:
      "El diplomado en Gestión del Talento Humano me brindó herramientas prácticas que aplico diariamente en mi trabajo. Los docentes son excelentes profesionales.",
    image: "/professional-woman-portrait-business-confident.jpg",
    rating: 5,
  },
  {
    name: "Carlos Andrés Martínez",
    role: "Coordinador de SST",
    company: "Constructora XYZ",
    content:
      "Gracias al diplomado en Seguridad y Salud en el Trabajo pude implementar el SG-SST en mi empresa de manera efectiva. Muy recomendado.",
    image: "/professional-man-portrait-business-confident.jpg",
    rating: 5,
  },
  {
    name: "Ana Sofía Rodríguez",
    role: "Contratista Independiente",
    company: "Consultoría Pública",
    content:
      "El diplomado en Contratación Estatal me abrió muchas puertas laborales. El contenido está muy actualizado con la normatividad vigente.",
    image: "/professional-woman-consultant-portrait-confident.jpg",
    rating: 5,
  },
  {
    name: "Juan Pablo Herrera",
    role: "Director de Marketing",
    company: "Agencia Digital",
    content:
      "El diplomado en Marketing Digital superó mis expectativas. Aprendí estrategias que pude implementar inmediatamente con resultados sorprendentes.",
    image: "/professional-man-marketing-director-confident.jpg",
    rating: 5,
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

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const next = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-8 md:py-10 bg-muted/40" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium mb-3  border border-primary/20">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Lo que dicen nuestros <span className="text-primary">estudiantes</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Historias reales de profesionales que han transformado sus carreras.
          </p>
        </div>

        <div className={`${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}>
          {/* Desktop: mostrar múltiples testimonios */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card border border-border  overflow-hidden hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 shrink-0 overflow-hidden">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                        ))}
                      </div>
                      <blockquote className="text-sm text-foreground mb-4 leading-relaxed line-clamp-3">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 overflow-hidden  border border-primary/20">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile/Tablet: Carrusel */}
          <div className="lg:hidden">
            <div className="overflow-hidden ">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <Card className="bg-card border border-border  overflow-hidden mx-1">
                      <CardContent className="p-5">
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                          ))}
                        </div>
                        <blockquote className="text-sm text-foreground mb-4 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden  border border-primary/20">
                            <img
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                            <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={prev}
                className="p-2 bg-card border border-border hover:border-primary text-foreground transition-all "
                aria-label="Anterior testimonio"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex(index)
                    }}
                    className={`h-1.5 transition-all duration-200  ${
                      index === currentIndex ? "bg-primary w-5" : "bg-border w-1.5 hover:bg-primary/50"
                    }`}
                    aria-label={`Ir a testimonio ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 bg-card border border-border hover:border-primary text-foreground transition-all "
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
