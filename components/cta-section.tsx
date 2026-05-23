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
  { icon: Clock, text: "Respuesta en menos de 24h" },
  { icon: Headphones, text: "Asesoría personalizada" },
  { icon: CheckCircle2, text: "Sin compromiso" },
]

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-[1cm] bg-primary relative overflow-hidden" ref={ref}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white text-sm font-medium mb-4 rounded-none border border-white/20">
                <MessageCircle className="h-3.5 w-3.5" />
                Estamos para ayudarte
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Comienza Tu Transformación Profesional
              </h2>
              <p className="text-white/80 text-base mb-6">
                Nuestro equipo de asesores está listo para guiarte en tu desarrollo profesional y encontrar el programa
                perfecto para ti.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/90 text-sm">
                    <feature.icon className="h-4 w-4 text-secondary" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Contact Card */}
            <div className="bg-white p-6 md:p-8 rounded-none shadow-[8px_8px_0_0_rgba(197,160,89,0.5)] border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Solicita información</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-none border border-border">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <PhoneCall className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Llámanos</p>
                    <p className="font-semibold text-foreground">+57 (1) 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-none border border-border">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Escríbenos</p>
                    <p className="font-semibold text-foreground">info@lideresdelmerito.edu.co</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-11 shadow-[4px_4px_0_0_#C5A059]">
                  <a href="https://wa.me/573000000000?text=Hola,%20quisiera%20solicitar%20asesor%C3%ADa%20sobre%20los%20programas." target="_blank" rel="noopener noreferrer">
                    Solicitar Asesoría
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-none h-11 border-border hover:bg-muted bg-transparent shadow-[4px_4px_0_0_#000]">
                  <Link href="/diplomados">
                    Ver Programas
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
