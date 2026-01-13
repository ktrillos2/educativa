"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, GraduationCap, Users, Award } from "lucide-react"

const slides = [
  {
    title: "Transforma tu Futuro Profesional",
    subtitle: "Diplomados y certificaciones que abren puertas en el mercado laboral",
    cta: "Explorar Programas",
    image: "/modern-university-campus-with-students-walking--pr.jpg",
  },
  {
    title: "Aprende de los Mejores Expertos",
    subtitle: "Docentes con experiencia real en el sector empresarial y público",
    cta: "Conocer Docentes",
    image: "/professional-business-meeting-with-diverse-people-.jpg",
  },
  {
    title: "Certificaciones que Impulsan tu Carrera",
    subtitle: "Programas avalados con reconocimiento nacional",
    cta: "Ver Certificaciones",
    image: "/graduation-ceremony-celebration--happy-graduates-t.jpg",
  },
]

const stats = [
  { icon: GraduationCap, value: "5,000+", label: "Graduados" },
  { icon: Users, value: "50+", label: "Programas" },
  { icon: Award, value: "98%", label: "Satisfacción" },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const handleSlideChange = (newIndex: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(newIndex)
    setTimeout(() => setIsAnimating(false), 700)
  }

  const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length)
  const prevSlide = () => handleSlideChange((currentSlide - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center pt-16">
        <div className="max-w-3xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
              }`}
            >
              <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold mb-5 rounded-md">
                Academia de Formación Líderes del Mérito
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight text-balance tracking-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 rounded-md"
                >
                  {slide.cta}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary bg-transparent font-semibold px-6 rounded-md"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Ver Video
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-28 right-8 hidden lg:flex flex-col gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 flex items-center gap-3 animate-fade-in rounded-md"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-2 bg-secondary rounded-md">
                <stat.icon className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all border border-white/20 rounded-md"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all border border-white/20 rounded-md"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-1.5 transition-all duration-300 rounded-sm ${
              index === currentSlide ? "bg-secondary w-6" : "bg-white/50 w-1.5 hover:bg-white/70"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
