"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, GraduationCap, Users, Award } from "@/components/ui/icons"

const slides = [
  {
    title: "Transforma tu Futuro Profesional",
    subtitle: "Diplomados y certificaciones que abren puertas en el mercado laboral con un enfoque práctico y actualizado.",
    cta: "Explorar Programas",
    image: "/modern-university-campus-with-students-walking--pr.jpg",
  },
  {
    title: "Aprende de los Mejores Expertos",
    subtitle: "Docentes con amplia trayectoria y experiencia real en los sectores empresarial y público.",
    cta: "Conocer Docentes",
    image: "/professional-business-meeting-with-diverse-people-.jpg",
  },
  {
    title: "Certificaciones que Impulsan tu Carrera",
    subtitle: "Programas de alto nivel avalados con reconocimiento nacional para destacar tu currículum.",
    cta: "Ver Certificaciones",
    image: "/graduation-ceremony-celebration--happy-graduates-t.jpg",
  },
]

const stats = [
  { icon: GraduationCap, value: "5,000+", label: "Graduados Exitosos" },
  { icon: Users, value: "50+", label: "Programas Activos" },
  { icon: Award, value: "98%", label: "Satisfacción Estudiantil" },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1080px] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Slides */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          {/* Advanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-bold uppercase tracking-widest mb-6 rounded-full shadow-lg"
              >
                Academia Líderes del Mérito
              </motion.span>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] text-balance tracking-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl font-light">
                {slides[currentSlide].subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all text-lg font-semibold px-8 h-14 rounded-full shadow-xl shadow-primary/20"
                >
                  {slides[currentSlide].cta}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/60 text-white hover:bg-white hover:text-black hover:border-white transition-all text-lg bg-black/20 backdrop-blur-md font-semibold px-8 h-14 rounded-full"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Video
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Stats - Desktop Only */}
        <div className="absolute right-0 bottom-12 hidden lg:flex flex-col gap-4 w-72">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.8 + index * 0.15 }}
              className="bg-black/40 backdrop-blur-xl p-4 border-l-4 border-l-secondary border-y border-r border-white/10 flex items-center gap-4 rounded-l-2xl shadow-2xl hover:bg-black/60 transition-colors"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <stat.icon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/70 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
        <button
          onClick={prevSlide}
          className="p-3 bg-white/5 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/20 rounded-full hover:scale-110 active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-500 rounded-full ${index === currentSlide ? "bg-secondary w-10 shadow-[0_0_10px_rgba(255,165,0,0.5)]" : "bg-white/40 w-2 hover:bg-white/80"
                }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 bg-white/5 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/20 rounded-full hover:scale-110 active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
    </section>
  )
}
