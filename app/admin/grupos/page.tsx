import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { CreateGroupForm } from "./create-group-form"
import { Calendar, Users as UsersIcon, Link as LinkIcon, Clock } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminGruposPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const supabase = createAdminClient()

  // Get all courses for the dropdown (only ETDH/Formacion Academica)
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .eq("type", "etdh")
    .order("created_at", { ascending: true })

  // Get all groups with their course title
  const { data: groups } = await supabase
    .from("course_groups")
    .select(`
      id, name, registration_start, registration_end, whatsapp_link, created_at,
      course_id
    `)
    .order("created_at", { ascending: false })

  const coursesMap = new Map((courses || []).map(c => [c.id, c.title]))

  // Get enrollment counts per group
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("group_id")
  
  const groupCounts: Record<string, number> = {}
  enrollments?.forEach(e => {
    if (e.group_id) {
      groupCounts[e.group_id] = (groupCounts[e.group_id] || 0) + 1
    }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Grupos (Cohortes)</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Crea rangos de fechas para asignación automática de estudiantes a grupos.</p>
      </div>

      <CreateGroupForm courses={courses || []} />

      <div>
        <h2 className="text-xl font-bold text-[oklch(0.25_0.10_145)] mb-4">Grupos Existentes</h2>
        
        {(!groups || groups.length === 0) ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[oklch(0.88_0.04_145)]">
            <UsersIcon className="w-12 h-12 text-[oklch(0.80_0.04_145)] mx-auto mb-4" />
            <p className="text-[oklch(0.55_0.04_145)]">No hay grupos creados todavía.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(group => {
              const enrolled = groupCounts[group.id] || 0
              const courseTitle = coursesMap.get(group.course_id) || "Curso Desconocido"
              
              const startDate = new Date(group.registration_start).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
              const endDate = new Date(group.registration_end).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
              
              const isCurrentlyActive = new Date() >= new Date(group.registration_start) && new Date() <= new Date(group.registration_end)

              return (
                <div key={group.id} className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[oklch(0.25_0.10_145)]">{group.name}</h3>
                      <p className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded inline-block mt-1">
                        {courseTitle}
                      </p>
                    </div>
                    {isCurrentlyActive && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Inscripción Activa
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mt-4 text-sm text-[oklch(0.40_0.08_145)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{startDate} - {endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      <span>{enrolled} estudiantes inscritos</span>
                    </div>
                    {group.whatsapp_link && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-green-600" />
                        <a href={group.whatsapp_link} target="_blank" rel="noreferrer" className="text-green-600 hover:underline truncate">
                          {group.whatsapp_link}
                        </a>
                      </div>
                    )}
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
