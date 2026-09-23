import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Users, BookOpen, Clock, Pin, Eye, Search, Hash, Filter, CheckCircle2 } from "lucide-react"
import { CreateTopicForm } from "@/components/create-topic-form"
import { AdminForumActions } from "@/components/admin-forum-actions"
import { AdminCourseSelect } from "@/components/admin-course-select"
import { UserAvatar } from "@/components/user-avatar"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
}

const categoryColors: Record<string, string> = {
  "General": "bg-gray-100 text-gray-700 border-gray-200",
  "Recursos de Estudio": "bg-blue-100 text-blue-700 border-blue-200",
  "Noticias de la Academia": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Dudas Administrativas": "bg-amber-100 text-amber-700 border-amber-200",
  "Grupos de Estudio": "bg-purple-100 text-purple-700 border-purple-200",
  "Dudas Generales": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Problemas Técnicos": "bg-rose-100 text-rose-700 border-rose-200",
  "Sobre Evaluaciones": "bg-orange-100 text-orange-700 border-orange-200",
  "default": "bg-[oklch(0.97_0.01_145)] text-[oklch(0.40_0.08_145)] border-[oklch(0.90_0.02_145)]"
}

export default async function AdminForosPage(props: { searchParams: Promise<{ q?: string; scope?: string; course?: string }> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const supabase = createAdminClient()

  const query = searchParams.q || ""
  const activeScope = searchParams.scope || "todos" // "todos" | "comunidad" | "cursos"
  const selectedCourseId = searchParams.course || ""

  // Obtener la lista de cursos para los selectores
  const { data: dbCourses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title", { ascending: true })

  const coursesList = (dbCourses || []).map(c => ({ id: String(c.id), title: c.title }))

  // Consulta principal de temas
  let supaQuery = supabase
    .from("forum_topics")
    .select(`
        id, 
        title, 
        content,
        category,
        course_id,
        is_pinned,
        is_resolved,
        views_count,
        created_at, 
        users:user_id (name, role, email),
        replies:forum_replies (count)
    `)

  if (activeScope === "comunidad") {
    supaQuery = supaQuery.is("course_id", null)
  } else if (activeScope === "cursos") {
    supaQuery = supaQuery.not("course_id", "is", null)
  }

  if (selectedCourseId) {
    supaQuery = supaQuery.eq("course_id", selectedCourseId)
  }

  if (query) {
    supaQuery = supaQuery.ilike("title", `%${query}%`)
  }

  const { data: topics } = await supaQuery
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const courseMap = new Map(coursesList.map(c => [c.id, c.title]))

  return (
    <div className="space-y-6 animate-fade-up pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> Gestión de Foros y Comunidad
          </h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm mt-1">
            Administra discusiones globales, foros por curso, publica avisos oficiales y responde dudas de los estudiantes.
          </p>
        </div>
        <CreateTopicForm coursesList={coursesList} />
      </div>

      {/* Banners Informativos de Guías de Foros */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Banner Foro Social */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-100/30 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">
                Comunidad General
              </span>
              <h2 className="text-sm font-bold text-emerald-950 mt-0.5">Guía del Foro Social</h2>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-emerald-800">
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-emerald-200/50">
              <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
              <span><strong>Presentación:</strong> Nombre completo, ciudad de residencia y ocupación actual.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-emerald-200/50">
              <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
              <span><strong>Motivación:</strong> Razones e inspiración para ingresar a esta formación.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-emerald-200/50">
              <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
              <span><strong>Intereses:</strong> Gustos o aspectos personales para conectar mejor.</span>
            </div>
          </div>
        </div>

        {/* Banner Foro Académico */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-sky-100/30 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-200">
                Por Curso
              </span>
              <h2 className="text-sm font-bold text-blue-950 mt-0.5">Guía del Foro Académico</h2>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-blue-800">
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-blue-200/50">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
              <span><strong>Consultas:</strong> Publicación de dudas e inquietudes de los módulos.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-blue-200/50">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
              <span><strong>Casos Reales:</strong> Aporte de experiencias laborales y profesionales.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-blue-200/50">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
              <span><strong>Debate:</strong> Interacción colectiva en las preguntas de compañeros.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar de Filtros */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Filtro de ámbito */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <Link
            href={`/admin/foros?scope=todos${query ? `&q=${encodeURIComponent(query)}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeScope === "todos" ? "bg-[oklch(0.35_0.10_145)] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos los Foros
          </Link>
          <Link
            href={`/admin/foros?scope=comunidad${query ? `&q=${encodeURIComponent(query)}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeScope === "comunidad" ? "bg-[oklch(0.35_0.10_145)] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌐 Comunidad General
          </Link>
          <Link
            href={`/admin/foros?scope=cursos${query ? `&q=${encodeURIComponent(query)}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeScope === "cursos" ? "bg-[oklch(0.35_0.10_145)] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📚 Foros de Cursos
          </Link>
        </div>

        {/* Buscador e Identificador de Curso */}
        <form className="flex items-center gap-3 w-full md:w-auto">
          {coursesList.length > 0 && (
            <AdminCourseSelect 
              coursesList={coursesList} 
              selectedCourseId={selectedCourseId} 
              activeScope={activeScope} 
              query={query} 
            />
          )}

          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar discusiones..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-[oklch(0.88_0.04_145)] rounded-lg text-xs focus:outline-none focus:bg-white focus:border-[oklch(0.35_0.10_145)] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="hidden" name="scope" value={activeScope} />
          </div>
        </form>
      </div>

      {/* Lista de Temas */}
      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden min-h-[400px]">
        {topics && topics.length > 0 ? (
          <div className="divide-y divide-[oklch(0.94_0.01_145)]">
            {topics.map((topic: any) => {
              const replyCount = topic.replies?.[0]?.count || 0
              const isTeacher = topic.users?.role === 'admin' || topic.users?.role === 'teacher'
              const catColor = categoryColors[topic.category] || categoryColors["default"]
              const courseTitle = topic.course_id ? (courseMap.get(String(topic.course_id)) || `Curso (${topic.course_id})`) : null

              const targetHref = topic.course_id
                ? `/estudiante/cursos/${topic.course_id}/foro/${topic.id}`
                : `/estudiante/comunidad/tema/${topic.id}`

              return (
                <div
                  key={topic.id}
                  className={`p-4 sm:p-5 hover:bg-[oklch(0.98_0.01_145)] transition-colors flex flex-col sm:flex-row gap-4 items-start justify-between ${
                    topic.is_pinned ? 'bg-[oklch(0.99_0.01_145)] border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    <UserAvatar className="hidden sm:inline-flex" name={topic.users?.name} role={topic.users?.role} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                        {courseTitle ? (
                          <span className="flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            <BookOpen className="w-3 h-3" /> {courseTitle}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            <Users className="w-3 h-3" /> Comunidad General
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${catColor}`}>
                          {topic.category}
                        </span>
                      </div>

                      <Link href={targetHref} className="block group">
                        <h3 className="font-bold text-base text-[oklch(0.25_0.10_145)] group-hover:text-primary transition-colors line-clamp-2">
                          {topic.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-[oklch(0.55_0.04_145)] mt-1.5 flex-wrap">
                        <span className={`font-semibold ${isTeacher ? 'text-primary' : 'text-gray-600'}`}>
                          Por {topic.users?.name || 'Usuario'} ({topic.users?.email || 'Sin correo'}) {isTeacher && '👑'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-70" />
                          {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Moderación y Estadísticas */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Eye className="w-3.5 h-3.5 opacity-70" />
                        <span>{topic.views_count || 0}</span>
                      </div>
                      <Link
                        href={targetHref}
                        className="flex items-center gap-1.5 text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{replyCount} respuestas</span>
                      </Link>
                    </div>

                    <AdminForumActions
                      topicId={topic.id}
                      isPinned={topic.is_pinned || false}
                      isResolved={topic.is_resolved || false}
                      courseId={topic.course_id || null}
                      initialTitle={topic.title || ""}
                      initialContent={topic.content || ""}
                      initialCategory={topic.category || ""}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[oklch(0.55_0.04_145)] h-full min-h-[300px]">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-medium text-gray-900">No hay temas en esta vista.</p>
            <p className="text-sm">Publica un aviso o cambia los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
