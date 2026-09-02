import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { diplomados } from "@/lib/data"
import { Award, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CertificadosPage(
  props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const session = await getSession()
  const supabase = createAdminClient()
  const searchParams = await props.searchParams

  // Verificar si venimos de Openpay (fallback si el webhook no llega rápido o en localhost)
  // Openpay devuelve a esta URL agregando el parámetro ?id=trx_...
  if (searchParams?.id) {
    // Openpay pasa su propio 'id' de transacción. Como no tenemos webhooks en local, 
    // buscamos la orden PENDIENTE más reciente del usuario y la marcamos como pagada.
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", session?.userId ?? "")
      .eq("status", "PENDING")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      
    if (order) {
      await supabase.from("orders").update({ status: "PAID" }).eq("id", order.id)
      await supabase.from("enrollments").update({ payment_verified: true }).eq("user_id", order.user_id).eq("course_id", order.course_id)
    }
    // Redirigir para limpiar la URL
    redirect("/estudiante/certificados")
  }

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
