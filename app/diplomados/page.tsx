import { DiplomadosList } from "@/components/diplomados-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { GraduationCap } from "@/components/ui/icons"
import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSettings } from "@/app/actions/settings"

export default async function DiplomadosPage() {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()
  
  const { data: coursesData } = await supabase
    .from("courses")
    .select("*")
    .or("type.eq.diplomado,type.is.null")
    .order("created_at", { ascending: true })

  const initialCourses = await Promise.all((coursesData || []).map(async (course) => {
    // Buscar conteo de inscritos (bypassing RLS para obtener el total real)
    const { count: enrolledCount } = await supabaseAdmin
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id)

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      students: course.students,
      badge: course.badge,
      category: course.category,
      image: course.image,
      price: course.price,
      startDate: course.start_date,
      modules: course.modules,
      minStudents: course.min_students ?? 5,
      enrolledCount: enrolledCount ?? 0,
    }
  }))

  const uniqueCategories = [
    "Todos",
    ...Array.from(new Set(initialCourses.map((c) => c.category).filter((cat): cat is string => Boolean(cat)))),
  ]

  let promoVideos = [
    { url: "", title: "" },
    { url: "", title: "" },
    { url: "", title: "" },
  ]
  try {
    const data = await getSettings("promo_videos")
    if (data && Array.isArray(data) && data.length > 0) {
      promoVideos = data
    }
  } catch (error) {
    console.error("Error fetching promo videos", error)
  }

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

      <DiplomadosList initialCourses={initialCourses} initialCategories={uniqueCategories} />

      {/* Sección de Videos Motivacionales */}
      <section className="py-16 bg-muted/30 border-t border-border/50 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[oklch(0.25_0.10_145)] mb-4">¿Por qué estudiar un Diplomado con nosotros?</h2>
            <p className="text-[oklch(0.55_0.04_145)] max-w-2xl mx-auto">
              Conoce la experiencia de nuestros estudiantes y descubre cómo nuestros programas han impulsado sus carreras profesionales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoVideos.map((video: any, index: number) => {
              if (!video.url) {
                return (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-[oklch(0.88_0.04_145)] flex flex-col group hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-primary/50 transition-colors">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-sm font-bold text-gray-500">Espacio para Video {index + 1}</span>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-[oklch(0.88_0.04_145)] flex flex-col group hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-300">
                    <video src={video.url} controls className="w-full h-full object-cover"></video>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
