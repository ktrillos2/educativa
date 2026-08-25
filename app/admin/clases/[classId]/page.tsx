import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { notFound, redirect } from "next/navigation"
import { FinishClassForm } from "./finish-class-form"
import { Users, Clock, Video, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminClassDetailPage(props: { params: Promise<{ classId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const supabase = createAdminClient()

  // Fetch class info
  const { data: liveClass } = await supabase
    .from("live_classes")
    .select(`
      *,
      course_groups (name, course_id)
    `)
    .eq("id", params.classId)
    .maybeSingle()

  if (!liveClass) notFound()

  // Fetch recording if finished
  const { data: recording } = await supabase
    .from("class_recordings")
    .select("*")
    .eq("class_id", liveClass.id)
    .maybeSingle()

  // Fetch attendance
  const { data: attendanceRaw } = await supabase
    .from("class_attendance")
    .select(`
      id, joined_at, left_at, duration_seconds,
      users!inner (name, email, document)
    `)
    .eq("class_id", liveClass.id)
    .order("joined_at", { ascending: true })

  // Clean up inner join response
  const attendance = attendanceRaw?.map(a => ({
    ...a,
    user: Array.isArray(a.users) ? a.users[0] : a.users
  })) || []

  const groupName = Array.isArray(liveClass.course_groups) ? liveClass.course_groups[0]?.name : liveClass.course_groups?.name;
  const courseId = Array.isArray(liveClass.course_groups) ? liveClass.course_groups[0]?.course_id : liveClass.course_groups?.course_id;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/clases" className="text-sm font-bold text-primary hover:underline">
              &larr; Volver a Clases
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-[oklch(0.25_0.10_145)]">{liveClass.title}</h1>
          <p className="text-[oklch(0.55_0.04_145)] font-medium bg-secondary/10 text-secondary inline-block px-3 py-1 mt-2 rounded">
            Grupo: {groupName}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            liveClass.status === 'finished' ? 'bg-gray-100 text-gray-700' :
            liveClass.status === 'in_progress' ? 'bg-red-100 text-red-700 animate-pulse' :
            'bg-blue-100 text-blue-700'
          }`}>
            {liveClass.status === 'scheduled' ? 'Programada' : liveClass.status === 'in_progress' ? 'En Vivo' : 'Finalizada'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Management & Recording */}
        <div className="space-y-6">
          {liveClass.status !== 'finished' ? (
            <FinishClassForm classId={liveClass.id} courseId={courseId} />
          ) : (
            <div className="bg-white p-6 rounded-xl border border-[oklch(0.88_0.04_145)]">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-bold text-lg text-[oklch(0.25_0.10_145)]">Clase Finalizada</h3>
                  <p className="text-xs text-[oklch(0.55_0.04_145)]">La grabación ya está disponible</p>
                </div>
              </div>
              
              {recording?.file_url ? (
                <a 
                  href={recording.file_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-primary/10 text-primary font-bold py-2.5 rounded-md hover:bg-primary/20 transition-colors flex justify-center items-center gap-2"
                >
                  <Video className="w-4 h-4" /> Ver Grabación Subida
                </a>
              ) : (
                <p className="text-sm text-red-500 italic">No se encontró el link de la grabación.</p>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-[oklch(0.88_0.04_145)]">
            <h3 className="font-bold text-lg text-[oklch(0.25_0.10_145)] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Resumen de Asistencia
            </h3>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total Conectados</span>
              <span className="font-bold text-xl">{attendance.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Attendance List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] overflow-hidden">
            <div className="p-6 border-b border-[oklch(0.88_0.04_145)]">
              <h2 className="text-xl font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
                <Clock className="w-5 h-5" /> Registro Detallado de Asistencia
              </h2>
            </div>
            
            {attendance.length === 0 ? (
              <div className="p-12 text-center text-[oklch(0.55_0.04_145)]">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No hay registros de asistencia para esta clase todavía.</p>
                <p className="text-xs mt-1">(Los registros se generan cuando los estudiantes entran al aula virtual)</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-bold">Estudiante</th>
                      <th className="px-6 py-4 font-bold">Documento</th>
                      <th className="px-6 py-4 font-bold">Ingreso</th>
                      <th className="px-6 py-4 font-bold">Salida</th>
                      <th className="px-6 py-4 font-bold text-right">Tiempo Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendance.map((record) => {
                      const joinDate = new Date(record.joined_at)
                      const leaveDate = record.left_at ? new Date(record.left_at) : null
                      const mins = Math.floor((record.duration_seconds || 0) / 60)
                      const secs = (record.duration_seconds || 0) % 60
                      
                      return (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[oklch(0.25_0.10_145)]">{record.user?.name}</div>
                            <div className="text-xs text-gray-500">{record.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{record.user?.document}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {joinDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute:'2-digit' })}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {leaveDate ? leaveDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute:'2-digit' }) : <span className="text-red-500 text-xs font-bold animate-pulse">EN SALA</span>}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {mins}m {secs}s
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
