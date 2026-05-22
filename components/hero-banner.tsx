"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { ChevronLeft, ChevronRight, GraduationCap, Users } from "@/components/ui/icons"
import Link from "next/link"

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
  { icon: GraduationCap, label: "Graduados Exitosos" },
  { icon: Users, label: "Programas Activos" },
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
    <section className="relative w-full h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
      
      {/* 
        Layout Responsivo:
        - Desktop (lg): Split screen 50/50 (flex-row)
        - Mobile/Tablet: Imagen de fondo a pantalla completa con texto superpuesto
      */}
      <div className="absolute inset-0 flex flex-col lg:flex-row w-full h-full">
        
        {/* Left Column: Typography & CTAs */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-foreground/90 lg:bg-foreground relative z-20">
          
          {/* Subtle decorative radial gradient and plus pattern for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none hidden lg:block"></div>
          
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 18v12M18 24h12' stroke='%23ffffff' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundSize: '48px 48px'
            }}
          ></div>

          <div className="relative z-10 max-w-2xl mx-auto lg:mx-0 pt-20 lg:pt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Academic Label */}
                <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 bg-background/5 backdrop-blur-md text-background border-l-4 border-secondary text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 sm:mb-6 shadow-[4px_4px_0_0_rgba(197,160,89,0.3)]">
                  <Icon icon="solar:diploma-bold-duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  Academia Líderes del Mérito
                </div>

                {/* Massive Title with Text Gradient */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-background via-background to-background/60 mb-4 sm:mb-6 leading-[1.1] tracking-tighter uppercase break-words">
                  {slides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <div className="w-12 h-[3px] bg-secondary mb-3 mt-1"></div>
                <p className="text-sm sm:text-base md:text-lg text-background/70 mb-6 sm:mb-8 max-w-lg font-medium leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Call to Action */}
                <div className="inline-flex relative mb-6 sm:mb-8">
                  <div className="absolute -inset-1 bg-secondary/20 blur-xl rounded-full z-0"></div>
                  <Button size="lg" asChild className="relative z-10 h-12 sm:h-14 px-8 sm:px-10 text-xs sm:text-sm w-full sm:w-auto shadow-[4px_4px_0_0_#C5A059] hover:shadow-[2px_2px_0_0_#C5A059]">
                    <Link href="/diplomados">
                      VER CERTIFICACIONES
                      <Icon icon="solar:arrow-right-line-duotone" className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>
                </div>
                
                {/* Stats Block (Glassmorphism) - Hidden on very small screens to save height */}
                <div className="hidden sm:grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-background/10">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 bg-background/5 backdrop-blur-sm border border-background/10 hover:bg-background/10 transition-colors"
                    >
                      <div className="p-2 sm:p-3 bg-secondary/10 text-secondary shadow-[inset_0_0_10px_rgba(197,160,89,0.2)]">
                        <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs md:text-sm font-bold text-background/90 uppercase tracking-widest leading-tight">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Image & Slider Controls */}
        {/* On mobile, this acts as an absolute background. On desktop, it takes 50% width. */}
        <div className="absolute inset-0 lg:relative w-full lg:w-1/2 h-full z-0 lg:z-10 overflow-hidden bg-black flex flex-col">
          
          {/* The Image with Continuous Zoom */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 8, ease: "linear" }
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Overlays for contrast */}
          <div className="absolute inset-0 bg-black/60 lg:bg-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent lg:from-black/80 lg:via-black/20 lg:to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 pointer-events-none"></div>
          
        </div>
      </div>
    </section>
  )
}
