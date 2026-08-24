import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { LiveClassRoom } from "@/components/live-class-room"
import { Breadcrumb } from "@/components/breadcrumb"

export default async function LiveClassPage(props: { params: Promise<{ id: string, classId: string }> }) {
  const params = await props.params
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Verify class exists
  const { data: liveClass } = await supabase
    .from("live_classes")
    .select("*, course_groups(course_id)")
    .eq("id", params.classId)
    .maybeSingle()

  if (!liveClass) {
    return <div className="p-20 text-center">Clase no encontrada</div>
  }

  // If not admin, verify enrollment and group
  if (session.role !== "admin") {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("group_id")
      .eq("user_id", session.userId)
      .eq("course_id", params.id)
      .maybeSingle()
      
    if (!enrollment || enrollment.group_id !== liveClass.group_id) {
      return <div className="p-20 text-center text-red-600 font-bold">No tienes permiso para entrar a esta clase.</div>
    }
  }

  return (
    <main className="bg-muted/10 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-4">
          <Breadcrumb items={[
            { label: "Inicio", href: "/" },
            { label: "Diplomados", href: "/diplomados" },
            { label: "Curso", href: `/diplomados/${params.id}` },
            { label: liveClass.title }
          ]} />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h1 className="text-xl font-bold">{liveClass.title}</h1>
              <p className="text-sm opacity-80">{liveClass.description || "Clase en vivo"}</p>
            </div>
            {session.role === "admin" && (
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                MODO PROFESOR
              </span>
            )}
          </div>
          
          {/* LiveKit Room */}
          <div className="w-full relative bg-black">
            <LiveClassRoom 
              roomName={liveClass.id} 
              username={session.name || "Estudiante"}
              courseId={params.id}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
