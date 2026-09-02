import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { 
  BookOpen, Award, Clock, Video, CheckCircle, 
  Lock, PlayCircle, ChevronLeft, Flame, FileText,
  AlertCircle
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import * as motion from "framer-motion/client"
import path from "path"
import { CoursePayment } from "@/components/course-payment"
import fs from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AulaPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session) redirect("/login")

  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  // 1. Fetch course
  const { data: course } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .maybeSingle()

  if (!course) notFound()

  const isDiplomado = course.type !== 'etdh';

  // 2. Verify enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, course_groups(id, name, whatsapp_link)")
    .eq("user_id", session.userId)
    .eq("course_id", course.id)
    .maybeSingle()

  if (!enrollment) {
      if (isDiplomado) {
          redirect(`/diplomados/${course.id}`)
      } else {
          redirect(`/formacion-academica/${course.id}`)
      }
  }

  const groupId = enrollment.group_id

  // 3. Fetch live classes for this group (only for ETDH)
  let liveClasses: any[] = []
  if (!isDiplomado && groupId) {
    const { data: classesData } = await supabase
      .from("live_classes")
      .select("*, class_recordings(file_url)")
      .eq("group_id", groupId)
      .order("scheduled_at", { ascending: true })
    liveClasses = classesData || []
  }

  // 4. Fetch student progress (approved exams)
  const { data: progressData } = await supabase
    .from("progress")
    .select("module_id, score, completed")
    .eq("user_id", session.userId)
    .eq("course_id", course.id)

  const approvedModuleIds = new Set(
    (progressData || []).filter(p => p.completed).map(p => p.module_id)
  )
  const scoreMap = new Map(
    (progressData || []).map(p => [p.module_id, p.score])
  )

  // 5. Build modules list
  const totalModules = course.modules || 1
  const courseModules = Array.from({ length: totalModules }).map((_, i) => {
    const docName = `Modulo ${i + 1} - ${course.id}.pdf`
    const filePath = path.join(process.cwd(), "diplomados", docName)
    const fileExists = fs.existsSync(filePath)
    return { id: `mod-${i + 1}`, index: i, title: `Módulo ${i + 1}`, docName, fileExists }
  })

  const completedCount = approvedModuleIds.size
  const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100))
  const isEligibleForCert = totalModules > 0 && (completedCount / totalModules) >= 0.8;

  const groupName = isDiplomado ? "Modalidad de Autoestudio" : (Array.isArray(enrollment.course_groups)
    ? enrollment.course_groups[0]?.name
    : (enrollment.course_groups as any)?.name ?? "Tu grupo")

  const now = new Date()

  // Diplomado Expiration Check
  let isExpired = false;
  if (isDiplomado && enrollment.created_at) {
      const enrollmentDate = new Date(enrollment.created_at);
      const oneMonthLater = new Date(enrollmentDate);
      oneMonthLater.setDate(oneMonthLater.getDate() + 30);
      if (now > oneMonthLater && !isEligibleForCert) {
          isExpired = true;
      }
  }

  return (
    <div className="space-y-8 animate-fade-up pt-6 md:pt-8">

      {/* Header */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="bg-[oklch(0.30_0.10_145)] px-6 py-5 text-white">
          <Link href="/estudiante/cursos" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Mis Cursos
          </Link>
          <h1 className="text-2xl font-bold leading-tight">{course.title}</h1>
          <p className="text-white/70 text-sm mt-1">{groupName}</p>
        </div>
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[oklch(0.35_0.10_145)]">Tu progreso general</span>
              <span className="text-xs font-bold text-[oklch(0.30_0.10_145)]">{completedCount}/{totalModules} módulos aprobados · {progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-[oklch(0.30_0.10_145)] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${enrollment.payment_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {enrollment.payment_verified ? '✓ Pago verificado' : '⏳ Pago pendiente'}
          </span>
        </div>
      </div>

      {!enrollment.payment_verified ? (
        <CoursePayment courseId={course.id} programName={course.title} />
      ) : (
        <>
          {isExpired && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-center sm:items-start text-red-800">
                <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />
                <div className="flex-grow space-y-2 text-center sm:text-left">
                    <h3 className="font-bold text-xl text-red-700">Tiempo límite expirado</h3>
                    <p className="text-sm">El plazo de 30 días para completar tu diplomado ha finalizado y el contenido ha sido bloqueado. Para revisar opciones de extensión, por favor contacta a tu profesor directamente.</p>
                    <div className="pt-2">
                        <a href="https://wa.me/1234567890?text=Hola,%20mi%20tiempo%20para%20terminar%20el%20diplomado%20expiró" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-sm">
                            Contactar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
          )}

      {/* Section 1: Live Classes (Only for ETDH) */}
      {!isDiplomado && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[oklch(0.25_0.10_145)]">Clases en Vivo y Grabaciones</h2>
            </div>

            {liveClasses.length === 0 ? (
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-8 text-center text-[oklch(0.55_0.04_145)]">
                <Video className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Aún no hay clases programadas para tu grupo.</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {liveClasses.map((cls) => {
                  const dateObj = new Date(cls.scheduled_at)
                  const timeStr = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                  const dateStr = dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
                  const endTimeStr = cls.scheduled_end_at 
                    ? new Date(cls.scheduled_end_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) 
                    : null
                  const isFinished = cls.status === 'finished'
                  const isLive = cls.status === 'in_progress'
                  const fifteenMinsBefore = new Date(dateObj.getTime() - 15 * 60000)
                  const isTooEarly = now < fifteenMinsBefore && !isFinished && !isLive
                  const recordingUrl = Array.isArray(cls.class_recordings) 
                    ? cls.class_recordings[0]?.file_url 
                    : cls.class_recordings?.file_url

                  return (
                    <div key={cls.id} className="bg-white border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg leading-tight text-[oklch(0.25_0.10_145)]">{cls.title}</h3>
                        {isLive ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 uppercase tracking-wider animate-pulse rounded">En Vivo</span>
                        ) : isFinished ? (
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded">Finalizada</span>
                        ) : (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded">Programada</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-sm text-[oklch(0.55_0.04_145)] mb-5 flex-grow">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{dateStr} · {timeStr}{endTimeStr ? ` a ${endTimeStr}` : ''}</span>
                        </div>
                        {cls.description && <p className="text-xs mt-2 line-clamp-2">{cls.description}</p>}
                      </div>
                      
                      {isFinished ? (
                        recordingUrl ? (
                          <a href={recordingUrl} target="_blank" rel="noreferrer"
                            className="w-full text-center py-2 text-sm font-bold bg-secondary text-white hover:bg-secondary/90 transition-colors rounded-lg flex justify-center items-center gap-2">
                            <Video className="w-4 h-4" /> Ver Grabación
                          </a>
                        ) : (
                          <span className="w-full text-center py-2 text-sm font-bold bg-gray-100 text-amber-600 border border-gray-200 rounded-lg">Grabación no disponible aún</span>
                        )
                      ) : isTooEarly ? (
                        <div className="w-full text-center py-2 text-sm font-bold bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 rounded-lg">
                          Se abre a las {fifteenMinsBefore.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <Link href={`/diplomados/${course.id}/clase/${cls.id}`}
                          className="w-full text-center py-2 text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg flex justify-center items-center gap-2">
                          <PlayCircle className="w-4 h-4" /> Entrar a la Sala
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
      )}

      {/* Sections 2 & 3: Modules + Exams side by side with Animated Design */}
      <div className="mt-12">
        {/* Headers (Desktop only) */}
        <div className="hidden lg:grid grid-cols-2 gap-8 mb-6">
          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="p-2 bg-primary text-white shadow-lg shadow-primary/20 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-primary">Módulos de Estudio</h3>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/10 rounded-lg">
            <div className="p-2 bg-secondary text-white shadow-lg shadow-secondary/20 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[oklch(0.25_0.10_145)]">Exámenes</h3>
          </div>
        </div>

        {/* Rows of Modules and Exams */}
        <div className="space-y-6">
          {courseModules.map((mod, index) => {
            const isFirstModule = index === 0;
            const previousModId = index > 0 ? courseModules[index - 1].id : null;
            const isPreviousApproved = isFirstModule || (previousModId ? approvedModuleIds.has(previousModId) : false);
            const isThisApproved = approvedModuleIds.has(mod.id);
            const score = scoreMap.get(mod.id);

            return (
              <div key={mod.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isExpired ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Mobile Header: Módulos (only before first item) */}
                {isFirstModule && (
                  <div className="lg:hidden flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-lg mb-[-1rem]">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-primary">Módulos de Estudio</h3>
                  </div>
                )}
                
                {/* Module Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-xl border transition-all group h-full flex flex-col ${
                    approvedModuleIds.has(mod.id) ? 'bg-green-50/50 border-green-200' :
                    !isPreviousApproved ? 'bg-gray-50 border-gray-100 opacity-60' :
                    'bg-white border-[oklch(0.88_0.04_145)] hover:border-primary/30 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      approvedModuleIds.has(mod.id) ? 'text-green-700' : 
                      !isPreviousApproved ? 'text-gray-500' : 'text-secondary'
                    }`}>
                      Unidad {index + 1}
                    </span>
                    {approvedModuleIds.has(mod.id) && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Aprobado
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold mb-3 transition-colors flex-grow ${
                    !isPreviousApproved ? 'text-gray-500' : 'group-hover:text-primary'
                  }`}>
                    {mod.title}
                  </h4>
                  
                  <div className="mt-4">
                    {isPreviousApproved && mod.fileExists ? (
                      <Link 
                        href={`/diplomados/${course.id}/vista/${mod.docName}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                      >
                        <BookOpen className="w-3 h-3" /> Ver PDF del Módulo
                      </Link>
                    ) : isPreviousApproved && !mod.fileExists ? (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-600">
                        <Clock className="w-3 h-3" /> Material próximamente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Lock className="w-3 h-3" /> Aprueba el examen anterior
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Mobile Header: Exámenes (only before first item) */}
                {isFirstModule && (
                  <div className="lg:hidden flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/10 rounded-lg mt-4 mb-[-1rem]">
                    <Award className="w-5 h-5 text-[oklch(0.25_0.10_145)]" />
                    <h3 className="text-xl font-bold text-[oklch(0.25_0.10_145)]">Exámenes</h3>
                  </div>
                )}

                {/* Exam Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-xl border transition-all group h-full flex flex-col ${
                    isThisApproved ? 'bg-green-50/50 border-green-200' :
                    !isPreviousApproved ? 'bg-gray-50 border-gray-100 opacity-60' :
                    'bg-white border-secondary/20 hover:border-secondary/50 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      isThisApproved ? 'text-green-700' : 
                      !isPreviousApproved ? 'text-gray-500' : 'text-primary'
                    }`}>
                      Eval. {index + 1}
                    </span>
                    {isThisApproved && score !== undefined && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> {score}%
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold mb-3 transition-colors flex-grow ${
                    !isPreviousApproved ? 'text-gray-500' : 'group-hover:text-secondary'
                  }`}>
                    Examen {mod.title}
                  </h4>
                  
                  <div className="mt-4">
                    {isThisApproved ? (
                      <span className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-green-700 bg-green-100 py-2.5 rounded-lg">
                        <CheckCircle className="w-4 h-4" /> Completado exitosamente
                      </span>
                    ) : isPreviousApproved ? (
                      <Link 
                        href={`/diplomados/${course.id}/exam/${mod.id}`}
                        className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-white bg-secondary hover:bg-secondary/90 py-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <Award className="w-4 h-4" /> Iniciar Examen
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-gray-500 bg-gray-200 py-2.5 rounded-lg opacity-70 cursor-not-allowed">
                        <Lock className="w-4 h-4" /> Bloqueado
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
      </>
      )}

      {/* Footer branding */}
      <div className="pt-4 text-center text-xs text-[oklch(0.65_0.04_145)]">
        <a href="https://www.kytcode.lat" target="_blank" rel="noopener noreferrer"
          className="hover:text-[oklch(0.30_0.10_145)] transition-colors">
          Desarrollado por K&T <span className="text-black">❤</span>
        </a>
      </div>

    </div>
  )
}
