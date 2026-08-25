import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { LiveClassRoom } from "@/components/live-class-room"
import { Breadcrumb } from "@/components/breadcrumb"
import { CheckCircle, Video } from "lucide-react"
import { notFound } from "next/navigation"

export default async function LiveClassPage(props: { params: Promise<{ id: string, classId: string }> }) {
  const params = await props.params
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Fetch class
  const { data: liveClass } = await supabase
    .from("live_classes")
    .select("*")
    .eq("id", params.classId)
    .maybeSingle()

  if (!liveClass) notFound()

  // Fetch recording if finished
  let recordingUrl = null;
  if (liveClass.status === 'finished') {
    const { data: recording } = await supabase
      .from("class_recordings")
      .select("file_url")
      .eq("class_id", liveClass.id)
      .maybeSingle()
    if (recording?.file_url) {
      recordingUrl = recording.file_url;
    }
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
            {liveClass.status === 'finished' ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center max-w-2xl mx-auto px-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Clase Finalizada</h2>
                <p className="text-white/70 mb-8 text-lg">La sesión en vivo ha terminado. Puedes ver la grabación de la clase a continuación.</p>
                
                {recordingUrl ? (
                  <a 
                    href={recordingUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
                  >
                    <Video className="w-5 h-5" /> Ver Grabación de la Clase
                  </a>
                ) : (
                  <div className="p-4 bg-amber-500/20 text-amber-200 border border-amber-500/50 rounded-lg text-sm font-medium">
                    El profesor aún no ha subido el enlace de la grabación. Vuelve más tarde.
                  </div>
                )}
              </div>
            ) : (
              <LiveClassRoom 
                roomName={liveClass.id} 
                username={session.name || "Estudiante"}
                courseId={params.id}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
