import { DiplomadosList } from "@/components/diplomados-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { GraduationCap } from "@/components/ui/icons"
import Image from "next/image"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSettings } from "@/app/actions/settings"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProgramInfoDialog } from "@/components/program-info-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DiplomadosPage() {
  const supabaseAdmin = createAdminClient()
  
  const { data: rawCourses, error: coursesError } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true })

  if (coursesError) {
    console.error("Error fetching courses for diplomados:", coursesError)
  }

  // Si hay cursos en la base de datos, usamos los cursos reales
  const coursesData = (rawCourses && rawCourses.length > 0)
    ? rawCourses.filter((course) => course.type !== "etdh" || rawCourses.length === 1)
    : []

  let initialCourses = await Promise.all((coursesData || []).map(async (course) => {
    const { count: enrolledCount } = await supabaseAdmin
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id)

    return {
      id: String(course.id),
      title: course.title || "Sin título",
      description: course.description || "",
      duration: course.duration || "A tu ritmo",
      students: course.students || "Autoestudio",
      badge: course.badge || null,
      category: course.category || "General",
      image: course.image || "/placeholder.svg",
      price: course.price || "Gratuito",
      startDate: course.start_date || "Inscripciones Abiertas",
      modules: course.modules || 0,
      minStudents: course.min_students ?? 5,
      enrolledCount: enrolledCount ?? 0,
    }
  }))

  // Solo usamos el fallback si la BD está completamente vacía (0 registros en la tabla courses)
  if ((!rawCourses || rawCourses.length === 0) && initialCourses.length === 0) {
    initialCourses = [
      {
        id: 'diplomado-salud-ocupacional',
        title: 'Diplomado en Seguridad y Salud en el Trabajo',
        description: 'Capacítate en la prevención de riesgos laborales y normatividad vigente del SG-SST.',
        category: 'Salud',
        price: '$120.000 COP',
        duration: '120 horas',
        students: 'Autoestudio',
        badge: 'Popular',
        image: '/images/workplace-safety-health-professional-training.jpg',
        startDate: 'Inscripciones Abiertas',
        modules: 4,
        minStudents: 5,
        enrolledCount: 0
      },
      {
        id: 'diplomado-gestion-publica',
        title: 'Diplomado en Gestión Pública y Contratación Estatal',
        description: 'Aprende los principios fundamentales de la administración pública y los procesos contractuales del Estado.',
        category: 'Gestión',
        price: '$150.000 COP',
        duration: '140 horas',
        students: 'Autoestudio',
        badge: 'Certificado',
        image: '/images/government-contract-legal-documents.jpg',
        startDate: 'Inscripciones Abiertas',
        modules: 5,
        minStudents: 5,
        enrolledCount: 0
      },
      {
        id: 'diplomado-desarrollo-software',
        title: 'Diplomado en Desarrollo de Software y Frontend Web',
        description: 'Aprende a construir aplicaciones web modernas con React, Next.js y JavaScript avanzado.',
        category: 'Tecnología',
        price: '$180.000 COP',
        duration: '160 horas',
        students: 'Autoestudio',
        badge: 'Nuevo',
        image: '/images/desarrollo-software.jpg',
        startDate: 'Inscripciones Abiertas',
        modules: 6,
        minStudents: 5,
        enrolledCount: 0
      },
      {
        id: 'diplomado-derecho-laboral',
        title: 'Diplomado en Derecho Laboral y Talento Humano',
        description: 'Domina los aspectos legales, contratos y liquidaciones en la gestión del talento humano.',
        category: 'Legal',
        price: '$130.000 COP',
        duration: '120 horas',
        students: 'Autoestudio',
        badge: 'Popular',
        image: '/images/labor-law-legal-documents-office.jpg',
        startDate: 'Inscripciones Abiertas',
        modules: 4,
        minStudents: 5,
        enrolledCount: 0
      }
    ]
  }

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

            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 w-full mt-6">
              <div className="max-w-3xl w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/10 rounded-none border border-white/20">
                    <GraduationCap className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Educación informal</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Diplomados</h1>
                <p className="text-white/80 text-lg">
                  Para actualizar conocimientos, fortalecer tu hoja de vida y aportar formación complementaria en procesos donde sea valorada dentro de los antecedentes.
                </p>
                <p className="mt-4 text-white/80 text-[11px] md:text-xs leading-tight pl-3 py-1 border-l-2 border-secondary inline-block max-w-3xl">
                  Nuestra oferta de diplomados se desarrolla conforme al artículo 2.6.6.8 del Decreto 1075 de 2015, expedido por el Ministerio de Educación Nacional.
                </p>
              </div>

              <div className="w-full lg:w-[420px] flex-shrink-0 mt-4 lg:mt-[67px] flex justify-end">
                <Dialog>
                  <DialogTrigger className="w-full text-left px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors border-l-4 border-yellow-400 backdrop-blur-xl shadow-lg outline-none rounded-none cursor-pointer">
                    <strong className="text-yellow-300 text-sm block">Información Legal Importante</strong>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-foreground text-background border-yellow-500/30 rounded-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400 text-xl font-bold">Información Legal Importante</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 text-sm leading-relaxed max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                      <p className="mb-4">
                        Al inscribirse en nuestros diplomados, el estudiante acepta los términos y condiciones de la institución. 
                        Todos nuestros programas cumplen con las normativas vigentes del Ministerio de Educación Nacional y están sujetos 
                        a las regulaciones de la Secretaría de Educación correspondiente. La institución se reserva el derecho de 
                        modificar las fechas de inicio, los contenidos curriculares y el cuerpo docente según sea necesario para 
                        garantizar la excelencia académica. Las certificaciones emitidas son de asistencia y participación, 
                        salvo que se indique explícitamente lo contrario para programas formales.
                      </p>
                      <p>
                        El presente documento constituye el acuerdo integral entre el estudiante y la institución. 
                        Cualquier modificación a estos términos deberá realizarse por escrito y contar con la aprobación de la dirección académica. 
                        Para información más detallada sobre las políticas de reembolso, retiro voluntario o cancelación de matrícula, 
                        por favor consulte nuestro Manual de Convivencia y Reglamento Estudiantil vigente. 
                        El uso de la plataforma educativa virtual y sus recursos asociados implica la aceptación total de nuestras políticas de privacidad y uso de datos.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
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

      <div className="container mx-auto px-4 mt-8 relative z-20">
        <ProgramInfoDialog type="diplomados" />
      </div>

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
