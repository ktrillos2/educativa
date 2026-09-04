import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { MessageCircle, BookOpen, Clock, ChevronLeft } from "lucide-react"
import { CreateTopicForm } from "@/components/create-topic-form"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ForoCursoPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session) redirect("/login")

  const supabase = await createClient()

  // 1. Verify access to this course (enrollment)
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", session.userId)
    .eq("course_id", params.courseId)
    .maybeSingle()

  if (!enrollment && session.role !== 'admin') {
      redirect("/estudiante/cursos")
  }

  // 2. Course details
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", params.courseId)
    .maybeSingle()
    
  if (!course) notFound()

  // 3. Get course topics
  const { data: topics } = await supabase
    .from("forum_topics")
    .select(`
        id, 
        title, 
        created_at, 
        users:user_id (name, role),
        replies:forum_replies (count)
    `)
    .eq("course_id", params.courseId)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={`/estudiante/cursos/${params.courseId}`} className="inline-flex items-center gap-1 text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.35_0.10_145)] text-sm mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al Curso
          </Link>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Foro Académico
          </h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm mt-1">{course.title}</p>
        </div>
        <CreateTopicForm courseId={params.courseId} />
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        {topics && topics.length > 0 ? (
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {topics.map((topic: any) => {
              const replyCount = topic.replies?.[0]?.count || 0
              const isTeacher = topic.users?.role === 'admin' || topic.users?.role === 'teacher'
              return (
                <Link 
                  key={topic.id} 
                  href={`/estudiante/cursos/${params.courseId}/foro/${topic.id}`}
                  className="block hover:bg-[oklch(0.98_0.01_145)] transition-colors p-5 group"
                >
                  <div className="flex justify-between gap-4 items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-[oklch(0.25_0.10_145)] group-hover:text-[oklch(0.35_0.10_145)] transition-colors line-clamp-1">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[oklch(0.55_0.04_145)]">
                        <span className={`font-semibold ${isTeacher ? 'text-[oklch(0.35_0.10_145)]' : ''}`}>
                          {topic.users?.name || 'Usuario Desconocido'} {isTeacher && '👑'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[oklch(0.50_0.04_145)] bg-[oklch(0.97_0.01_145)] px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {replyCount} {replyCount === 1 ? 'respuesta' : 'respuestas'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-[oklch(0.55_0.04_145)]">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-900">No hay temas en este foro académico.</p>
            <p className="text-sm">¿Tienes alguna duda sobre el curso? ¡Inicia un nuevo tema!</p>
          </div>
        )}
      </div>
    </div>
  )
}
