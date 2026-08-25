import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { CreateClassForm } from "./create-class-form"
import { Video, Calendar, Clock, PlayCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminClasesPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const supabase = createAdminClient()

  // Get all courses for mapping
  const { data: coursesData } = await supabase
    .from("courses")
    .select("id, title")

  const coursesMap = new Map((coursesData || []).map(c => [c.id, c.title]))

  // Fetch groups to populate the dropdown
  const { data: rawGroups } = await supabase
    .from("course_groups")
    .select("id, name, course_id")
    .order("created_at", { ascending: false })
  
  // Format the response
  const groups = rawGroups?.map(g => ({
      id: g.id,
      name: g.name,
      course: { id: g.course_id, title: coursesMap.get(g.course_id) || "Curso Desconocido" }
  })) || [];

  // Fetch scheduled classes
  const { data: classes } = await supabase
    .from("live_classes")
    .select(`
      *,
      course_groups (name, course_id)
    `)
    .order("scheduled_at", { ascending: true })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Clases en Vivo</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Programa sesiones en vivo para los diferentes grupos.</p>
      </div>

      <CreateClassForm groups={groups} />

      <div>
        <h2 className="text-xl font-bold text-[oklch(0.25_0.10_145)] mb-4">Próximas Clases</h2>
        
        {(!classes || classes.length === 0) ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[oklch(0.88_0.04_145)]">
            <Video className="w-12 h-12 text-[oklch(0.80_0.04_145)] mx-auto mb-4" />
            <p className="text-[oklch(0.55_0.04_145)]">No hay clases programadas.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classes.map(cls => {
              const groupName = Array.isArray(cls.course_groups) ? cls.course_groups[0]?.name : (cls.course_groups?.name || "Grupo Desconocido");
              const courseId = Array.isArray(cls.course_groups) ? cls.course_groups[0]?.course_id : (cls.course_groups?.course_id || "");
              
              const dateObj = new Date(cls.scheduled_at)
              const dateStr = dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
              const timeStr = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
              const endTimeStr = cls.scheduled_end_at ? new Date(cls.scheduled_end_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : null

              
              return (
                <div key={cls.id} className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[oklch(0.25_0.10_145)]">{cls.title}</h3>
                      <p className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded inline-block mt-1">
                        {groupName}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {cls.status === 'scheduled' ? 'Programada' : cls.status === 'in_progress' ? 'En Vivo' : 'Finalizada'}
                    </span>
                  </div>

                  {cls.description && <p className="text-sm text-[oklch(0.50_0.04_145)] mb-3">{cls.description}</p>}

                  <div className="space-y-2 mt-4 text-sm text-[oklch(0.40_0.08_145)] mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{timeStr}{endTimeStr ? ` a ${endTimeStr}` : ''}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link 
                      href={`/diplomados/${courseId}/clase/${cls.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" /> Entrar a la Sala
                    </Link>
                    <Link 
                      href={`/admin/clases/${cls.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 py-2 rounded-lg font-medium hover:bg-secondary/20 transition-colors"
                    >
                      Ver Asistencia y Finalizar
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
