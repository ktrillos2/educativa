import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { Users, Mail, Phone, Calendar, BookOpen, FileText } from "lucide-react"
import Link from "next/link"
import { ForceApproveButton } from "./force-approve-button"
import { UserProgressDialog } from "./user-progress-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsuariosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const [
    { data: users },
    { data: enrollments },
    { data: courses },
    { data: progress }
  ] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("enrollments").select("*"),
    supabase.from("courses").select("*"),
    supabase.from("progress").select("*")
  ])

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
    <div className="space-y-6 animate-fade-in pb-12 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Usuarios y Progreso</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Administra los estudiantes, verifica sus pagos y monitorea su avance académico.</p>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-1/4">Nombre y Documento</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-1/5">Contacto</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)] w-2/5">Estado Académico (Cursos y Pagos)</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Rol y Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.94_0.01_145)]">
              {users?.map((u) => {
                const uEnrollments = userEnrollments.get(u.id) || []
                const uProgressList = progress?.filter(p => p.user_id === u.id) || []
                return (
                  <tr key={u.id} className="hover:bg-[oklch(0.98_0.01_145)] transition-colors align-top">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[oklch(0.25_0.10_145)]">{u.name}</p>
                      <p className="text-xs text-[oklch(0.55_0.04_145)] mt-0.5">CC: {u.document || 'N/A'}</p>
                      {u.id_document_url && (
                        <div className="mt-2">
                          <a href={u.id_document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-md transition-colors border border-gray-200">
                            <FileText className="w-3.5 h-3.5" />
                            Ver Cédula
                          </a>
                        </div>
                      )}
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
                            const isCompleted = completedModules >= totalModules
                            
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
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block ${
                        (u.role === 'admin' || u.role === 'ADMIN')
                          ? 'bg-[oklch(0.30_0.10_145)] text-white' 
                          : 'bg-[oklch(0.90_0.02_145)] text-[oklch(0.40_0.08_145)]'
                      }`}>
                        {(u.role === 'admin' || u.role === 'ADMIN') ? 'Administrador' : 'Estudiante'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[oklch(0.50_0.04_145)]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(u.created_at).toLocaleDateString("es-CO")}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[oklch(0.55_0.04_145)]">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
