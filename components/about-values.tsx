"use client"

import { ShieldCheck, CheckSquare, Clock, Users, Scale, Eye, HeartHandshake, CheckCircle2, Award, Gavel, Heart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const values = [
  {
    icon: ShieldCheck,
    title: "Integridad",
    description: "Actuar de manera coherente con los principios éticos, las normas y las responsabilidades asumidas, tanto en el proceso educativo como en el ejercicio profesional o institucional.",
    color: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-600 group-hover:text-blue-700",
  },
  {
    icon: CheckSquare,
    title: "Honestidad",
    description: "Proceder con verdad y transparencia en las actuaciones académicas y administrativas, evitando el fraude, el plagio, la alteración de resultados, la falsedad y cualquier práctica que desconozca las reglas institucionales.",
    color: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
  },
  {
    icon: Clock,
    title: "Responsabilidad",
    description: "Cumplir los compromisos académicos, administrativos y personales, asumiendo las consecuencias de las decisiones y actuaciones propias.",
    color: "bg-amber-500/10 group-hover:bg-amber-500/20",
    iconColor: "text-amber-600 group-hover:text-amber-700",
  },
  {
    icon: Users,
    title: "Respeto",
    description: "Reconocer la dignidad, derechos, opiniones y diferencias de las personas, promoviendo relaciones basadas en el trato adecuado, el diálogo y la convivencia.",
    color: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    iconColor: "text-indigo-600 group-hover:text-indigo-700",
  },
  {
    icon: Scale,
    title: "Equidad",
    description: "Garantizar criterios imparciales y oportunidades de participación educativa sin discriminación, considerando las condiciones particulares cuando resulte necesario para asegurar un trato justo.",
    color: "bg-teal-500/10 group-hover:bg-teal-500/20",
    iconColor: "text-teal-600 group-hover:text-teal-700",
  },
  {
    icon: Eye,
    title: "Transparencia",
    description: "Actuar y comunicar con claridad, especialmente en procesos académicos, evaluativos, administrativos, financieros y de información al estudiante.",
    color: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    iconColor: "text-cyan-600 group-hover:text-cyan-700",
  },
  {
    icon: HeartHandshake,
    title: "Servicio",
    description: "Orientar las actuaciones hacia una atención respetuosa, oportuna y responsable. En la formación relacionada con gestión pública, este valor se proyecta hacia la comprensión del ciudadano como destinatario de la actuación estatal.",
    color: "bg-rose-500/10 group-hover:bg-rose-500/20",
    iconColor: "text-rose-600 group-hover:text-rose-700",
  },
  {
    icon: CheckCircle2,
    title: "Compromiso",
    description: "Asumir con disciplina y constancia los objetivos del proceso formativo y las responsabilidades relacionadas con el aprendizaje y el desempeño institucional.",
    color: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconColor: "text-purple-600 group-hover:text-purple-700",
  },
  {
    icon: Award,
    title: "Excelencia académica",
    description: "Buscar resultados educativos de calidad mediante preparación, actualización, rigurosidad conceptual y mejoramiento continuo, sin convertir la excelencia en una promesa comercial de resultados individuales.",
    color: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
    iconColor: "text-yellow-600 group-hover:text-yellow-700",
  },
  {
    icon: Gavel,
    title: "Justicia",
    description: "Aplicar las normas y criterios institucionales de manera objetiva, respetando los derechos y garantías de quienes integran la comunidad educativa.",
    color: "bg-orange-500/10 group-hover:bg-orange-500/20",
    iconColor: "text-orange-600 group-hover:text-orange-700",
  },
  {
    icon: Heart,
    title: "Solidaridad",
    description: "Favorecer relaciones de cooperación, apoyo y corresponsabilidad entre los integrantes de la comunidad académica y frente a las necesidades colectivas.",
    color: "bg-pink-500/10 group-hover:bg-pink-500/20",
    iconColor: "text-pink-600 group-hover:text-pink-700",
  },
  {
    icon: Star,
    title: "Liderazgo responsable",
    description: "Promover la capacidad de orientar, proponer y tomar decisiones sustentadas en conocimiento, ética y responsabilidad, particularmente en escenarios institucionales y de servicio público.",
    color: "bg-violet-500/10 group-hover:bg-violet-500/20",
    iconColor: "text-violet-600 group-hover:text-violet-700",
  },
]

export function AboutValues() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-[1cm] bg-muted/10 overflow-hidden">
      <div className="container mx-auto px-4 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Valores Institucionales</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto mb-6 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="group border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardContent className="p-5 h-full flex flex-col">
                    <div className="flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-3">
                        <div
                            className={`p-3 rounded-lg transition-all duration-500 flex-shrink-0 ${value.color} ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                        >
                            <Icon
                            className={`h-5 w-5 transition-all duration-500 ${value.iconColor}`}
                            />
                        </div>
                        <h3 className="text-base font-bold text-foreground leading-tight">
                            {value.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                          {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
