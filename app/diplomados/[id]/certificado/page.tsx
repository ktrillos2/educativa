import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { diplomados } from "@/lib/data"
import { Award, Download, ArrowLeft } from "@/components/ui/icons"
import Link from "next/link"

export default async function CertificatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const course = diplomados.find(d => d.id === params.id)

  if (!course) {
    notFound()
  }

  const session = await getSession()
  if (!session?.userId) {
    redirect(`/diplomados/\${params.id}`)
  }

  // Get User details
  const userResult = await db.execute({
    sql: "SELECT name, document FROM users WHERE id = ?",
    args: [session.userId]
  })
  
  if (userResult.rows.length === 0) {
    redirect(`/diplomados/\${params.id}`)
  }

  const user = userResult.rows[0]

  // Check enrollment and payment
  const enrollment = await db.execute({
    sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND course_id = ?",
    args: [session.userId, course.id]
  })

  if (enrollment.rows.length === 0 || !enrollment.rows[0].payment_verified) {
    redirect(`/diplomados/\${params.id}`)
  }

  // Check progress
  const progressCheck = await db.execute({
    sql: "SELECT module_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1",
    args: [session.userId, course.id]
  })

  // To get the certificate, user must have completed all modules
  const completedModules = progressCheck.rows.length
  const totalModules = course.modules
  const isEligible = completedModules >= totalModules

  return (
    <main className="flex-grow bg-muted/20">
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={`/diplomados/\${course.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Diplomado
          </Link>

          {!isEligible ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Aún no cumples los requisitos</h2>
              <p className="text-muted-foreground mb-6">
                Has completado {completedModules} de {totalModules} módulos requeridos para obtener el certificado.
                Asegúrate de aprobar todos los exámenes de unidad con al menos 60%.
              </p>
              <Link href={`/diplomados/\${course.id}`} className="inline-block bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90">
                Continuar Estudiando
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tu Certificado</h1>
                <button 
                  onClick={() => window.print()}
                  className="bg-secondary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary/90 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
              </div>

              {/* Certificate UI designed for printing */}
              <div id="certificate" className="bg-white border-8 border-double border-primary/20 p-12 md:p-20 text-center relative overflow-hidden shadow-lg aspect-[1.4/1] flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
                
                <div className="relative z-10">
                  <div className="mb-8">
                    <Award className="w-16 h-16 mx-auto text-primary" />
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-serif text-primary mb-2 uppercase tracking-wide">Certificado de Aprobación</h2>
                  <p className="text-lg text-muted-foreground mb-8">La Academia de Formación Líderes del Mérito S.A.S. certifica que:</p>
                  
                  <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{String(user.name)}</h3>
                  <p className="text-muted-foreground mb-8">Con documento de identidad: {String(user.document)}</p>
                  
                  <p className="text-lg text-muted-foreground mb-4">Ha completado satisfactoriamente los requisitos académicos del:</p>
                  <h4 className="text-2xl md:text-3xl font-bold text-secondary mb-12">{course.title}</h4>
                  
                  <div className="flex justify-between items-end px-12 mt-12">
                    <div className="text-center border-t border-black/20 pt-2 w-48">
                      <p className="font-bold text-sm">Director Académico</p>
                      <p className="text-xs text-muted-foreground">FLM S.A.S.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium mb-1">Fecha de Emisión</p>
                      <p className="text-sm border-b border-black/20 px-4 pb-1">
                        {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
