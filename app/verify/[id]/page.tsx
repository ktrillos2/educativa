import { createAdminClient } from "@/utils/supabase/admin"
import { CheckCircle, XCircle, Award, Calendar, BookOpen, User } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function VerifyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = createAdminClient()

  // params.id is the enrollment ID
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select(`
      id, payment_verified, created_at,
      course_id,
      users (id, name, document)
    `)
    .eq("id", params.id)
    .maybeSingle()

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 text-center max-w-md w-full mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Certificado No Encontrado</h1>
          <p className="text-gray-600 mb-6">El código escaneado no corresponde a un certificado válido en nuestra base de datos.</p>
          <Link href="/" className="text-primary font-bold hover:underline">Ir a la página principal</Link>
        </div>
      </div>
    )
  }

  // Handle nested joins from postgrest correctly (arrays or single objects)
  const user = Array.isArray(enrollment.users) ? enrollment.users[0] : enrollment.users
  
  // Fetch course info separately since there is no FK constraint
  const { data: course } = await supabase
    .from("courses")
    .select("title, duration, modules")
    .eq("id", enrollment.course_id)
    .maybeSingle()

  // Verify progress
  const { data: progress } = await supabase
    .from("progress")
    .select("id")
    .eq("user_id", user?.id)
    .eq("course_id", enrollment.course_id)
    .eq("completed", true)

  const completedModules = progress?.length || 0
  const totalModules = course?.modules || 1
  const isEligible = completedModules >= 4 || (completedModules / totalModules) >= 0.8
  
  // The certificate is only strictly valid if they are eligible and payment verified
  const isValid = enrollment.payment_verified && isEligible

  return (
    <div className="min-h-screen bg-muted/10 pt-32 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className={`p-8 text-white text-center ${isValid ? 'bg-primary' : 'bg-red-600'}`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {isValid ? <CheckCircle className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-3xl font-extrabold mb-2">
            {isValid ? 'Certificado Válido' : 'Certificado Inválido'}
          </h1>
          <p className="text-white/90 text-sm">
            {isValid 
              ? 'Este documento fue emitido oficialmente por la Academia de Formación Líderes del Mérito.' 
              : 'Este certificado no cumple con los requisitos de graduación o el pago no está verificado.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Otorgado a</p>
              <p className="text-xl font-bold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">Documento: {user?.document}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg shrink-0">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Programa</p>
              <p className="text-xl font-bold text-secondary-dark">{course?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="block text-xs text-muted-foreground">Fecha de Emisión</span>
                <span className="font-semibold">{new Date(enrollment.created_at).toLocaleDateString('es-CO')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="block text-xs text-muted-foreground">Intensidad</span>
                <span className="font-semibold">{course?.duration || '70 horas'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Para dudas sobre la autenticidad de este certificado, por favor contáctanos al correo academiadeformacion@lideresdelmerito.edu.co.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Conocer la Academia
          </Link>
        </div>
      </div>
    </div>
  )
}
