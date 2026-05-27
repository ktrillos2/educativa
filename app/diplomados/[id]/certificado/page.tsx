import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { diplomados } from "@/lib/data"
import { Award, Download, ArrowLeft, FileSpreadsheet } from "@/components/ui/icons"
import Link from "next/link"
import { CertificatePayment } from "@/components/certificate-payment"

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

  // Removed strict payment_verified redirect. Now it decides UI.
  const hasPaid = enrollment.rows.length > 0 && enrollment.rows[0].payment_verified

  // Check progress
  const progressCheck = await db.execute({
    sql: "SELECT module_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = 1",
    args: [session.userId, course.id]
  })

  // Para obtener el certificado, el usuario debe completar al menos 4 módulos o el 80%
  const completedModules = progressCheck.rows.length
  const totalModules = course.modules || 1
  const isEligible = completedModules >= 4 || (completedModules / totalModules) >= 0.8

  return (
    <main className="flex-grow bg-muted/20">
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={`/diplomados/${course.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors print:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Diplomado
          </Link>

          {!isEligible ? (
            <div className="bg-white shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Aún no cumples los requisitos</h2>
              <p className="text-muted-foreground mb-6">
                Has completado {completedModules} unidades.
                Para obtener el certificado oficial necesitas completar al menos 4 módulos o el 80% del programa.
                Asegúrate de aprobar las evaluaciones requeridas.
              </p>
              <Link href={`/diplomados/${course.id}`} className="inline-block bg-primary text-white px-6 py-2 font-medium hover:bg-primary/90">
                Continuar Estudiando
              </Link>
            </div>
          ) : !hasPaid ? (
            <CertificatePayment courseId={course.id} programName={course.title} />
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Certificación Académica</h1>
                    <p className="text-muted-foreground">Has completado exitosamente todos los requisitos del programa.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/diplomados/${course.id}/acta`}
                        className="bg-white text-secondary border-2 border-secondary px-6 py-2.5 font-bold hover:bg-secondary/5 flex items-center gap-2 transition-all shadow-sm"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Ver Acta Académica
                    </Link>
                    <button 
                        onClick={() => typeof window !== 'undefined' && window.print()}
                        className="bg-secondary text-white px-6 py-2.5 font-bold hover:bg-secondary/90 flex items-center gap-2 transition-all shadow-lg shadow-secondary/20"
                    >
                        <Download className="w-5 h-5" />
                        Descargar Certificado
                    </button>
                </div>
              </div>

              {/* Certificate UI designed for printing */}
              <div id="certificate" className="bg-white text-black p-8 md:p-12 text-center relative overflow-hidden shadow-lg aspect-[1.414/1] flex flex-col justify-between" style={{ border: '12px solid #C5A059' }}>
                <div className="absolute inset-0 m-1 pointer-events-none" style={{ border: '2px solid #C5A059' }}></div>
                
                {/* Cabecera */}
                <div className="flex justify-between items-center w-full px-4 pt-4 relative z-10">
                  {/* Escudo Placeholder */}
                  <div className="w-28 h-28 border-2 border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0 shadow-sm">
                    <span className="text-xs text-gray-400 font-medium">ESCUDO</span>
                  </div>
                  
                  {/* Texto Central */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#006838] uppercase tracking-wide leading-tight">
                      ACADEMIA DE FORMACIÓN LÍDERES DEL MÉRITO S.A.S
                    </h1>
                    <div className="flex gap-4 md:gap-8 text-[#006838] text-sm md:text-base font-bold mt-2">
                      <span>Registro mercantil: 95312</span>
                      <span>NIT: 900361774-5</span>
                    </div>
                  </div>
                  
                  {/* Logo Academia Placeholder */}
                  <div className="w-28 h-32 border-2 border-[#006838] flex items-center justify-center bg-[#006838] text-white flex-shrink-0 relative overflow-hidden shadow-sm">
                    <div className="text-center">
                      <Award className="w-10 h-10 mx-auto text-[#C5A059]" />
                      <span className="text-[8px] leading-tight block mt-2 uppercase font-bold px-1">Academia de Formación<br/>Líderes del Mérito<br/>S.A.S.</span>
                    </div>
                  </div>
                </div>

                {/* Cuerpo Central */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 relative z-10 mt-6">
                  <p className="text-2xl md:text-3xl font-bold text-[#C5A059] uppercase tracking-widest">¡EL MÉRITO ES TUYO!</p>
                  <p className="text-xl md:text-2xl font-bold uppercase text-black mt-2">HACE CONSTAR QUE</p>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-black uppercase mt-6 mb-2 tracking-wide">
                    {String(user.name)}
                  </h2>
                  <p className="text-base md:text-lg text-black">
                    Identificado(a) con documento de identidad N° <span className="border-b border-black inline-block px-8 font-medium pb-0.5">{String(user.document)}</span>
                  </p>
                  
                  <p className="text-xl md:text-2xl font-bold text-black mt-8">CURSÓ Y APROBÓ EL</p>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black uppercase px-12 tracking-wide">{course.title}</h3>
                  
                  <p className="text-sm md:text-base text-black mt-8 max-w-4xl leading-relaxed">
                    Modalidad virtual asincrónica a los <span className="border-b border-black px-4 inline-block font-medium pb-0.5">{new Date().getDate()}</span> días del mes de <span className="border-b border-black px-4 inline-block font-medium pb-0.5">{new Date().toLocaleString('es-CO', { month: 'long' })}</span> del año <span className="border-b border-black px-6 inline-block font-medium pb-0.5">{new Date().getFullYear()}</span>.
                    <br/>
                    <span className="block mt-4">Con una intensidad académica de <span className="font-medium">{course.duration || 'sesenta y cinco (65) horas'}</span>.</span>
                  </p>
                  <p className="text-sm md:text-base text-black mt-6">
                    Registrado en el Libro de Actas N° <span className="border-b border-black px-8 inline-block font-medium pb-0.5">2026-00001</span>
                  </p>
                </div>

                {/* Pie / Footer */}
                <div className="flex justify-between items-end w-full px-8 md:px-16 mt-8 mb-4 relative z-10">
                  {/* QR */}
                  <div className="text-center w-40 flex flex-col items-center">
                    <p className="text-xs font-bold text-black mb-2">QR DE VERIFICACIÓN</p>
                    <div className="w-24 h-24 bg-gray-50 border border-gray-300 flex items-center justify-center text-xs text-gray-400 rounded">
                      [QR]
                    </div>
                    <p className="text-xs text-black mt-2">(Insertar aquí)</p>
                  </div>
                  
                  {/* Signature */}
                  <div className="text-center w-72 flex flex-col items-center">
                    {/* Placeholder Firma */}
                    <div className="h-24 w-56 bg-transparent rounded mb-1 flex flex-col items-center justify-center">
                      <span className="italic transform -rotate-6 font-serif text-4xl text-gray-800/40">Auden V.</span>
                    </div>
                    <div className="border-t border-black w-full pt-2">
                      <p className="font-bold text-sm text-black uppercase">AUDEN VILORIA TORRES</p>
                      <p className="text-sm text-black">Director Académico</p>
                    </div>
                  </div>
                  
                  {/* Unique Code */}
                  <div className="text-center w-40 flex flex-col items-center justify-end h-full mb-4">
                    <p className="text-sm text-black mb-1">Código único:</p>
                    <p className="text-sm text-black font-medium">AFLM-2026-00001</p>
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
