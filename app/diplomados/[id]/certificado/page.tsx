import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Award, Download, ArrowLeft, FileSpreadsheet } from "@/components/ui/icons"
import Link from "next/link"
import { CoursePayment } from "@/components/course-payment"
import { DownloadCertificateButton } from "@/components/download-certificate-button"

export const dynamic = "force-dynamic";

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
    .select("id, payment_verified")
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

  // Check previous downloads
  const { data: previousDownloads } = await supabase
    .from("study_acts")
    .select("type")
    .eq("user_id", targetUserId)
    .eq("course_id", course.id)

  const hasDownloadedCert = previousDownloads?.some(d => d.type === "CERTIFICATE") || false;
  // If the logic should apply to ACTA as well when rendering that button on another page, 
  // we would check it. Here we only render the CERTIFICATE download button directly.
  // Wait, if the admin views it, they can see "Ver Acta Académica". The user downloads the certificate.

  // Base URL for QR
  // Usamos localhost:3000 por defecto para que las pruebas locales funcionen, pero en producción 
  // se debe configurar NEXT_PUBLIC_APP_URL en el archivo .env
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = enrollment ? `${baseUrl}/verify/${enrollment.id}` : baseUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&format=svg`;

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
            <CoursePayment courseId={course.id} programName={course.title} />
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Certificación Académica</h1>
                    <p className="text-muted-foreground">Has completado exitosamente todos los requisitos del programa.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {isAdmin && (
                      <Link
                          href={`/diplomados/${course.id}/acta${studentIdParam ? `?studentId=${studentIdParam}` : ''}`}
                          className="bg-white text-secondary border-2 border-secondary px-6 py-2.5 font-bold hover:bg-secondary/5 flex items-center gap-2 transition-all shadow-sm"
                      >
                          <FileSpreadsheet className="w-5 h-5" />
                          Ver Acta Académica
                      </Link>
                    )}
                    <DownloadCertificateButton 
                        courseId={course.id} 
                        type="CERTIFICATE" 
                        label="Descargar Certificado"
                        className="bg-secondary text-white px-6 py-2.5 font-bold hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                        hasDownloadedBefore={hasDownloadedCert && !isAdmin}
                    />
                </div>
              </div>

              {/* Certificate UI designed for printing and responsive display */}
              <div id="certificate" className="bg-white text-black font-serif p-6 md:p-12 text-center relative shadow-lg min-h-[500px] flex flex-col justify-between" style={{ border: '12px solid #C5A059', boxSizing: 'border-box' }}>
                <div className="absolute inset-0 m-1 md:m-2 pointer-events-none" style={{ border: '2px solid #C5A059' }}></div>
                
                {/* Cabecera */}
                <div className="relative w-full pt-3 md:pt-6 z-10 flex items-center justify-between px-2 md:px-8">
                  {/* Escudo/Mención (Izquierda) */}
                  <div className="w-20 h-20 md:w-28 md:h-28 print:w-32 print:h-32 shrink-0 flex items-center justify-start -ml-4 md:-ml-12 print:m-0 print:ml-8">
                    <img src="/mencion.svg" alt="Mención" className="w-full h-full object-contain object-left" />
                  </div>
                  
                  {/* Texto Central */}
                  <div className="flex-1 text-center px-2 -translate-x-1 md:-translate-x-2">
                    <h1 className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold text-[#006838] uppercase tracking-normal leading-tight whitespace-nowrap">
                      ACADEMIA DE FORMACIÓN LÍDERES DEL MÉRITO S.A.S
                    </h1>
                    <div className="flex gap-4 md:gap-8 text-[#006838] text-[9px] sm:text-[11px] md:text-xs lg:text-sm font-bold mt-1.5 justify-center whitespace-nowrap">
                      <span>Registro mercantil: 95312</span>
                      <span>NIT: 900361774-5</span>
                    </div>
                  </div>

                  {/* Logo Academia (Derecha) */}
                  <div className="w-16 h-16 md:w-24 md:h-24 print:w-32 print:h-32 shrink-0 flex items-center justify-end -mr-6 md:-mr-12 print:m-0 print:mr-8">
                    <img src="/logo.svg" alt="Logo Academia" className="w-full h-full object-contain object-right" />
                  </div>
                </div>

                {/* Cuerpo Central */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-2 md:space-y-3 relative z-10 my-4 md:my-6">
                  <p className="text-base md:text-xl font-bold uppercase text-black mt-2">HACE CONSTAR QUE</p>
                  
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black uppercase tracking-wide leading-tight my-1">
                    {String(userProfile.name)}
                  </h2>
                  
                  <p className="text-xs sm:text-sm md:text-base text-black whitespace-nowrap">
                    Identificado(a) con documento de identidad N° <span className="border-b border-black inline-block px-3 md:px-6 font-medium pb-0.5">{String(userProfile.document)}</span>
                  </p>
                  
                  <p className="text-base md:text-xl font-bold text-black mt-2">ASISTIÓ AL</p>
                  
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black uppercase px-2 md:px-8 tracking-wide leading-snug">{course.title}</h3>
                  
                  <div className="text-xs sm:text-sm md:text-base text-black mt-2 max-w-4xl leading-normal px-2 md:px-0 space-y-2 md:space-y-3">
                    <p className="whitespace-nowrap">
                      Modalidad virtual asincrónica a los <span className="border-b border-black px-2 inline-block font-medium pb-0.5">{new Date().getDate()}</span> días del mes de <span className="border-b border-black px-2 inline-block font-medium pb-0.5">{new Date().toLocaleString('es-CO', { month: 'long' })}</span> del año <span className="border-b border-black px-2 inline-block font-medium pb-0.5">{new Date().getFullYear()}</span>.
                    </p>
                    <p className="whitespace-nowrap">
                      Con una intensidad académica de <span className="font-medium">{course.duration || 'setenta (70) horas'}</span>.
                    </p>
                    <p className="whitespace-nowrap">
                      Registrado en el Libro de Actas N° <span className="border-b-2 border-red-800 border-dotted px-4 inline-block font-medium pb-0.5">2026-00001</span>
                    </p>
                  </div>
                </div>

                {/* Pie / Footer */}
                <div className="flex flex-col w-full relative z-10 mt-2">
                  <div className="flex justify-between items-end w-full px-2 md:px-12 mb-2 md:mb-4 flex-nowrap gap-2">
                    {/* QR */}
                    <div className="text-center w-28 md:w-36 flex flex-col items-center shrink-0">
                      <p className="text-[9px] md:text-xs font-bold text-black mb-1">QR DE VERIFICACIÓN</p>
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-50 border border-gray-300 flex items-center justify-center rounded overflow-hidden p-1 relative group">
                        <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                        
                        {/* Enlace de prueba visible al pasar el mouse por encima del QR (solo para entorno de desarrollo) */}
                        <a 
                          href={verificationUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/80 text-white text-[10px] flex items-center justify-center text-center p-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                        >
                          Probar <br/> Link
                        </a>
                      </div>
                      <p className="text-[9px] md:text-xs text-black mt-1">Escanea para verificar</p>
                    </div>
                    
                    {/* Signature */}
                    <div className="text-center flex-1 max-w-xs flex flex-col items-center mx-auto shrink-0">
                      {/* Firma */}
                      <div className="h-24 md:h-28 w-56 md:w-72 bg-transparent mt-[calc(1rem-1cm)] mb-1 relative">
                        <img src="/firma.svg" alt="Firma Director" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1cm] scale-[1.3] max-h-full w-auto" />
                      </div>
                      <div className="border-t border-black w-full pt-1">
                        <p className="font-bold text-xs md:text-sm text-black uppercase whitespace-nowrap">AUDEN VILORIA TORRES</p>
                        <p className="text-[10px] md:text-xs text-black whitespace-nowrap">Director Académico</p>
                      </div>
                    </div>
                    
                    {/* Unique Code */}
                    <div className="text-center w-28 md:w-36 flex flex-col items-center justify-end h-full mb-1 shrink-0">
                      <p className="text-[10px] md:text-xs text-black mb-0.5">Código único:</p>
                      <p className="text-[10px] md:text-xs text-black font-medium border-b-2 border-red-800 border-dotted pb-0.5 whitespace-nowrap">AFLM-2026-00001</p>
                    </div>
                  </div>
                  
                  {/* Additional Footer Texts */}
                  <div className="w-full text-center space-y-1 mt-2">
                    <p className="font-bold text-xs md:text-sm text-black uppercase">WWW.ACADEMIADEFORMACIONLIDERESDELMERITO.EDU.CO</p>
                    <p className="text-[8px] md:text-[10px] text-black px-4 md:px-8">
                      La autenticidad de este diploma puede verificarse escaneando el código QR o escribiendo al correo academiadeformacion@lideresdelmerito.edu.co indicando el número de acta.
                    </p>
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
