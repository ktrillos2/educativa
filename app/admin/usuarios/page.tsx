import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { Users, Mail, Phone, Calendar, BookOpen, FileText, ShieldCheck, GraduationCap } from "lucide-react"
import Link from "next/link"
import { ForceApproveButton } from "./force-approve-button"
import { UserProgressDialog } from "./user-progress-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsuariosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const [
    { data: allUsers },
    { data: enrollments },
    { data: courses },
    { data: progress }
  ] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("enrollments").select("*"),
    supabase.from("courses").select("*"),
    supabase.from("progress").select("*")
  ])

  // Separar estudiantes de administradores
  const students = (allUsers || []).filter(u => u.role !== 'admin' && u.role !== 'ADMIN')
  const admins = (allUsers || []).filter(u => u.role === 'admin' || u.role === 'ADMIN')

  const courseMap = new Map((courses || []).map(c => [c.id, c]))
  
  const userEnrollments = new Map<string, any[]>()
  enrollments?.forEach(e => {
    if (!userEnrollments.has(e.user_id)) userEnrollments.set(e.user_id, [])
    userEnrollments.get(e.user_id)!.push(e)
  })

  const userProgress = new Map<string, any[]>()
  progress?.forEach(p => {
    const key = `${p.user_id}-${p.course_id}`
    if (!userProgress.has(key)) userProgress.set(key, [])
    userProgress.get(key)!.push(p)
  })

  return (
    <div className="space-y-8 animate-fade-in pb-12 pt-6">
      {/* ── Encabezado principal ── */}
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Usuarios</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Supervisa el equipo administrativo y el progreso académico de los estudiantes.</p>
      </div>

      {/* ── 1. Información del Administrador (Sin campos académicos ni fichas) ── */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[oklch(0.30_0.10_145)]" />
            <h2 className="font-bold text-sm text-[oklch(0.25_0.10_145)] uppercase tracking-wider">
              Equipo de Administración
            </h2>
          </div>
          <span className="text-xs bg-[oklch(0.30_0.10_145)] text-white px-2.5 py-0.5 rounded-full font-semibold">
            {admins.length} {admins.length === 1 ? 'Administrador' : 'Administradores'}
          </span>
        </div>

        <div className="divide-y divide-[oklch(0.94_0.01_145)]">
          {admins.map((admin) => (
            <div key={admin.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[oklch(0.30_0.10_145)]/10 text-[oklch(0.30_0.10_145)] flex items-center justify-center font-bold text-lg">
                  {admin.name?.charAt(0) || "A"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base text-[oklch(0.25_0.10_145)]">{admin.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[oklch(0.30_0.10_145)] text-white">
                      Administrador
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[oklch(0.50_0.04_145)] mt-1">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {admin.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Registrado: {new Date(admin.created_at).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[oklch(0.55_0.04_145)] italic bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                Acceso total a la gestión del sistema
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Tabla de Estudiantes (Aquí vive exclusivamente el Estado Académico y Fichas) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[oklch(0.45_0.12_145)]" />
            <h2 className="font-bold text-lg text-[oklch(0.25_0.10_145)]">
              Estudiantes Matriculados y Progreso Académico
            </h2>
          </div>
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">
            {students.length} {students.length === 1 ? 'Estudiante' : 'Estudiantes'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-1/4">Nombre y Documento</th>
                  <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-1/5">Contacto</th>
                  <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-2/5">Estado Académico (Cursos y Pagos)</th>
                  <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.94_0.01_145)]">
                {students.map((u) => {
                  const uEnrollments = userEnrollments.get(u.id) || []
                  const uProgressList = progress?.filter(p => p.user_id === u.id) || []
                  return (
                    <tr key={u.id} className="hover:bg-[oklch(0.98_0.01_145)] transition-colors align-top">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[oklch(0.25_0.10_145)]">{u.name}</p>
                        <p className="text-xs text-[oklch(0.55_0.04_145)] mt-0.5">CC: {u.document || 'N/A'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {u.id_document_url && (
                            <a href={u.id_document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-md transition-colors border border-gray-200">
                              <FileText className="w-3.5 h-3.5" />
                              Ver Cédula
                            </a>
                          )}
                          <a href={`/admin/usuarios/ficha/${u.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-colors border" style={{background: 'oklch(0.95 0.06 85)', color: 'oklch(0.45 0.12 85)', borderColor: 'oklch(0.82 0.10 85)'}}>
                            <BookOpen className="w-3.5 h-3.5" />
                            Ficha
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[oklch(0.45_0.08_145)] mb-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]" title={u.email}>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-[oklch(0.45_0.08_145)] text-xs">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {uEnrollments.length > 0 ? (
                          <div className="space-y-2">
                            {uEnrollments.map(e => {
                              const course = courseMap.get(e.course_id)
                              const prog = userProgress.get(`${u.id}-${e.course_id}`) || []
                              const totalModules = course?.modules || 4
                              const uniqueCompletedModules = new Set(
                                prog.filter(p => p.completed).map(p => String(p.module_id).replace('modulo-', 'mod-'))
                              ).size
                              const completedModules = Math.min(uniqueCompletedModules, totalModules)
                              const isCompleted = totalModules > 0 && (completedModules / totalModules) >= 0.8
                              
                              return (
                                <div key={e.id} className="p-2.5 bg-[oklch(0.97_0.01_145)] border border-[oklch(0.90_0.02_145)] rounded-lg">
                                  <p className="font-bold text-[oklch(0.30_0.10_145)] text-xs mb-1.5 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    {course?.title || 'Curso desconocido'}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                      e.payment_verified 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                      {e.payment_verified ? 'Pago Verificado' : 'Pago Pendiente'}
                                    </span>
                                    
                                    <UserProgressDialog 
                                      user={u} 
                                      enrollments={uEnrollments} 
                                      coursesMap={courseMap} 
                                      progressList={uProgressList}
                                      trigger={
                                        <button 
                                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all cursor-pointer flex items-center gap-1 hover:scale-105 ${
                                            isCompleted 
                                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                          }`}
                                          title="Haz clic para ver el desglose detallado de exámenes y respuestas"
                                        >
                                          <BookOpen className="w-3 h-3" />
                                          Progreso: {completedModules}/{totalModules}
                                        </button>
                                      }
                                    />
                                    {isCompleted && e.payment_verified && (
                                      <>
                                        <Link 
                                          href={`${course?.type === 'etdh' ? '/formacion-academica' : '/diplomados'}/${e.course_id}/certificado?studentId=${u.id}`}
                                          target="_blank"
                                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          Certificado 🎓
                                        </Link>
                                        <Link 
                                          href={`${course?.type === 'etdh' ? '/formacion-academica' : '/diplomados'}/${e.course_id}/acta?studentId=${u.id}&download=true`}
                                          target="_blank"
                                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          Descargar Acta 📄
                                        </Link>
                                      </>
                                    )}
                                    <ForceApproveButton userId={u.id} courseId={e.course_id} totalModules={totalModules} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-[oklch(0.55_0.04_145)] italic">Sin inscripciones activas</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[oklch(0.50_0.04_145)]">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(u.created_at).toLocaleDateString("es-CO")}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <Users className="w-10 h-10 text-[oklch(0.80_0.04_145)] mx-auto mb-2" />
                        <p className="text-sm font-semibold text-[oklch(0.35_0.10_145)]">
                          No hay estudiantes registrados todavía
                        </p>
                        <p className="text-xs text-[oklch(0.55_0.04_145)] leading-relaxed">
                          La plataforma está lista para producción. Cuando los estudiantes se registren e inscriban en los diplomados, aparecerán aquí con su estado de pago, seguimiento de módulos y opciones de certificación.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
