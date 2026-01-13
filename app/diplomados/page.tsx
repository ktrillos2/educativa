import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DiplomadosList } from "@/components/diplomados-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { GraduationCap, Clock, Users, Award, BookOpen } from "lucide-react"

export default function DiplomadosPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Diplomados" }]} />

          <div className="max-w-3xl mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded border border-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">Formación Especializada</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Diplomados</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Programas de formación intensiva diseñados para profesionales que buscan actualizar y profundizar sus
              conocimientos en áreas específicas.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: BookOpen, value: "12+", label: "Programas" },
              { icon: Clock, value: "80-120h", label: "Duración" },
              { icon: Users, value: "500+", label: "Egresados" },
              { icon: Award, value: "100%", label: "Certificados" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded border border-white/20 p-4 text-center">
                <stat.icon className="h-5 w-5 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiplomadosList />
      <Footer />
    </main>
  )
}
