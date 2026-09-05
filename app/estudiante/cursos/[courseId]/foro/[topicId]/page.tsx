import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, MessageCircle, Pin, Shield, CheckCircle2 } from "lucide-react"
import { CreateReplyForm } from "@/components/create-reply-form"
import { DeleteForumButton } from "@/components/delete-forum-button"
import { ForumModerationActions } from "@/components/forum-moderation-actions"
import { incrementTopicViews } from "@/app/actions/forum"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
}

export default async function CursoTemaPage(props: { params: Promise<{ courseId: string, topicId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session) redirect("/login")

  // Increment views
  await incrementTopicViews(params.topicId)

  const supabase = await createClient()

  // Verify access to course
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", session.userId)
    .eq("course_id", params.courseId)
    .maybeSingle()

  if (!enrollment && session.role !== 'admin') {
      redirect("/estudiante/cursos")
  }

  // Get topic
  const { data: topic } = await supabase
    .from("forum_topics")
    .select(`
        *,
        users:user_id (id, name, role)
    `)
    .eq("id", params.topicId)
    .eq("course_id", params.courseId)
    .maybeSingle()

  if (!topic) notFound()

  // Get replies
  const { data: replies } = await supabase
    .from("forum_replies")
    .select(`
        *,
        users:user_id (id, name, role)
    `)
    .eq("topic_id", params.topicId)
    .order("created_at", { ascending: true })

  const isAdmin = session.role === "admin"
  const isAuthor = session.userId === topic.users?.id

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">
      <Link href={`/estudiante/cursos/${params.courseId}/foro`} className="inline-flex items-center text-sm text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.35_0.10_145)] transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Foro Académico
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {topic.is_pinned && (
                <span className="flex items-center gap-1 bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                    <Pin className="w-3 h-3" /> Fijado
                </span>
            )}
            {topic.is_resolved && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" /> Resuelto
                </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-200">
                {topic.category || 'General'}
            </span>
          </div>
          
          <ForumModerationActions 
            topicId={topic.id}
            courseId={params.courseId}
            isPinned={topic.is_pinned} 
            isResolved={topic.is_resolved} 
            isAdmin={isAdmin} 
            isAuthor={isAuthor} 
          />
      </div>

      <div className="space-y-6">
        {/* Original Topic */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 ${topic.users?.role === 'admin' ? 'border-[oklch(0.35_0.10_145)] ring-1 ring-[oklch(0.35_0.10_145)]' : 'border-[oklch(0.88_0.04_145)]'}`}>
            <div className="flex flex-col items-center flex-shrink-0 text-center w-24">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl mb-2 ${topic.users?.role === 'admin' ? 'bg-[oklch(0.35_0.10_145)] ring-2 ring-[oklch(0.80_0.10_145)]' : 'bg-gray-400'}`}>
                    {getInitials(topic.users?.name)}
                </div>
                <p className="font-bold text-xs text-gray-900 break-words w-full">{topic.users?.name}</p>
                {topic.users?.role === 'admin' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[oklch(0.35_0.10_145)] flex items-center justify-center gap-1 mt-1">
                        <Shield className="w-3 h-3" /> Profesor
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] mb-3">{topic.title}</h1>
                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                    {topic.content}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> 
                        {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                    </span>
                    
                    {/* Only author or admin can delete topic */}
                    {(isAuthor || isAdmin) && (
                        <DeleteForumButton id={topic.id} type="topic" courseId={params.courseId} />
                    )}
                </div>
            </div>
        </div>

        {/* Replies */}
        <div className="pl-0 md:pl-8 space-y-4">
          <h3 className="font-bold text-[oklch(0.40_0.08_145)] flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5" />
            {replies?.length || 0} Respuestas
          </h3>

          {replies?.map((reply: any) => {
            const isReplyAuthor = session.userId === reply.users?.id
            const isReplyAdmin = reply.users?.role === 'admin'
            return (
                <div key={reply.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col md:flex-row gap-5 ${isReplyAdmin ? 'border-[oklch(0.40_0.10_145)] bg-[oklch(0.97_0.02_145)]' : 'border-[oklch(0.88_0.04_145)]'}`}>
                    <div className="flex flex-col items-center flex-shrink-0 text-center w-20">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm mb-2 ${isReplyAdmin ? 'bg-[oklch(0.35_0.10_145)] ring-1 ring-[oklch(0.80_0.10_145)]' : 'bg-gray-400'}`}>
                            {getInitials(reply.users?.name)}
                        </div>
                        <p className="font-bold text-[10px] text-gray-900 break-words w-full">{reply.users?.name}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-3">
                            {reply.content}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> 
                                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: es })}
                            </span>
                            
                            {/* Only author or admin can delete reply */}
                            {(isReplyAuthor || isAdmin) && (
                                <DeleteForumButton id={reply.id} type="reply" topicId={topic.id} courseId={params.courseId} />
                            )}
                        </div>
                    </div>
                </div>
            )
          })}
        </div>

        {/* Create Reply Form */}
        <div className="pl-0 md:pl-8 pt-4">
          {!topic.is_resolved ? (
              <CreateReplyForm topicId={topic.id} courseId={params.courseId} />
          ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="font-bold text-sm">Este tema ha sido marcado como resuelto.</p>
                  <p className="text-xs mt-1">Ya no se aceptan nuevas respuestas. Si tienes otra duda similar, por favor crea un nuevo tema.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
