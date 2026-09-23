import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { diplomados } from "@/lib/data"
import { BookOpen, ChevronRight, GraduationCap, Trophy } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CursosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

  // Inscripciones reales del estudiante
  let enrollments: any[] = []
  if (session?.userId) {
    const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", session.userId)
    enrollments = data || []
  }

  // Cursos desde la base de datos
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, category, modules")

  if (isMockPaid && session?.userId && courses) {
      // Add a mock enrollment for every course for testing
      const mockEnrollments = courses.map(c => ({
          id: `mock-${c.id}`,
          user_id: session.userId,
          course_id: c.id,
          payment_verified: true,
          created_at: new Date().toISOString()
      }))
      enrollments = [...enrollments, ...mockEnrollments]
  }

  // Progreso del estudiante
  const { data: progress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session?.userId ?? "")
    .eq("completed", true)

  // Enriquecer inscripciones con progreso y datos del diplomado (DB o estático)
  const enrichedEnrollments = (enrollments ?? []).map((e) => {
    const course = courses?.find((d) => String(d.id) === String(e.course_id)) || diplomados.find((d) => String(d.id) === String(e.course_id))
    const courseProgress = progress?.filter(p => String(p.course_id) === String(e.course_id)) || []
    const completedModules = courseProgress.length
    const totalModules = course?.modules || 4
    const progressPercent = Math.min(100, Math.round((completedModules / totalModules) * 100))

    const nextModuleIndex = Math.min(completedModules, totalModules - 1)
    const nextDocName = `Modulo ${nextModuleIndex + 1} - ${e.course_id}.pdf`

    const isEtdh = course?.title?.includes("PROGRAMA ACADÉMICO") || (course as any)?.type === "etdh"
    const courseTitle = isEtdh ? course?.title : "Diplomado en Gestión del Presupuesto Público"

    return { 
      ...e, 
      courseTitle: courseTitle ?? `Diplomado (${e.course_id})`, 
      courseCategory: course?.category ?? "Gestión",
      completedModules,
      totalModules,
      progressPercent,
      nextDocName
    }
  })

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] tracking-tight">Mis Cursos</h1>
          <p className="text-[oklch(0.50_0.06_145)] text-sm mt-1">
            Aquí encontrarás todos los diplomados en los que te has inscrito.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        {enrichedEnrollments.length > 0 ? (
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {enrichedEnrollments.map((e) => (
              <div
                key={e.id}
                className="px-5 py-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-[oklch(0.97_0.01_145)] transition-colors gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[oklch(0.30_0.10_145)]/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-[oklch(0.30_0.10_145)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[oklch(0.30_0.10_145)] group-hover:text-[oklch(0.25_0.10_145)] transition-colors">{e.courseTitle}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                      {e.courseCategory && (
                        <span className="text-xs text-[oklch(0.55_0.04_145)] font-medium bg-gray-100 px-2 py-0.5 rounded-sm">{e.courseCategory}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${e.payment_verified ? "bg-[oklch(0.30_0.10_145)]/10 text-[oklch(0.30_0.10_145)]" : "bg-[oklch(0.72_0.14_85)]/15 text-[oklch(0.50_0.14_85)]"}`}>
                        {e.payment_verified ? "✓ Pago verificado" : "⏳ Pendiente de pago"}
                      </span>
                    </div>

                    <div className="w-full max-w-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[oklch(0.35_0.10_145)] flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-500" /> Progreso
                        </span>
                        <span className="text-xs font-bold text-[oklch(0.40_0.10_145)]">{e.progressPercent}% ({e.completedModules}/{e.totalModules} módulos)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-2 rounded-full bg-[oklch(0.30_0.10_145)] transition-all duration-1000" 
                          style={{ width: `${e.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 md:ml-4 flex flex-col sm:flex-row gap-3">
                  {(e.progressPercent >= 80 || e.completedModules >= 4) && (
                    <span
                      className="inline-flex"
                    >
                      <a
                        href={`/diplomados/${e.course_id}/certificado`}
                        className={`inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-md transition-colors ${
                          e.payment_verified
                            ? "bg-[oklch(0.30_0.10_145)]/10 text-[oklch(0.30_0.10_145)] hover:bg-[oklch(0.30_0.10_145)]/20"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        {e.payment_verified ? "Ver Certificado" : "Pagar Certificado"}
                      </a>
                    </span>
                  )}
                  <Link href={`/estudiante/cursos/${e.course_id}`} className="inline-flex items-center justify-center gap-2 bg-[oklch(0.30_0.10_145)] text-white text-sm font-bold px-5 py-2.5 rounded-md group-hover:bg-[oklch(0.25_0.10_145)] transition-colors">
                    Ir al Aula <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[oklch(0.35_0.10_145)]" />
            </div>
            <h3 className="text-base font-semibold text-[oklch(0.25_0.10_145)] mb-1">Aún no tienes cursos</h3>
            <p className="text-[oklch(0.55_0.04_145)] text-sm mb-5">
              Explora nuestro catálogo y empieza tu formación.
            </p>
            <Link
              href="/diplomados"
              className="inline-flex items-center gap-2 bg-[oklch(0.30_0.10_145)] hover:bg-[oklch(0.25_0.10_145)] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Ver Diplomados
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
