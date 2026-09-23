import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Award, Download, ArrowLeft, FileSpreadsheet } from "@/components/ui/icons"
import Link from "next/link"
import { CoursePayment } from "@/components/course-payment"
import { DownloadCertificateButton } from "@/components/download-certificate-button"
import { UploadDocumentForm } from "@/components/upload-document-form"

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

  // Si el curso es ETDH, redirigir a la ruta correcta para que apliquen las lógicas de expiración
  if (course.type === 'etdh') {
    redirect(`/formacion-academica/${params.id}/certificado${studentIdParam ? `?studentId=${studentIdParam}` : ''}`)
  }

  // Permitir al admin ver el certificado de un estudiante específico
  let targetUserId = session.userId
  if (studentIdParam && isAdmin) {
    targetUserId = studentIdParam
  }

  // Get User details
  const { data: userProfile } = await supabase
    .from("users")
    .select("name, document, id_document_url")
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
      <section className="pt-28 md:pt-32 pb-12 print:p-0 print:m-0">
        <div className="container mx-auto px-4 max-w-4xl print:max-w-none print:w-[100vw] print:h-[100vh] print:p-0 print:m-0">
          <Link href={`/diplomados/${course.id}`} className="inline-flex items-center text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 rounded-md mb-6 transition-colors print:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Diplomado
          </Link>

          {!isEligible && !isAdmin ? (
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
          ) : !hasPaid && !isAdmin ? (
            <CoursePayment courseId={course.id} programName={course.title} price={course.price} />
          ) : !userProfile.id_document_url && !isAdmin ? (
            <div className="py-4">
              <UploadDocumentForm existingDocumentUrl={userProfile.id_document_url}>
                <div />
              </UploadDocumentForm>
            </div>
          ) : (
            <div className="space-y-4">
              {!isAdmin && userProfile.id_document_url && (
                <div className="print:hidden">
                  <UploadDocumentForm existingDocumentUrl={userProfile.id_document_url}>
                    <div />
                  </UploadDocumentForm>
                </div>
              )}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Certificación Académica</h1>
                    <p className="text-muted-foreground">Has completado exitosamente todos los requisitos del programa.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DownloadCertificateButton 
                        courseId={course.id} 
                        type="CERTIFICATE" 
                        label="Descargar Certificado"
                        className="bg-secondary text-white px-6 py-2.5 font-bold hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                        hasDownloadedBefore={hasDownloadedCert && !isAdmin}
                        isAdmin={isAdmin}
                    />
                </div>
              </div>

              {/* Certificate UI designed for printing and responsive display */}
              {/* Certificate UI designed for printing and responsive display */}
              {/* Certificate UI designed for printing and responsive display */}
              <div className="w-full flex justify-center pb-4 pt-2 print:p-0">
                {/* Wrapper that scales down on smaller screens without clipping */}
                <div 
                  className="mx-auto origin-top"
                  style={{ 
                    transform: 'scale(min(1, calc((100vw - 32px) / 1050)))',
                    marginBottom: 'calc(742.5px * (min(1, calc((100vw - 32px) / 1050)) - 1))'
                  }}
                >
                  <div 
                    id="certificate" 
                    className="bg-white text-black relative shadow-xl mx-auto overflow-hidden print:shadow-none print:w-[297mm] print:h-[210mm] print:mx-0" 
                    style={{ 
                      width: '1050px',
                      height: '742.5px',
                      border: '3px solid #b58c2a', 
                      boxShadow: 'inset 0 0 0 6px white, inset 0 0 0 12px #b58c2a',
                      boxSizing: 'border-box' 
                    }}
                  >
                               {/* Escudo/Mención (Izquierda) */}
                    <div className="absolute top-8 left-2 pointer-events-none z-20">
                      <div className="relative overflow-hidden" style={{ width: '180px', height: '180px', transform: 'scale(0.92)' }}>
                        <img 
                          src="/certificado-diplomado/liston-verde.svg" 
                          alt="Mención" 
                          className="absolute max-w-none" 
                          style={{ width: '1309px', height: '981px', left: '-22px', top: '-22px' }}
                        />
                      </div>
                    </div>
                    
                    {/* Logo Academia (Derecha) */}
                    <div className="absolute top-8 right-2 pointer-events-none z-20">
                      <div className="relative overflow-hidden" style={{ width: '180px', height: '164px', transform: 'scale(0.92)' }}>
                        <img 
                          src="/certificado-diplomado/logo-diploma.svg" 
                          alt="Logo Academia" 
                          className="absolute max-w-none" 
                          style={{ width: '1232px', height: '924px', left: '-41px', top: '-57px' }}
                        />
                      </div>
                    </div>

                    {/* Texto Central Header */}
                    <div className="absolute top-8 left-0 right-0 text-center flex flex-col items-center px-48 z-10 pointer-events-none">
                      <h1 className="text-[24px] font-bold text-[#006838] uppercase tracking-wide leading-tight mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                        ACADEMIA DE FORMACIÓN LÍDERES DEL MÉRITO S.A.S
                      </h1>
                      <div className="flex gap-12 text-[#006838] text-[14px] font-bold justify-center mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>
                        <span>Registro mercantil: 95312</span>
                        <span>NIT: 900361774-5</span>
                      </div>
                      
                      <div className="text-[11px] text-black italic text-justify leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
                        En cumplimiento de la Ley 115 de 1994, la Ley 1064 de 2006 y el artículo 2.6.4.3 del Decreto 1075 de 2015, en concordancia con las disposiciones que regulan la Educación para el Trabajo y el Desarrollo Humano. Resolución N° ___ de ___ expedida por la Secretaría de Educación de ____ Código SIET del programa: ____
                      </div>
                    </div>

                    {/* Cuerpo Central */}
                    <div className="absolute top-[180px] left-0 right-0 text-center flex flex-col items-center px-12 z-10 pointer-events-none">
                      
                      <h2 className="text-[44px] font-bold text-black uppercase tracking-wide mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                        {String(userProfile.name)}
                      </h2>
                      
                      <p className="text-[18px] text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
                        Identificado(a) con documento de identidad N° <span className="inline-block border-b border-black px-6 min-w-[200px] text-center pb-0.5">{String(userProfile.document)}</span>
                      </p>
                      
                      <div className="mt-3 mb-4 text-[22px] italic text-black leading-snug" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <p>Cursó y aprobó el Programa de Formación Académica</p>
                        <p>Y cumplió con las condiciones requeridas por la entidad. Le confiere el</p>
                      </div>
                      
                      <h3 className="text-[26px] font-bold text-black uppercase tracking-wide leading-snug px-16 mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                        CERTIFICADO DE CONOCIMIENTOS ACADÉMICOS EN {course.title}
                      </h3>
                      
                      <div className="text-[18px] text-black max-w-[900px] leading-relaxed space-y-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                        <p>
                          Metodología: a distancia con estrategia de educación virtual a los <span className="inline-block border-b border-black px-4 min-w-[30px] text-center pb-0.5">{new Date().getDate()}</span> días del mes de <span className="inline-block border-b border-black px-4 min-w-[100px] text-center pb-0.5">{new Date().toLocaleString('es-CO', { month: 'long' })}</span> del año <span className="inline-block border-b border-black px-4 min-w-[50px] text-center pb-0.5">{new Date().getFullYear()}</span>.
                        </p>
                        <p>
                          Con una intensidad académica de <span className="font-bold">{course.duration || 'ochenta (80) horas'}</span>.
                        </p>
                        <p>
                          Registrado en el Libro de Actas N° <span className="inline-block border-b border-black px-8 min-w-[150px] text-center pb-0.5">2026-00001</span> Folio N° <span className="inline-block border-b border-black px-6 min-w-[50px] text-center pb-0.5">___</span>
                        </p>
                      </div>
                    </div>

                    {/* Pie / Footer */}
                    <div className="absolute bottom-[60px] left-12 right-12 flex justify-between items-end z-10">
                      {/* QR */}
                      <div className="text-center flex flex-col items-center w-40">
                        <p className="text-[14px] font-bold text-black mb-1 whitespace-nowrap" style={{ fontFamily: 'Times New Roman, serif' }}>QR DE VERIFICACIÓN</p>
                        <div className="w-[100px] h-[100px] flex items-center justify-center relative group bg-white border border-transparent">
                          <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                          <a 
                            href={verificationUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute inset-0 bg-black/80 text-white text-xs flex items-center justify-center text-center p-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden pointer-events-auto"
                          >
                            Probar <br/> Link
                          </a>
                        </div>
                        <p className="text-[12px] text-black mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>(Insertar aquí)</p>
                      </div>
                      
                      {/* Signature */}
                      <div className="text-center flex flex-col items-center w-[400px] pb-4">
                        <div className="flex justify-center relative pointer-events-none z-10" style={{ width: '305px', height: '182px', marginBottom: '-60px', marginLeft: '30px', transform: 'translateY(30px) scale(0.75)' }}>
                          <div className="w-full h-full relative overflow-hidden">
                            <img 
                              src="/certificado-diplomado/firma-auden-viloria.svg" 
                              alt="Firma Director" 
                              className="absolute mix-blend-multiply max-w-none"
                              style={{ width: '1400px', height: '1050px', left: '-47px', top: '-47px' }}
                            />
                          </div>
                        </div>
                        <div className="border-t border-black w-full pt-2 relative z-20">
                          <p className="font-bold text-[18px] text-black uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>AUDEN VILORIA TORRES</p>
                          <p className="text-[16px] text-black" style={{ fontFamily: 'Times New Roman, serif' }}>Director Académico</p>
                        </div>
                      </div>
                      
                      {/* Unique Code */}
                      <div className="text-center flex flex-col items-center w-40 pb-7">
                        <p className="text-[14px] text-black mb-1.5 whitespace-nowrap" style={{ fontFamily: 'Times New Roman, serif' }}>Código único:</p>
                        <p className="text-[16px] text-black font-bold whitespace-nowrap" style={{ fontFamily: 'Times New Roman, serif' }}>AFLM-2026-00001</p>
                      </div>
                    </div>
                    
                    {/* Additional Footer Texts */}
                    <div className="absolute bottom-[35px] left-0 right-0 text-center z-10">
                      <p className="font-bold text-[15px] text-black uppercase tracking-wide" style={{ fontFamily: 'Times New Roman, serif' }}>
                        WWW.ACADEMIADEFORMACIONLIDERESDELMERITO.EDU.CO
                      </p>
                    </div>
                    
                    <div className="absolute bottom-[18px] left-0 right-0 text-center z-10">
                      <p className="text-[11px] text-black px-16" style={{ fontFamily: 'Arial, sans-serif' }}>
                        La autenticidad de este diploma puede verificarse escaneando el código QR o escribiendo al correo academiadeformacion@lideresdelmerito.edu.co indicando el número de acta.
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
