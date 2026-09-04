import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageCircle, Users, Clock } from "lucide-react"
import { CreateTopicForm } from "@/components/create-topic-form"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ComunidadPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const supabase = await createClient()

  // Buscar temas globales (course_id IS NULL)
  const { data: topics } = await supabase
    .from("forum_topics")
    .select(`
        id, 
        title, 
        created_at, 
        users:user_id (name, role),
        replies:forum_replies (count)
    `)
    .is("course_id", null)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
            <Users className="w-6 h-6" /> Comunidad y Networking
          </h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm mt-1">Conecta con otros estudiantes, preséntate y comparte recursos de interés general.</p>
        </div>
        <CreateTopicForm />
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
                  href={`/estudiante/comunidad/tema/${topic.id}`}
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
            <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-900">Aún no hay temas en la comunidad.</p>
            <p className="text-sm">¡Sé el primero en presentarte e iniciar una conversación!</p>
          </div>
        )}
      </div>
    </div>
  )
}
