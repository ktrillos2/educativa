"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { ChevronLeft, ChevronRight, GraduationCap, Users } from "@/components/ui/icons"
import Link from "next/link"

const slides = [
  {
    title: "FORTALECE TUS CONOCIMIENTOS ACADÉMICOS Y HABILIDADES",
    subtitle: "Programas de formación académica orientados a la actualización de conocimientos y al desarrollo de habilidades aplicables al entorno institucional y laboral.",
    cta: "Explorar Programas",
    href: "/formacion-academica",
    image: "/modern-university-campus-with-students-walking--pr.jpg",
    bottomFeature: {
      icon: "solar:shield-check-outline",
      text: "Certificado de Conocimientos Académicos según el programa registrado."
    }
  },
  {
    title: "FORTALECE TU PERFIL PARA LA VALORACIÓN DE ANTECEDENTES",
    subtitle: "Programas de formación académica orientados a ampliar conocimientos y respaldar tu participación en procesos de selección por mérito en el sector público.",
    featureText: "Actualiza tu hoja de vida con formación pertinente y enfoque en gestión pública.",
    cta: "Conocer Programas",
    href: "/diplomados",
    image: "/professional-business-meeting-with-diverse-people-.jpg",
  },
  {
    title: (
      <>
        FORTALECE TU HOJA DE VIDA<br />
        CON <span className="text-secondary">FORMACIÓN ACADÉMICA</span>
      </>
    ),
    subtitle: "Programas orientados al fortalecimiento de conocimientos y habilidades, con registro y reporte en el SIET conforme a la normatividad aplicable.",
    cta: "Conocer Programas",
    href: "/diplomados",
    image: "/graduation-ceremony-celebration--happy-graduates-t.jpg",
    bottomFeature: {
      icon: "solar:shield-check-outline",
      text: "Certificado de Conocimientos Académicos según el programa registrado."
    }
  },
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
        - Desktop (lg): Split screen 50/50 con curva suave a la derecha del verde
        - Mobile/Tablet: Imagen de fondo a pantalla completa con texto superpuesto verde
      */}
      <div className="absolute inset-0 flex flex-col lg:flex-row w-full h-full">
        
        {/* Left Column: Typography & CTAs (Fondo Verde) */}
        <div className="w-full lg:w-[55%] h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 pt-[150px] lg:pt-[175px] pb-[40px] lg:pb-[60px] bg-primary/95 lg:bg-primary relative z-20 shadow-[10px_0_30px_-10px_rgba(0,0,0,0.5)]">
          
          {/* SVG Shape divider para crear la curva tipo Imagen 2 */}
          <div className="hidden lg:block absolute top-0 -right-[10vw] w-[10vw] h-full text-primary pointer-events-none drop-shadow-[5px_0_10px_rgba(0,0,0,0.2)]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                {/* Arco convexo hacia la derecha que va de arriba a abajo */}
                <path d="M0,0 Q100,50 0,100 Z" />
            </svg>
            {/* Pequeña línea dorada/secondary decorativa siguiendo la curva */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-[2px] pointer-events-none stroke-secondary" fill="none" strokeWidth="1">
                <path d="M0,0 Q100,50 0,100" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto lg:mx-0 mt-8 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Academic Label - Estilo de la imagen 2 */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-secondary rounded-full bg-transparent text-secondary text-[11px] font-bold uppercase tracking-widest mb-4">
                  <Icon icon="solar:diploma-bold-duotone" className="w-4 h-4 text-secondary" />
                  Formación Académica ETDH
                </div>

                {/* Massive Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] xl:text-[3.6rem] font-black text-white mb-4 leading-[1.05] tracking-tight uppercase break-words drop-shadow-sm">
                  {slides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <div className="w-12 h-[3px] bg-secondary mb-3 mt-1"></div>
                <p className="text-[15px] sm:text-[17px] text-white/80 mb-5 max-w-xl font-medium leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Feature Text Condicional */}
                {slides[currentSlide].featureText && (
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 border border-secondary rounded-full text-secondary shrink-0">
                          <Icon icon="solar:user-rounded-bold-duotone" className="w-4 h-4" />
                      </div>
                      <p className="text-[15px] text-white/90">
                          {slides[currentSlide].featureText}
                      </p>
                  </div>
                )}

                {/* Call to Action - Botón verde oscuro con borde dorado */}
                <div className="inline-flex mb-4">
                  <Button size="lg" asChild className="relative z-10 h-11 sm:h-12 px-6 bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-secondary text-white text-[13px] sm:text-[15px] font-bold uppercase tracking-wider rounded-none">
                    <Link href={slides[currentSlide].href}>
                      {slides[currentSlide].cta}
                      <Icon icon="solar:arrow-right-linear" className="ml-3 w-4 h-4 text-secondary" />
                    </Link>
                  </Button>
                </div>
                
                {/* Bottom Feature Condicional */}
                {slides[currentSlide].bottomFeature && (
                  <div className="flex items-center gap-3">
                      <div className="text-secondary shrink-0">
                          <Icon icon={slides[currentSlide].bottomFeature.icon} className="w-5 h-5" />
                      </div>
                      <p className="text-[13px] text-secondary font-medium leading-snug max-w-xs">
                          {slides[currentSlide].bottomFeature.text}
                      </p>
                  </div>
                )}
                
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="absolute inset-0 lg:relative w-full lg:w-1/2 h-full z-0 lg:z-10 overflow-hidden bg-black flex flex-col">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 8, ease: "linear" }
              }}
              className="absolute inset-0 w-full h-full object-cover object-center lg:object-[70%_50%]"
            />
          </AnimatePresence>

          {/* Overlays para que en móvil el texto sea legible y en desktop no tape tanto */}
          <div className="absolute inset-0 bg-primary/90 lg:bg-transparent z-10 lg:hidden pointer-events-none"></div>
          
        </div>
      </div>

    </section>
  )
}
