import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { BookOpen, GraduationCap, Clock, Banknote, Flame, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminCursosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true })

  // Obtener conteo de inscritos por curso
  const courseEnrollmentCounts: Record<string, number> = {}
  if (courses && courses.length > 0) {
    const enrollmentCounts = await Promise.all(
      courses.map((c) =>
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("course_id", c.id)
      )
    )
    courses.forEach((c, i) => {
      courseEnrollmentCounts[c.id] = enrollmentCounts[i].count ?? 0
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Cursos</h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm">Administra el catálogo de diplomados y programas disponibles.</p>
        </div>
        <a href="/admin/cursos/crear" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
          + Crear Curso
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((c) => {
          const enrolled = courseEnrollmentCounts[c.id] ?? 0
          const min = c.min_students ?? 5
          const ready = enrolled >= min
          const pct = Math.min(100, Math.round((enrolled / min) * 100))

          return (
            <div key={c.id} className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden relative">
                <img src={c.image || "/placeholder.svg"} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-white font-bold">{c.price}</span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded border border-white/30">{c.category}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-[oklch(0.25_0.10_145)] line-clamp-2 mb-2 leading-snug">{c.title}</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.04_145)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.04_145)]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{c.modules} módulos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.04_145)]">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{enrolled} inscritos totales</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-[oklch(0.97_0.01_145)] p-3 rounded-lg border border-[oklch(0.92_0.02_145)]">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {ready ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Flame className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${ready ? 'text-green-700' : 'text-amber-700'}`}>
                          {ready ? 'Listo para iniciar' : 'Cupos'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold ${ready ? 'text-green-700' : 'text-amber-700'}`}>{enrolled}/{min}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-black/5">
                      <div className={`h-1.5 rounded-full transition-all duration-700 ${ready ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {(!courses || courses.length === 0) && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-[oklch(0.88_0.04_145)]">
            <BookOpen className="w-12 h-12 text-[oklch(0.80_0.04_145)] mx-auto mb-4" />
            <p className="text-[oklch(0.55_0.04_145)]">No hay cursos en la base de datos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
