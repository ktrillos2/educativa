import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { MessageCircle, BookOpen, Clock, ChevronLeft, Search, Hash, Pin, Eye, CheckCircle2 } from "lucide-react"
import { CreateTopicForm } from "@/components/create-topic-form"
import { UserAvatar } from "@/components/user-avatar"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Función auxiliar para obtener las iniciales del nombre
function getInitials(name: string) {
  if (!name) return "U"
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
}

// Colores por categoría académica
const categoryColors: Record<string, string> = {
  "Dudas Generales": "bg-blue-100 text-blue-700 border-blue-200",
  "Problemas Técnicos": "bg-amber-100 text-amber-700 border-amber-200",
  "Sobre Evaluaciones": "bg-purple-100 text-purple-700 border-purple-200",
  "default": "bg-[oklch(0.97_0.01_145)] text-[oklch(0.40_0.08_145)] border-[oklch(0.90_0.02_145)]"
}

export default async function ForoCursoPage(props: { params: Promise<{ courseId: string }>, searchParams: Promise<{ q?: string, cat?: string }> }) {
  const params = await props.params
  const searchParams = await props.searchParams
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

  // Leer parámetros de búsqueda y filtro
  const query = searchParams.q || ""
  const activeCategory = searchParams.cat || "Todas"

  // 3. Build query for course topics
  let supaQuery = supabase
    .from("forum_topics")
    .select(`
        id, 
        title, 
        category,
        is_pinned,
        is_resolved,
        views_count,
        created_at, 
        users:user_id (name, role),
        replies:forum_replies (count)
    `)
    .eq("course_id", params.courseId)

  // Aplicar filtros si existen
  if (activeCategory !== "Todas") {
      supaQuery = supaQuery.eq("category", activeCategory)
  }
  if (query) {
      supaQuery = supaQuery.ilike("title", `%${query}%`)
  }

  const { data: topics } = await supaQuery
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const categories = ["Todas", "Dudas Generales", "Problemas Técnicos", "Sobre Evaluaciones"]

  return (
    <div className="space-y-6 animate-fade-up pt-2 sm:pt-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={`/estudiante/cursos/${params.courseId}`} className="inline-flex items-center gap-1 text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.35_0.10_145)] text-sm mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al Curso
          </Link>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Foro Académico
          </h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm mt-1 truncate max-w-lg">{course.title}</p>
        </div>
        <CreateTopicForm courseId={params.courseId} />
      </div>

      {/* Banner Informativo FORO ACADÉMICO */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-sky-100/30 border border-blue-200/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200">
                  Aprendizaje Colaborativo
                </span>
                <span className="text-xs font-semibold text-blue-700">Dudas y Debates</span>
              </div>
              <h2 className="text-lg font-bold text-blue-950 mt-1">Foro Académico</h2>
              <p className="text-xs sm:text-sm text-blue-800/90 mt-0.5">
                Espacio interactivo para resolver dudas sobre los contenidos de la unidad y aprender en grupo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">1</span>
                  Dudas y Consultas
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Formula tus preguntas e inquietudes sobre las lecciones estudiadas.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">2</span>
                  Casos Reales
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Aporta experiencias de tu entorno laboral vinculadas con los temas del curso.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">3</span>
                  Participación Activa
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Comenta en las publicaciones de tus compañeros para enriquecer el aprendizaje.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar (Filtros) */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
            {/* Buscador */}
            <form className="relative">
                <input 
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Buscar dudas..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[oklch(0.88_0.04_145)] rounded-lg text-sm focus:outline-none focus:border-[oklch(0.35_0.10_145)] shadow-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                {activeCategory !== "Todas" && <input type="hidden" name="cat" value={activeCategory} />}
            </form>

            {/* Lista de Categorías */}
            <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-2 overflow-hidden">
                <h3 className="text-xs font-bold text-[oklch(0.40_0.08_145)] uppercase tracking-wider px-3 py-2">Filtros</h3>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <Link 
                            key={cat}
                            href={`/estudiante/cursos/${params.courseId}/foro?cat=${encodeURIComponent(cat)}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeCategory === cat 
                                    ? "bg-[oklch(0.35_0.10_145)] text-white" 
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <Hash className="w-3.5 h-3.5 opacity-70" />
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Lista Principal de Foros */}
        <div className="flex-1 w-full bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden min-h-[400px]">
          {topics && topics.length > 0 ? (
            <div className="divide-y divide-[oklch(0.94_0.01_145)]">
              {topics.map((topic: any) => {
                const replyCount = topic.replies?.[0]?.count || 0
                const isTeacher = topic.users?.role === 'admin' || topic.users?.role === 'teacher'
                const catColor = categoryColors[topic.category] || categoryColors["default"]

                return (
                  <Link 
                    key={topic.id} 
                    href={`/estudiante/cursos/${params.courseId}/foro/${topic.id}`}
                    className={`block hover:bg-[oklch(0.98_0.01_145)] transition-colors p-4 sm:p-5 group ${topic.is_pinned ? 'bg-[oklch(0.99_0.01_145)]' : ''}`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Avatar */}
                      <UserAvatar className="hidden sm:inline-flex" name={topic.users?.name} role={topic.users?.role} size="md" />

                      <div className="flex-1 min-w-0">
                        {/* Tags and Title */}
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
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${catColor}`}>
                                {topic.category}
                            </span>
                        </div>
                        <h3 className="font-bold text-base text-[oklch(0.25_0.10_145)] group-hover:text-[oklch(0.35_0.10_145)] transition-colors line-clamp-2">
                          {topic.title}
                        </h3>

                        {/* Author info */}
                        <div className="flex items-center gap-3 text-xs text-[oklch(0.55_0.04_145)] mt-1.5">
                          <span className={`font-semibold ${isTeacher ? 'text-[oklch(0.35_0.10_145)]' : 'text-gray-600'}`}>
                            {topic.users?.name || 'Usuario'} {isTeacher && '👑'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 opacity-70" /> 
                            {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0 mt-1 sm:mt-0">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <Eye className="w-4 h-4 opacity-70" />
                          <span className="font-medium">{topic.views_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[oklch(0.50_0.04_145)] bg-[oklch(0.97_0.01_145)] px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap group-hover:bg-[oklch(0.93_0.02_145)] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{replyCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-[oklch(0.55_0.04_145)] h-full min-h-[300px]">
              <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-medium text-gray-900">No se encontraron temas.</p>
              <p className="text-sm">
                {query || activeCategory !== "Todas" 
                    ? "Intenta buscar con otros términos o quita los filtros." 
                    : "¿Tienes alguna duda sobre el curso? ¡Inicia un nuevo tema!"}
              </p>
              {(query || activeCategory !== "Todas") && (
                  <Link href={`/estudiante/cursos/${params.courseId}/foro`} className="mt-4 text-sm font-bold text-[oklch(0.35_0.10_145)] hover:underline">
                      Borrar filtros
                  </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
