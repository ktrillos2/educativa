import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { Users, BookOpen, GraduationCap, TrendingUp, UserPlus, Activity, Flame, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  // Métricas reales desde Supabase
  const [
    { count: totalStudents },
    { count: totalEnrollments },
    { data: recentUsers },
    { data: courses },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
    supabase.from("users").select("name, email, created_at").eq("role", "user").order("created_at", { ascending: false }).limit(5),
    supabase.from("courses").select("id, title, duration, category, price, min_students").order("created_at", { ascending: true }),
  ])

  const totalCourses = courses?.length ?? 0

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

  const stats = [
    {
      label: "Total Estudiantes",
      value: totalStudents ?? 0,
      description: "Registrados en la plataforma",
      icon: Users,
      color: "bg-[oklch(0.30_0.10_145)]",
    },
    {
      label: "Cursos Activos",
      value: totalCourses,
      description: "Disponibles en el catálogo",
      icon: BookOpen,
      color: "bg-[oklch(0.45_0.12_145)]",
    },
    {
      label: "Inscripciones",
      value: totalEnrollments ?? 0,
      description: "Total acumulado",
      icon: GraduationCap,
      color: "bg-[oklch(0.72_0.14_85)]",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-[oklch(0.50_0.06_145)] text-sm mt-1">
            Bienvenido, <span className="font-semibold text-[oklch(0.35_0.10_145)]">{session?.name}</span>. Aquí puedes gestionar toda la plataforma.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[oklch(0.30_0.10_145)]/8 text-[oklch(0.30_0.10_145)] px-4 py-2 rounded-lg text-sm font-medium">
          <Activity className="w-4 h-4" />
          Sistema activo
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, description, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
            <div className={`${color} px-5 py-4 flex items-center justify-between`}>
              <p className="text-white/90 text-sm font-medium">{label}</p>
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-4xl font-bold text-[oklch(0.25_0.10_145)]">{value}</p>
              <p className="text-[oklch(0.55_0.04_145)] text-xs mt-1">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lower panels ── */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Últimos estudiantes */}
        <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[oklch(0.92_0.02_145)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[oklch(0.30_0.10_145)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[oklch(0.25_0.10_145)] text-sm">Últimos Registros</h2>
              <p className="text-[oklch(0.55_0.04_145)] text-xs">Estudiantes registrados recientemente</p>
            </div>
          </div>
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <div key={u.email} className="px-5 py-3 flex items-center justify-between hover:bg-[oklch(0.97_0.01_145)] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.30_0.10_145)]">{u.name}</p>
                    <p className="text-xs text-[oklch(0.55_0.04_145)]">{u.email}</p>
                  </div>
                  <span className="text-xs text-[oklch(0.60_0.04_145)]">
                    {new Date(u.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <Users className="w-10 h-10 text-[oklch(0.80_0.04_145)] mx-auto mb-3" />
                <p className="text-[oklch(0.55_0.04_145)] text-sm">Aún no hay estudiantes registrados.</p>
              </div>
            )}
          </div>
        </div>

        {/* Cursos con progreso de cupos */}
        <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[oklch(0.92_0.02_145)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.14_85)]/15 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[oklch(0.55_0.14_85)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[oklch(0.25_0.10_145)] text-sm">Cursos — Estado de Cupos</h2>
              <p className="text-[oklch(0.55_0.04_145)] text-xs">Progreso de inscripciones por diplomado</p>
            </div>
          </div>
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {courses && courses.length > 0 ? courses.map((c) => {
              const enrolled = courseEnrollmentCounts[c.id] ?? 0
              const min = c.min_students ?? 15
              const pct = Math.min(100, Math.round((enrolled / min) * 100))
              const ready = enrolled >= min
              return (
                <div key={c.id} className="px-5 py-4 hover:bg-[oklch(0.97_0.01_145)] transition-colors">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[oklch(0.30_0.10_145)] truncate">{c.title}</p>
                      <p className="text-xs text-[oklch(0.55_0.04_145)]">{c.duration} · {c.category} · {c.price}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {ready
                        ? <CheckCircle className="w-4 h-4 text-green-600" />
                        : <Flame className="w-4 h-4 text-amber-500" />
                      }
                      <span className={`text-xs font-bold ${ready ? 'text-green-700' : 'text-amber-700'}`}>
                        {enrolled}/{min}
                      </span>
                    </div>
                  </div>
                  {/* Barra de progreso */}
                  <div className="w-full bg-[oklch(0.93_0.01_145)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${ready ? 'bg-green-500' : 'bg-amber-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={`text-[10px] mt-1 ${ready ? 'text-green-600' : 'text-amber-600'}`}>
                    {ready ? '✓ Cupos mínimos alcanzados — listo para iniciar' : `Faltan ${min - enrolled} para iniciar el grupo`}
                  </p>
                </div>
              )
            }) : (
              <div className="py-10 text-center">
                <BookOpen className="w-10 h-10 text-[oklch(0.80_0.04_145)] mx-auto mb-3" />
                <p className="text-[oklch(0.55_0.04_145)] text-sm">No hay cursos en el catálogo.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
