"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhoneCall, Mail, ArrowRight, Headphones, MessageCircle, Clock, CheckCircle2 } from "@/components/ui/icons"

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

const features = [
  { icon: Headphones, text: "Atención personalizada" },
  { icon: PhoneCall, text: "Canales de contacto directos" },
  { icon: Clock, text: "Información oportuna" },
]

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-[1cm] relative overflow-hidden" ref={ref}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/95 mix-blend-multiply z-10" />
        <div 
          className="w-full h-full bg-cover bg-center opacity-40" 
          style={{ backgroundImage: "url('/modern-university-campus-with-students-walking--pr.jpg')" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className={`grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-bold text-xs uppercase tracking-wider mb-6">
                <Headphones className="h-4 w-4" />
                Estamos para orientarte
              </span>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 uppercase leading-[1.1] tracking-tight">
                Resuelve tus dudas sobre nuestra oferta académica
              </h2>
              
              <div className="w-16 h-1 bg-secondary mx-auto lg:mx-0 mb-6 mt-4"></div>
              
              <p className="text-white/90 text-lg mb-10 max-w-xl font-light">
                Te orientamos para que conozcas nuestros programas, sus objetivos, duración, requisitos y condiciones de inscripción.
              </p>

              {/* Features - Grid de 3 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/20">
                {features.map((feature, index) => (
                  <div key={index} className={`flex items-center gap-4 text-left ${index !== 2 ? 'sm:border-r border-white/20 sm:pr-6' : ''}`}>
                    <div className="bg-secondary p-3 rounded-full shrink-0 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-white text-sm font-medium leading-tight">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Contact Card */}
            <div className="bg-white p-8 rounded-none shadow-[8px_8px_0_0_#C5A059] border-2 border-border relative">
              <h3 className="text-xl font-bold text-primary mb-2">Solicita asesoría académica</h3>
              <div className="w-10 h-0.5 bg-secondary mb-6 mt-2"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-muted/30 border border-muted">
                  <div className="p-2 bg-primary/10">
                    <PhoneCall className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Llámanos</p>
                    <p className="font-bold text-foreground">+57 (1) 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/30 border border-muted">
                  <div className="p-2 bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Escríbenos</p>
                    <p className="font-bold text-foreground text-sm">direccionacademica@lideresdelmerito.edu.co</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 uppercase font-bold text-sm tracking-wider shadow-[4px_4px_0_0_#C5A059]">
                  <a href="https://wa.me/573000000000?text=Hola,%20quisiera%20solicitar%20asesor%C3%ADa%20sobre%20los%20programas." target="_blank" rel="noopener noreferrer">
                    Solicitar Asesoría
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-none h-12 border-border hover:bg-muted bg-transparent uppercase font-bold text-sm tracking-wider shadow-[4px_4px_0_0_#000]">
                  <Link href="/diplomados">
                    Conocer Programas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Info Alert Banner en el fondo */}
          <div className="mt-16 bg-primary/80 border border-white/20 p-4 lg:p-5 flex items-center justify-center gap-3 text-sm lg:text-base text-white/90">
            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
            <p>La orientación brindada tiene carácter informativo sobre la oferta académica de la institución.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
