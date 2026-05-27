import { DiplomadosList } from "@/components/diplomados-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { GraduationCap, Clock, Users, Award, BookOpen } from "@/components/ui/icons"
import Image from "next/image"

export default function DiplomadosPage() {
  return (
    <main className="flex-grow">

      {/* Hero Section */}
      <section className="pt-[calc(6rem+1cm)] pb-[1cm] min-h-[100dvh] flex flex-col bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-between flex-grow">
          <div>
            <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Diplomados" }]} />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full mt-6">
              <div className="max-w-3xl w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/10 rounded-none border border-white/20">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">Formación Especializada</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Diplomados</h1>
                <p className="text-white/80 text-lg">
                  Programas de formación intensiva diseñados para profesionales que buscan actualizar y profundizar sus
                  conocimientos en áreas específicas.
                </p>
              </div>
            </div>
          </div>
          {/* 4 Imágenes en fila al estilo brutalista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 w-full">
            <div className="relative h-48 md:h-56 lg:h-64 w-full border-2 border-white/20 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
              <Image src="/images/diplomado-1.webp" fill className="object-cover" alt="Formación 1" />
            </div>
            <div className="relative h-48 md:h-56 lg:h-64 w-full border-2 border-white/20 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
              <Image src="/images/diplomado-2.webp" fill className="object-cover" alt="Formación 2" />
            </div>
            <div className="hidden sm:block relative h-48 md:h-56 lg:h-64 w-full border-2 border-white/20 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
              <Image src="/images/diplomado-3.webp" fill className="object-cover" alt="Formación 3" />
            </div>
            <div className="hidden sm:block relative h-48 md:h-56 lg:h-64 w-full border-2 border-white/20 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
              <Image src="/images/diplomado-4.webp" fill className="object-cover" alt="Formación 4" />
            </div>
          </div>
        </div>
      </section>

      <DiplomadosList />
    </main>
  )
}
