"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react"
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
    question: "¿Cuál es la modalidad de los diplomados?",
    answer:
      "Nuestros diplomados se ofrecen en modalidad presencial, virtual y semipresencial, adaptándonos a tus necesidades. Las clases virtuales son en vivo con docentes expertos, permitiendo interacción en tiempo real.",
  },
  {
    question: "¿Los certificados tienen validez nacional?",
    answer:
      "Sí, todos nuestros certificados tienen validez nacional y están avalados por instituciones de educación superior. Además, contamos con convenios que fortalecen el reconocimiento de nuestros programas.",
  },
  {
    question: "¿Cuáles son las formas de pago disponibles?",
    answer:
      "Ofrecemos múltiples opciones de pago: tarjetas de crédito y débito, transferencia bancaria, PSE, y planes de financiación hasta en 12 cuotas sin intereses. También aceptamos pagos desde el exterior.",
  },
  {
    question: "¿Cuánto tiempo duran los diplomados?",
    answer:
      "La duración varía según el programa, generalmente entre 80 y 120 horas académicas, distribuidas en 2 a 4 meses. Cada diplomado tiene un calendario específico que puedes consultar en la información del programa.",
  },
  {
    question: "¿Hay descuentos para grupos o empresas?",
    answer:
      "Sí, ofrecemos descuentos especiales para inscripciones grupales (3 o más personas), convenios empresariales, egresados y pronto pago. Contáctanos para conocer las tarifas especiales.",
  },
  {
    question: "¿Qué requisitos necesito para inscribirme?",
    answer:
      "Los requisitos varían según el programa. Generalmente se requiere copia del documento de identidad, certificado de estudios previos (bachillerato o profesional según el diplomado), y diligenciar el formulario de inscripción.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-12 md:py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium mb-3 rounded border border-primary/20">
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

        <div className="max-w-3xl mx-auto">
          <div className={`space-y-3 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-lg transition-all duration-200 ${
                  openIndex === index
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className={`font-medium pr-4 ${openIndex === index ? "text-primary" : "text-foreground"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 text-center ${isVisible ? "animate-fade-up stagger-3" : "opacity-0"}`}>
            <p className="text-muted-foreground mb-4 text-sm">¿No encontraste lo que buscabas?</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded h-10">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contáctanos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
