import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { diplomados } from "@/lib/data"
import { FileSpreadsheet, Download, ArrowLeft, CheckCircle } from "@/components/ui/icons"
import Link from "next/link"

export default async function ActaPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const course = diplomados.find(d => d.id === params.id)

  if (!course) {
    notFound()
  }

  const session = await getSession()
  if (!session?.userId) {
    redirect(`/diplomados/${params.id}`)
  }

  // Get User details
  const userResult = await db.execute({
    sql: "SELECT name, document FROM users WHERE id = ?",
    args: [session.userId]
  })
  
  if (userResult.rows.length === 0) {
    redirect(`/diplomados/${params.id}`)
  }

  const user = userResult.rows[0]

  // Check enrollment and payment
  const enrollment = await db.execute({
    sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND course_id = ?",
    args: [session.userId, course.id]
  })

  if (enrollment.rows.length === 0 || !enrollment.rows[0].payment_verified) {
    redirect(`/diplomados/${params.id}/certificado`)
  }

  // Get all module progress
  const progressResult = await db.execute({
    sql: "SELECT module_id, score, completed FROM progress WHERE user_id = ? AND course_id = ?",
    args: [session.userId, course.id]
  })

  const progressMap = new Map(
    progressResult.rows.map(row => [row.module_id, { score: Number(row.score), completed: Boolean(row.completed) }])
  )

  const modulesData = Array.from({ length: course.modules }).map((_, i) => {
    const moduleId = `mod-${i + 1}`
    const progress = progressMap.get(moduleId)
    return {
      id: moduleId,
      title: `Módulo ${i + 1}: Desarrollo de Competencias Unidad ${i + 1}`,
      score: progress?.score || 0,
      completed: progress?.completed || false
    }
  })

  const averageScore = modulesData.reduce((acc, mod) => acc + mod.score, 0) / modulesData.length
  const allCompleted = modulesData.every(m => m.completed)

  return (
    <main className="flex-grow bg-muted/20 pb-20">
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8 print:hidden">
            <Link href={`/diplomados/${course.id}/certificado`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Certificado
            </Link>
            <button 
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary/90 flex items-center gap-2 print:hidden shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              Imprimir Acta
            </button>
          </div>

          <div id="academic-record" className="bg-white border shadow-2xl p-12 md:p-16 print:shadow-none print:border-none relative overflow-hidden">
            {/* Watermark/Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none -mr-20 -mt-20">
                <FileSpreadsheet className="w-full h-full" />
            </div>

            <div className="text-center mb-12 border-b-2 border-primary/10 pb-8">
              <h1 className="text-3xl font-serif font-bold text-primary uppercase tracking-widest mb-2">Acta de Finalización Académica</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Registro No. FLM-{course.id}-{session.userId.slice(0, 5)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Estudiante</p>
                  <p className="text-xl font-bold">{String(user.name)}</p>
                  <p className="text-sm text-muted-foreground">ID: {String(user.document)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Programa</p>
                  <p className="text-lg font-semibold">{course.title}</p>
                  <p className="text-sm text-muted-foreground">Intensidad: {course.duration}</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end justify-center text-left md:text-right">
                <div className="bg-primary/5 p-4 border border-primary/10">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Promedio General</p>
                    <p className="text-4xl font-black text-primary">{averageScore.toFixed(1)}%</p>
                    <p className="text-xs text-green-600 font-bold mt-1 flex items-center justify-end gap-1">
                        <CheckCircle className="w-3 h-3" /> APROBADO
                    </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-secondary"></div>
                  Calificaciones Detalladas
              </h2>
              <div className="overflow-hidden border border-border/60">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 text-xs font-bold uppercase tracking-wider border-b">
                      <th className="px-6 py-4">Módulo</th>
                      <th className="px-6 py-4">Descripción del Contenido</th>
                      <th className="px-6 py-4 text-center">Calificación</th>
                      <th className="px-6 py-4 text-right">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {modulesData.map((mod) => (
                      <tr key={mod.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm whitespace-nowrap">{mod.id.replace('mod-', 'Módulo ')}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{mod.title}</td>
                        <td className="px-6 py-4 text-center font-mono font-bold">{mod.score}%</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 ${mod.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {mod.score >= 60 ? 'Aprobado' : 'Reprobado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="text-center pt-8 border-t border-black/20">
                    <p className="font-bold text-sm uppercase">Firma del Director</p>
                    <p className="text-xs text-muted-foreground">Academia de Formación Líderes del Mérito S.A.S.</p>
                </div>
                <div className="text-center pt-8 border-t border-black/20">
                    <p className="font-bold text-sm uppercase">Sello de Registro</p>
                    <p className="text-xs text-muted-foreground">Emitido el {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-dashed text-[10px] text-muted-foreground text-center">
                Este documento es una representación digital del acta académica original. 
                Su validez puede ser verificada en nuestro portal estudiantil mediante el No. de Registro.
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          main { padding: 0 !important; }
          .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          #academic-record { border: none !important; box-shadow: none !important; margin: 0 !important; padding: 2cm !important; width: 100% !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </main>
  )
}
