import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { diplomados } from "@/lib/data"
import { Award, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"

export default async function CertificadosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  // Inscripciones reales del estudiante donde el pago esté verificado
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", session?.userId ?? "")
    .eq("payment_verified", true)

  const enrichedEnrollments = (enrollments ?? []).map((e) => {
    const course = diplomados.find((d) => d.id === e.course_id)
    return { ...e, courseTitle: course?.title ?? `Diplomado (${e.course_id})` }
  })

  // We should also theoretically check progress, but for this view we can just show the ones with payment_verified
  // or link them to the certificate page where it validates progress.

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] tracking-tight">Mis Certificados</h1>
          <p className="text-[oklch(0.50_0.06_145)] text-sm mt-1">
            Aquí encontrarás los certificados de los diplomados que has completado.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        {enrichedEnrollments.length > 0 ? (
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {enrichedEnrollments.map((e) => (
              <div key={e.id} className="px-5 py-4 flex items-center justify-between hover:bg-[oklch(0.97_0.01_145)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[oklch(0.72_0.14_85)]/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[oklch(0.72_0.14_85)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.30_0.10_145)]">{e.courseTitle}</p>
                  </div>
                </div>
                <Link href={`/diplomados/${e.course_id}/certificado`} className="text-[oklch(0.30_0.10_145)] hover:underline flex items-center gap-1 text-sm font-medium">
                  Ver Estado <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.72_0.14_85)]/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[oklch(0.72_0.14_85)]" />
            </div>
            <h3 className="text-base font-semibold text-[oklch(0.25_0.10_145)] mb-1">Aún no tienes certificados</h3>
            <p className="text-[oklch(0.55_0.04_145)] text-sm mb-5">
              Completa los módulos de tus diplomados y realiza el pago para obtenerlos.
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
