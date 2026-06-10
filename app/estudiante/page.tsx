import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { diplomados } from "@/lib/data"
import { BookOpen, Award, Clock, GraduationCap, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function EstudiantePage() {
  const session = await getSession()
  const supabase = createAdminClient()

  // Inscripciones reales del estudiante
  const { data: enrollments, count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact" })
    .eq("user_id", session?.userId ?? "")

  // Enriquecer inscripciones con datos del diplomado estático
  const enrichedEnrollments = (enrollments ?? []).map((e) => {
    const course = diplomados.find((d) => d.id === e.course_id)
    return { ...e, courseTitle: course?.title ?? `Diplomado (${e.course_id})`, courseCategory: course?.category ?? "" }
  })

  const stats = [
    {
      label: "Cursos Activos",
      value: enrollmentCount ?? 0,
      description: "Matriculados actualmente",
      icon: BookOpen,
      color: "bg-[oklch(0.30_0.10_145)]",
    },
    {
      label: "Horas de Estudio",
      value: 0,
      description: "Total de horas completadas",
      icon: Clock,
      color: "bg-[oklch(0.45_0.12_145)]",
    },
    {
      label: "Certificados",
      value: 0,
      description: "Listos para descargar",
      icon: Award,
      color: "bg-[oklch(0.72_0.14_85)]",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] tracking-tight">
            ¡Hola, {session?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-[oklch(0.50_0.06_145)] text-sm mt-1">
            Bienvenido a tu panel de estudiante. Aquí puedes ver tu progreso y acceder a tus cursos.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[oklch(0.30_0.10_145)]/8 text-[oklch(0.30_0.10_145)] px-4 py-2 rounded-lg text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          ¡Sigue aprendiendo!
        </div>
      </div>

      {/* ── Stats ── */}
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

      {/* ── Mis cursos ── */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[oklch(0.92_0.02_145)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[oklch(0.30_0.10_145)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[oklch(0.25_0.10_145)] text-sm">Mis Cursos</h2>
              <p className="text-[oklch(0.55_0.04_145)] text-xs">Diplomados en los que estás inscrito</p>
            </div>
          </div>
          <Link
            href="/diplomados"
            className="text-xs text-[oklch(0.35_0.10_145)] font-medium hover:underline flex items-center gap-1"
          >
            Ver catálogo <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {enrichedEnrollments.length > 0 ? (
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {enrichedEnrollments.map((e) => (
              <div key={e.id} className="px-5 py-4 flex items-center justify-between hover:bg-[oklch(0.97_0.01_145)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-[oklch(0.30_0.10_145)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.30_0.10_145)]">{e.courseTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {e.courseCategory && (
                        <span className="text-xs text-[oklch(0.55_0.04_145)]">{e.courseCategory}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.payment_verified ? "bg-[oklch(0.30_0.10_145)]/10 text-[oklch(0.30_0.10_145)]" : "bg-[oklch(0.72_0.14_85)]/15 text-[oklch(0.50_0.14_85)]"}`}>
                        {e.payment_verified ? "✓ Pago verificado" : "⏳ Pendiente de pago"}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[oklch(0.70_0.04_145)]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.30_0.10_145)]/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[oklch(0.35_0.10_145)]" />
            </div>
            <h3 className="text-base font-semibold text-[oklch(0.25_0.10_145)] mb-1">Empieza tu aprendizaje</h3>
            <p className="text-[oklch(0.55_0.04_145)] text-sm mb-5">
              Explora nuestro catálogo y encuentra el diplomado perfecto para ti.
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
