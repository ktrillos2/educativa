import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { MapPin, Mail, Phone, Calendar, User, Briefcase, FileImage } from "lucide-react"
import { PrintButton } from "./print-button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function FichaEstudianteMinisterioPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'ADMIN')) {
    redirect("/")
  }

  const { id: studentId } = await params
  const supabase = createAdminClient()

  // 1. Obtener datos del estudiante
  const { data: student, error: studentError } = await supabase
    .from("users")
    .select("*")
    .eq("id", studentId)
    .maybeSingle()

  if (studentError) {
    console.error("[Ficha] Error fetching student:", studentError)
    return <div className="p-8 text-center font-bold text-red-600">Error al consultar el estudiante: {studentError.message}</div>
  }

  if (!student) {
    return <div className="p-8 text-center font-bold">Estudiante no encontrado. ID: {studentId}</div>
  }

  // 2. Obtener TODAS sus inscripciones
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", studentId)

  // 3. Obtener los cursos de esas inscripciones
  const courseIds = enrollments?.map(e => e.course_id) || []
  let courses: any[] = []
  if (courseIds.length > 0) {
    const { data: cData } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds)
    courses = cData || []
  }

  // 4. Obtener progreso de todos sus cursos
  const { data: progress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", studentId)

  const currentDate = new Date().toLocaleDateString("es-CO", { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  // Colores de marca
  const green = "oklch(0.30 0.10 145)"
  const greenLight = "oklch(0.95 0.04 145)"
  const yellow = "oklch(0.72 0.14 85)"

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-10 max-w-3xl mx-auto printable-area text-sm">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; font-size: 11px; }
          .no-print { display: none !important; }
          .printable-area { margin: 0; padding: 0; max-width: 100%; box-shadow: none; border: none; min-height: 0 !important; }
        }
      `}} />

      {/* Botón de impresión */}
      <div className="flex justify-end mb-6 no-print">
        <PrintButton />
      </div>

      {/* Encabezado Institucional */}
      <div className="pb-4 mb-6 flex items-start justify-between border-b-2" style={{borderColor: green}}>
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider" style={{color: green}}>Ficha del Estudiante</h1>
          <p className="text-xs text-gray-400 mt-0.5">Generado el: {currentDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black uppercase tracking-tight" style={{color: green}}>Academia de Formación</p>
          <p className="text-sm font-black uppercase tracking-tight" style={{color: yellow}}>Líderes del Mérito</p>
        </div>
      </div>

      {/* 1. Información Personal */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 pb-1 border-b" style={{color: green, borderColor: `oklch(0.88 0.04 145)`}}>
          <User className="w-3.5 h-3.5" /> Datos Personales
        </h2>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-lg border" style={{background: greenLight}}>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Nombre Completo</p>
            <p className="font-bold text-sm text-gray-900">{student.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Documento de Identidad (CC)</p>
            <p className="font-bold text-sm text-gray-900">{student.document}</p>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Correo</p>
              <p className="text-xs text-gray-800">{student.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Teléfono</p>
              <p className="text-xs text-gray-800">{student.phone || 'No registrado'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dirección de Residencia</p>
              <p className="text-xs text-gray-800">{student.address || 'No registrada'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Fecha de Ingreso</p>
              <p className="text-xs text-gray-800">{new Date(student.created_at).toLocaleDateString("es-CO", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </section>



      {/* 3. Programas Académicos */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 pb-1 border-b" style={{color: green, borderColor: `oklch(0.88 0.04 145)`}}>
          <Briefcase className="w-3.5 h-3.5" /> Programas Académicos Matriculados
        </h2>

        {enrollments && enrollments.length > 0 ? (
          <div className="space-y-2">
            {enrollments.map(enrollment => {
              const course = courses.find(c => c.id === enrollment.course_id)
              if (!course) return null

              const courseProgress = progress?.filter(p => p.course_id === course.id) || []
              const totalModules = course.modules || 4
              const completedModules = courseProgress.filter(p => p.completed).length
              const progressPercent = Math.min(100, Math.round((completedModules / totalModules) * 100))
              
              let statusText = "NO INICIADO"
              if (progressPercent === 100) statusText = "COMPLETADO"
              else if (progressPercent > 0) statusText = "EN CURSO"

              return (
                <div key={enrollment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1" 
                        style={{background: greenLight, color: green}}>
                        {course.type === 'etdh' ? 'Formación Académica' : 'Diplomado'}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900">{course.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-gray-600">
                      Avance: <span className="font-bold" style={{color: green}}>{progressPercent}%</span> — {completedModules} de {totalModules} módulos aprobados
                    </p>
                    <span className="font-bold text-[10px] uppercase text-gray-500">{statusText}</span>
                  </div>
                  {/* Barra de progreso */}
                  <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{width: `${progressPercent}%`, background: progressPercent === 100 ? green : yellow}} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg border">El estudiante no está matriculado en ningún programa académico.</p>
        )}
      </section>

      {/* Footer / Firmas — solo sello institucional */}
      <div className="mt-10 flex justify-center items-end">
        <div className="w-56 text-center">
          <div className="border-b border-gray-400 w-full mb-1.5"></div>
          <p className="text-[10px] font-bold text-gray-600">Sello de la Institución</p>
          <p className="text-[9px] text-gray-400">Dirección Académica</p>
        </div>
      </div>

      {/* Cédula (PDF) — oculta al imprimir, se debe imprimir por separado */}
      {student.id_document_url && (
        <div className="cedula-page no-print mt-12 pt-8 border-t-2 flex flex-col items-center gap-4" style={{borderColor: `oklch(0.88 0.04 145)`}}>
          <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{color: green}}>
            <FileImage className="w-3.5 h-3.5" /> Documento de Identidad — {student.name}
          </h2>
          {/* El documento es un PDF, se embebe con iframe para que se vea correctamente */}
          <iframe
            src={student.id_document_url}
            title={`Cédula de ${student.name}`}
            className="cedula-img w-full border border-gray-200 rounded shadow"
            style={{ height: '85vh', minHeight: '500px' }}
          />
          {/* Enlace de respaldo por si el navegador bloquea el iframe */}
          <a
            href={student.id_document_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold mt-1 underline"
            style={{color: green}}
          >
            Abrir e imprimir documento en nueva pestaña
          </a>
        </div>
      )}
    </div>
  )
}
