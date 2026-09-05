"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, MessageSquare } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

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

const faqs = [
  {
    question: "¿Cuál es la modalidad de los programas de formación académica?",
    answer:
      "Los programas se desarrollan mediante estrategias virtuales sincrónicas y asincrónicas, de acuerdo con la metodología autorizada para cada programa.",
  },
  {
    question: "¿Los certificados tienen validez?",
    answer:
      "Sí. los programas están habilitados por la Secretaria de Educación del Departamento del Cesar y reportado en el SIET.",
  },
  {
    question: "¿Cuáles son las formas de pago disponibles?",
    answer:
      "Los medios y condiciones de pago habilitados serán informados en la plataforma al momento de realizar la inscripción.",
  },
  {
    question: "¿Cuánto tiempo duran los programas?",
    answer:
      "La duración se especificará en cada oferta académica. Los programas actualmente proyectados por la Academia están estructurados en 160 horas, conforme a su diseño académico y al registro autorizado.",
  },
  {
    question: "¿Hay descuentos para grupos o entidades?",
    answer:
      "La Academia podrá establecer tarifas especiales, convenios o beneficios para grupos y entidades, de acuerdo con sus políticas comerciales vigentes.",
  },
  {
    question: "¿Los programas conducen a un título profesional?",
    answer:
      "No. Los programas de formación académica ETDH no conducen a título profesional. Al cumplir satisfactoriamente los requisitos del programa registrado, se expide un Certificado de Conocimientos Académicos.",
  },
  {
    question: "¿Qué requisitos necesito para inscribirme?",
    answer:
      "Diligenciar el formulario de matrícula, adjuntar en formato PDF una copia del documento de identidad y realizar el pago correspondiente a la matrícula del programa.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-[1cm] bg-muted/30 relative overflow-hidden" ref={ref}>
      {/* Watermarks */}
      <div className="absolute top-0 left-0 text-primary font-black opacity-[0.03] text-[300px] md:text-[400px] select-none pointer-events-none leading-none rotate-[-15deg] z-0">
        ?
      </div>
      <div className="absolute bottom-0 right-0 text-primary font-black opacity-[0.03] text-[300px] md:text-[400px] select-none pointer-events-none leading-none rotate-[15deg] z-0">
        ?
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium mb-3 rounded-none border border-primary/20">
            <HelpCircle className="h-3.5 w-3.5" />
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            ¿Tienes <span className="text-primary">Dudas</span>?
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros programas.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-none transition-all duration-200 h-fit ${
                  openIndex === index
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                } ${
                  index === faqs.length - 1 ? "lg:col-span-2 lg:w-[calc(50%-0.5rem)] lg:mx-auto w-full" : ""
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                >
                  <span 
                    className={`font-semibold pr-2 text-[12px] sm:text-[13px] lg:text-[13.5px] xl:text-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis ${
                      openIndex === index ? "text-primary" : "text-foreground"
                    }`}
                    title={faq.question}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 text-center ${isVisible ? "animate-fade-up stagger-3" : "opacity-0"}`}>
            <p className="text-muted-foreground mb-4 text-sm">¿No encontraste lo que buscabas?</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground  h-10">
              <Link href="/contacto">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contáctanos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
