import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Award, Download, ArrowLeft, FileSpreadsheet } from "@/components/ui/icons"
import Link from "next/link"
import { CertificatePayment } from "@/components/certificate-payment"
import { DownloadCertificateButton } from "@/components/download-certificate-button"

export default async function CertificatePage(props: { params: Promise<{ id: string }>, searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.params
  const searchParams = await props.searchParams
  const studentIdParam = searchParams?.studentId as string | undefined
  const supabaseUser = await createClient()

  const session = await getSession()
  if (!session?.userId) {
    redirect(`/diplomados/${params.id}`)
  }

  const isAdmin = session.role === "admin"
  const supabase = isAdmin ? createAdminClient() : supabaseUser

  // Obtener diplomado desde Supabase
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .maybeSingle()

  if (!course) {
    notFound()
  }

  // Permitir al admin ver el certificado de un estudiante específico
  let targetUserId = session.userId
  if (studentIdParam && isAdmin) {
    targetUserId = studentIdParam
  }

  // Get User details
  const { data: userProfile } = await supabase
    .from("users")
    .select("name, document")
    .eq("id", targetUserId)
    .maybeSingle()
  
  if (!userProfile) {
    redirect(`/diplomados/${params.id}`)
  }

  // Check enrollment and payment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("payment_verified")
    .eq("user_id", targetUserId)
    .eq("course_id", course.id)
    .maybeSingle()

  // Removed strict payment_verified redirect. Now it decides UI.
  const hasPaid = enrollment && enrollment.payment_verified

  // Check progress
  const { data: progressCheck } = await supabase
    .from("progress")
    .select("module_id")
    .eq("user_id", targetUserId)
    .eq("course_id", course.id)
    .eq("completed", true)

  // Para obtener el certificado, el usuario debe completar al menos 4 módulos o el 80%
  const completedModules = progressCheck?.length || 0
  const totalModules = course.modules || 1
  const isEligible = completedModules >= 4 || (completedModules / totalModules) >= 0.8

  return (
    <main className="flex-grow bg-muted/20 print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }
        }
      `}} />
      <section className="pt-32 pb-16 print:p-0 print:m-0">
        <div className="container mx-auto px-4 max-w-4xl print:max-w-none print:w-[100vw] print:h-[100vh] print:p-0 print:m-0">
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
                        href={`/diplomados/${course.id}/acta${studentIdParam ? `?studentId=${studentIdParam}` : ''}`}
                        className="bg-white text-secondary border-2 border-secondary px-6 py-2.5 font-bold hover:bg-secondary/5 flex items-center gap-2 transition-all shadow-sm"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Ver Acta Académica
                    </Link>
                    <DownloadCertificateButton 
                        courseId={course.id} 
                        type="CERTIFICATE" 
                        label="Descargar Certificado"
                        className="bg-secondary text-white px-6 py-2.5 font-bold hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                    />
                </div>
              </div>

              {/* Certificate UI designed for printing and responsive display */}
              <div id="certificate" className="bg-white text-black p-6 md:p-12 text-center relative overflow-hidden shadow-lg min-h-[500px] flex flex-col justify-between print:fixed print:top-0 print:left-0 print:w-[297mm] print:h-[209mm] print:p-8 print:shadow-none print:m-0 print:z-50" style={{ border: '12px solid #C5A059', boxSizing: 'border-box' }}>
                <div className="absolute inset-0 m-1 md:m-2 pointer-events-none" style={{ border: '2px solid #C5A059' }}></div>
                
                {/* Cabecera */}
                <div className="flex justify-between items-center w-full px-4 pt-4 md:pt-8 print:pt-4 relative z-10">
                  {/* Escudo Placeholder */}
                  <div className="w-28 h-28 border-2 border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0 shadow-sm">
                    <span className="text-xs text-gray-400 font-medium">ESCUDO</span>
                  </div>
                  
                  {/* Texto Central */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#006838] uppercase tracking-wide leading-tight">
                      ACADEMIA DE FORMACIÓN LÍDERES DEL MÉRITO S.A.S
                    </h1>
                    <div className="flex gap-2 md:gap-8 text-[#006838] text-xs md:text-base font-bold mt-1 md:mt-2 flex-wrap justify-center">
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
                <div className="flex-1 flex flex-col items-center justify-center space-y-2 md:space-y-3 relative z-10 my-4 md:my-6 print:my-4 print:space-y-2">
                  <p className="text-xl md:text-3xl font-bold text-[#C5A059] uppercase tracking-widest print:text-2xl">¡EL MÉRITO ES TUYO!</p>
                  <p className="text-lg md:text-2xl font-bold uppercase text-black print:text-xl">HACE CONSTAR QUE</p>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-black uppercase mt-4 md:mt-6 mb-1 md:mb-2 tracking-wide leading-tight print:text-5xl print:mt-4">
                    {String(userProfile.name)}
                  </h2>
                  <p className="text-sm md:text-lg text-black print:text-base">
                    Identificado(a) con documento de identidad N° <span className="border-b border-black inline-block px-4 md:px-8 font-medium pb-0.5">{String(userProfile.document)}</span>
                  </p>
                  
                  <p className="text-lg md:text-2xl font-bold text-black mt-4 md:mt-8 print:text-xl print:mt-6">CURSÓ Y APROBÓ EL</p>
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-black uppercase px-4 md:px-12 tracking-wide leading-snug print:text-3xl print:mt-2">{course.title}</h3>
                  
                  <p className="text-xs md:text-base text-black mt-4 md:mt-8 max-w-4xl leading-relaxed px-4 md:px-0 print:text-sm print:mt-6">
                    Modalidad virtual asincrónica a los <span className="border-b border-black px-2 md:px-4 inline-block font-medium pb-0.5">{new Date().getDate()}</span> días del mes de <span className="border-b border-black px-2 md:px-4 inline-block font-medium pb-0.5">{new Date().toLocaleString('es-CO', { month: 'long' })}</span> del año <span className="border-b border-black px-3 md:px-6 inline-block font-medium pb-0.5">{new Date().getFullYear()}</span>.
                    <br/>
                    <span className="block mt-2 md:mt-4 print:mt-2">Con una intensidad académica de <span className="font-medium">{course.duration || 'sesenta y cinco (65) horas'}</span>.</span>
                  </p>
                  <p className="text-xs md:text-base text-black mt-3 md:mt-6 print:text-sm print:mt-4">
                    Registrado en el Libro de Actas N° <span className="border-b border-black px-4 md:px-8 inline-block font-medium pb-0.5">2026-00001</span>
                  </p>
                </div>

                {/* Pie / Footer */}
                <div className="flex justify-between items-end w-full px-2 md:px-16 mt-4 mb-2 md:mb-4 relative z-10 flex-wrap gap-4 md:gap-0 print:mb-2 print:mt-2">
                  {/* QR */}
                  <div className="text-center w-full md:w-40 flex flex-col items-center order-2 md:order-1 hidden md:flex print:flex">
                    <p className="text-[10px] md:text-xs font-bold text-black mb-1 md:mb-2 print:mb-1">QR DE VERIFICACIÓN</p>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border border-gray-300 flex items-center justify-center text-[10px] md:text-xs text-gray-400 rounded print:w-20 print:h-20">
                      [QR]
                    </div>
                    <p className="text-[10px] md:text-xs text-black mt-1 md:mt-2 print:mt-1">(Insertar aquí)</p>
                  </div>
                  
                  {/* Signature */}
                  <div className="text-center w-full md:w-72 flex flex-col items-center order-1 md:order-2">
                    {/* Placeholder Firma */}
                    <div className="h-16 md:h-24 w-40 md:w-56 bg-transparent rounded mb-1 flex flex-col items-center justify-center print:h-16">
                      <span className="italic transform -rotate-6 font-serif text-3xl md:text-4xl text-gray-800/40 print:text-3xl">Auden V.</span>
                    </div>
                    <div className="border-t border-black w-3/4 md:w-full pt-1 md:pt-2">
                      <p className="font-bold text-xs md:text-sm text-black uppercase">AUDEN VILORIA TORRES</p>
                      <p className="text-[10px] md:text-sm text-black">Director Académico</p>
                    </div>
                  </div>
                  
                  {/* Unique Code */}
                  <div className="text-center w-full md:w-40 flex flex-col items-center justify-end h-full mb-1 md:mb-4 order-3 hidden md:flex print:flex print:mb-2">
                    <p className="text-[10px] md:text-sm text-black mb-1">Código único:</p>
                    <p className="text-[10px] md:text-sm text-black font-medium">AFLM-2026-00001</p>
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
