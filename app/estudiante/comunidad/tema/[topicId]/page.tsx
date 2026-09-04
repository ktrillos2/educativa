import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Clock, MessageSquare } from "lucide-react"
import { CreateReplyForm } from "@/components/create-reply-form"
import { DeleteForumAction } from "@/components/delete-forum-action"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TemaComunidadPage(props: { params: Promise<{ topicId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session) redirect("/login")

  const supabase = await createClient()
  const isAdmin = session.role === "admin"

  // 1. Cargar el tema
  const { data: topic } = await supabase
    .from("forum_topics")
    .select(`
        id, 
        title, 
        content,
        created_at, 
        users:user_id (id, name, role)
    `)
    .eq("id", params.topicId)
    .is("course_id", null) // asegurar que sea global
    .maybeSingle()

  if (!topic) notFound()

  // 2. Cargar las respuestas
  const { data: replies } = await supabase
    .from("forum_replies")
    .select(`
        id,
        content,
        created_at,
        users:user_id (id, name, role)
    `)
    .eq("topic_id", params.topicId)
    .order("created_at", { ascending: true })

  const isTopicAuthor = session.userId === topic.users?.id
  const canDeleteTopic = isAdmin || isTopicAuthor
  const isTopicTeacher = topic.users?.role === 'admin' || topic.users?.role === 'teacher'

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      <Link href="/estudiante/comunidad" className="inline-flex items-center gap-1 text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.35_0.10_145)] text-sm mb-2 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a la comunidad
      </Link>

      {/* Tema Original */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="p-6">
            <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">{topic.title}</h1>
                {canDeleteTopic && (
                    <DeleteForumAction id={topic.id} type="TOPIC" />
                )}
            </div>
            <div className="flex items-center gap-3 text-xs text-[oklch(0.55_0.04_145)] mb-6 pb-6 border-b border-[oklch(0.94_0.01_145)]">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-[oklch(0.90_0.02_145)] flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[oklch(0.40_0.08_145)]" />
                    </div>
                    <span className={`font-bold ${isTopicTeacher ? 'text-[oklch(0.35_0.10_145)]' : ''}`}>
                        {topic.users?.name || 'Usuario'} {isTopicTeacher && '👑'}
                    </span>
                </div>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                </span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                {topic.content}
            </div>
        </div>
      </div>

      {/* Respuestas */}
      <div className="pl-4 md:pl-8 space-y-4">
        <h3 className="font-bold text-[oklch(0.40_0.08_145)] flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4" /> 
            {replies?.length || 0} {(replies?.length === 1) ? 'Respuesta' : 'Respuestas'}
        </h3>

        {replies?.map((reply: any) => {
            const isReplyAuthor = session.userId === reply.users?.id
            const canDeleteReply = isAdmin || isReplyAuthor
            const isReplyTeacher = reply.users?.role === 'admin' || reply.users?.role === 'teacher'
            
            return (
                <div key={reply.id} className="bg-white rounded-lg border border-[oklch(0.90_0.02_145)] p-5 shadow-sm">
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.04_145)]">
                            <span className={`font-bold ${isReplyTeacher ? 'text-[oklch(0.35_0.10_145)]' : 'text-gray-700'}`}>
                                {reply.users?.name || 'Usuario'} {isReplyTeacher && '👑'}
                            </span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: es })}</span>
                        </div>
                        {canDeleteReply && (
                            <DeleteForumAction id={reply.id} type="REPLY" topicId={topic.id} />
                        )}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {reply.content}
                    </div>
                </div>
            )
        })}

        <CreateReplyForm topicId={topic.id} />
      </div>
    </div>
  )
}
