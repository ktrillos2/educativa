// File updated to resolve build cache issues
import { notFound } from "next/navigation"

import { Breadcrumb } from "@/components/breadcrumb"
import { EnrollmentDialog } from "@/components/enrollment-dialog"
import { EnrollButton } from "@/components/enroll-button"
import { CoursePayment } from "@/components/course-payment"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import {
    Clock,
    Users,
    Banknote,
    BookOpen,
    CheckCircle,
    ChevronRight,
    AlertCircle,
    Award,
    Flame
} from "@/components/ui/icons"
import Link from "next/link"
import * as motion from "framer-motion/client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ETDHDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    // Buscar curso en Supabase
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

    if (!course) {
        notFound()
    }

    const session = await getSession()
    let isEnrolled = false
    let paymentVerified = false
    let whatsappLink: string | null = null;
    let liveClasses: any[] = [];
    let isExpired = false;

    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

    if (isMockPaid) {
        isEnrolled = true
        paymentVerified = true
    } else if (session?.userId) {
        // Consultar inscripción en Supabase
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select("payment_verified, group_id")
            .eq("user_id", session.userId)
            .eq("course_id", course.id)
            .maybeSingle()

        if (enrollment) {
            isEnrolled = true
            paymentVerified = Boolean(enrollment.payment_verified)
            
            if (enrollment.group_id) {
                const { data: group } = await supabase
                    .from("course_groups")
                    .select("whatsapp_link")
                    .eq("id", enrollment.group_id)
                    .maybeSingle()
                if (group?.whatsapp_link) {
                    whatsappLink = group.whatsapp_link
                }

                const { data: classesData } = await supabase
                    .from("live_classes")
                    .select("*")
                    .eq("group_id", enrollment.group_id)
                    .order("scheduled_at", { ascending: true })
                
                if (classesData) liveClasses = classesData;
            }
        }
    }

    let completedModules = 0;
    if (session?.userId && isEnrolled) {
        // Consultar progreso en Supabase
        const { data: progressCheck } = await supabase
            .from("progress")
            .select("module_id")
            .eq("user_id", session.userId)
            .eq("course_id", course.id)
            .eq("completed", true)

        completedModules = progressCheck?.length || 0;
    }

    // Build a set of approved module IDs for sequential locking
    let approvedModuleIds = new Set<string>();
    if (session?.userId && isEnrolled) {
        const { data: approvedProgress } = await supabase
            .from("progress")
            .select("module_id")
            .eq("user_id", session.userId)
            .eq("course_id", course.id)
            .eq("completed", true)
        
        approvedProgress?.forEach(p => approvedModuleIds.add(p.module_id))
    }

    // Contar inscritos reales al curso usando admin client (bypass RLS para conteo público)
    const adminSupabase = createAdminClient()
    const { count: currentEnrollments } = await adminSupabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id)

    const minStudents = course.min_students ?? 15
    const enrolledCount = currentEnrollments ?? 0
    const spotsNeeded = Math.max(0, minStudents - enrolledCount)
    const progressPercent = Math.min(100, Math.round((enrolledCount / minStudents) * 100))
    const isReadyToStart = enrolledCount >= minStudents

    const totalModules = course.modules || 1;
    const isEligibleForCert = totalModules > 0 && (completedModules / totalModules) >= 0.8;

    // Generate an array of modules based on course.modules length for visualization
    const courseModules = Array.from({ length: course.modules }).map((_, i) => {
        // We use course ID in the filename to avoid collisions between courses
        const docName = `Modulo ${i + 1} - ${course.id}.pdf`
        const examName = `Cuestionario Modulo ${i + 1} - ${course.id}.docx`
        
        // Check if file exists in the diplomados folder
        const filePath = path.join(process.cwd(), "diplomados", docName)
        const fileExists = fs.existsSync(filePath)

        return {
            id: `mod-${i + 1}`,
            title: `Módulo ${i + 1}`,
            docName,
            examName,
            fileExists
        }
    })

    return (
        <main className="flex-grow bg-muted/30 pt-24">
            {/* Premium Hero Banner */}
            <section className="relative overflow-hidden bg-primary pt-12 pb-20 text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Formación Académica", href: "/formacion-academica" }, { label: course.title }]} />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <div className="inline-flex px-4 py-1.5 bg-secondary/20 border border-secondary/30 backdrop-blur-sm text-sm font-bold text-secondary tracking-wide uppercase">
                                {course.category}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                {course.title}
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-6">
                                {[
                                    { icon: Clock, text: "160 horas", label: "Duración" },
                                    { icon: Users, text: course.students, label: "Cupos" },
                                    { icon: BookOpen, text: `${course.modules} Módulos`, label: "Contenido" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 border border-white/10">
                                        <div className="p-2 bg-secondary/20">
                                            <stat.icon className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary font-semibold uppercase">{stat.label}</p>
                                            <p className="font-bold text-white leading-tight">{stat.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <div className="bg-white/95 backdrop-blur-xl text-foreground p-8 shadow-2xl border border-white/20 sticky top-32">
                                {isEnrolled ? (
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        {!paymentVerified ? (
                                            <>
                                                <div>
                                                    <h3 className="font-bold text-2xl mb-2 text-primary">¡Inscripción Registrada!</h3>
                                                    <p className="text-muted-foreground text-sm">Estás a un paso de comenzar este programa.</p>
                                                </div>
                                                <div className="mt-6">
                                                    <CoursePayment courseId={course.id} programName={course.title} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="font-bold text-2xl mb-2 text-primary">¡Ya estás inscrito!</h3>
                                                    <p className="text-muted-foreground text-sm">El acceso a este programa está activo en tu cuenta.</p>
                                                </div>
                                                <div className={`flex items-start gap-3 p-4 border text-left shadow-sm ${isReadyToStart ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                                                    {isReadyToStart ? (
                                                        <>
                                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm">Matrícula verificada. <strong>Tienes acceso total</strong> a la plataforma de estudios.</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm">Matrícula verificada. <strong>Tu cupo está reservado.</strong> Iniciaremos clases y te notificaremos por WhatsApp cuando completemos el grupo de {minStudents} estudiantes.</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {isExpired ? (
                                                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-left shadow-sm">
                                                            <p className="text-sm font-bold mb-2 text-red-600">Tiempo límite expirado</p>
                                                            <p className="text-xs mb-4">No completaste el programa en el tiempo estipulado. Contáctate con el profesor para revisar tu caso.</p>
                                                            <a href="https://wa.me/1234567890?text=Hola,%20mi%20tiempo%20para%20terminar%20el%20diplomado%20expiró" target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 font-bold hover:bg-green-600 transition-colors shadow-sm rounded-none">
                                                                Contactar por WhatsApp
                                                            </a>
                                                        </div>
                                                    ) : !isReadyToStart ? (
                                                        whatsappLink ? (
                                                            <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-green-500 text-white py-3 font-bold hover:bg-green-600 transition-colors shadow-sm">
                                                                Unirme al grupo de WhatsApp
                                                            </a>
                                                        ) : (
                                                            <p className="text-xs text-amber-700 text-center font-semibold mt-4">Esperando apertura del grupo...</p>
                                                        )
                                                    ) : (
                                                        <a href="#programa" className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 font-bold hover:bg-primary/20 transition-colors">
                                                            Ir al Programa <ChevronRight className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
                                            <div>
                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Valor del Programa</p>
                                                <span className="text-4xl font-extrabold text-primary">{course.price}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center justify-between bg-muted/50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10"><Banknote className="w-4 h-4 text-primary" /></div>
                                                    <span className="text-sm font-medium">Modalidad</span>
                                                </div>
                                                <span className="font-bold">100% Virtual</span>
                                            </div>
                                        </div>

                                        {session?.userId ? (
                                            <EnrollButton courseId={course.id} />
                                        ) : (
                                            <EnrollmentDialog courseId={course.id} courseName={course.title} />
                                        )}

                                        {/* ── Indicador de cupos persuasivo ── */}
                                        <div className={`my-6 p-4 border-2 ${isReadyToStart ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Flame className={`w-4 h-4 ${isReadyToStart ? 'text-green-600' : 'text-amber-600'}`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${isReadyToStart ? 'text-green-700' : 'text-amber-700'}`}>
                                                        {isReadyToStart ? '¡Cupos completos! Inicia pronto' : 'Grupo formándose'}
                                                    </span>
                                                </div>
                                                <span className={`text-xs font-bold ${isReadyToStart ? 'text-green-700' : 'text-amber-700'}`}>
                                                    {enrolledCount}/{minStudents}
                                                </span>
                                            </div>

                                            {/* Barra de progreso */}
                                            <div className="w-full bg-white/80 rounded-full h-2.5 mb-2 overflow-hidden border border-black/5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all duration-700 ${isReadyToStart ? 'bg-green-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>

                                            <p className={`text-xs ${isReadyToStart ? 'text-green-700' : 'text-amber-700'}`}>
                                                {isReadyToStart
                                                    ? `✓ El grupo ya tiene los cupos mínimos. ¡Asegura tu lugar antes de que arranque!`
                                                    : spotsNeeded === 1
                                                        ? `¡Solo falta 1 persona más para arrancar! Sé quien completa el grupo.`
                                                        : `Faltan ${spotsNeeded} estudiantes para que el grupo comience. ¡Sé parte de los primeros!`
                                                }
                                            </p>
                                        </div>

                                        <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                                            <CheckCircle className="w-3.5 h-3.5 opacity-70" /> Proceso de matrícula seguro y en línea
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* Programa Académico Section */}
            <section id="programa" className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    {(!isEnrolled || paymentVerified) && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-4xl font-extrabold text-primary mb-4">Programa Académico</h2>
                        <div className="h-1.5 w-20 bg-secondary mx-auto mb-4"></div>
                        <p className="text-muted-foreground text-lg">Estructura detallada diseñada para tu formación profesional.</p>
                    </motion.div>

                    <Accordion type="multiple" className="w-full space-y-6">
                        {/* Accordion Item: Módulos de Estudio */}
                        <AccordionItem value="modulos" className="border border-border/50 bg-white">
                            <AccordionTrigger className="hover:no-underline py-4 px-6 bg-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary text-white shadow-lg shadow-primary/20">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">Módulos de Estudio</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-6 pb-2 px-6">
                                {courseModules.map((mod, index) => (
                                    <motion.div
                                        key={`mod-${mod.id}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-5 bg-muted/20 border border-border/50 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Unidad {index + 1}</span>
                                            {mod.fileExists && isEnrolled && paymentVerified && !isExpired && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5">
                                                    <CheckCircle className="w-3 h-3" /> PDF
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold mb-3 group-hover:text-primary transition-colors">{mod.title}</h4>
                                        
                                        {isEnrolled && !isExpired && paymentVerified ? (
                                            isReadyToStart ? (
                                                <Link 
                                                    href={`/estudiante/cursos/${course.id}`}
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                                                >
                                                    <BookOpen className="w-3 h-3" /> Ir al Aula Virtual
                                                </Link>
                                            ) : (
                                                <p className="text-[10px] text-amber-600 font-bold">Inicia al completar cupos</p>
                                            )
                                        ) : isEnrolled && !isExpired && !paymentVerified ? (
                                            <p className="text-[10px] text-amber-600 font-bold">Pago requerido para acceder</p>
                                        ) : isEnrolled && isExpired ? (
                                            <p className="text-[10px] text-red-600 font-bold">Tiempo expirado</p>
                                        ) : !session ? (
                                            <div className="text-[10px] text-muted-foreground space-y-1">
                                                <p>
                                                    ¿Ya estás inscrito/a?{" "}
                                                    <Link href="/login" className="text-primary hover:underline font-bold">
                                                        Inicia sesión
                                                    </Link>
                                                </p>
                                                <p>
                                                    ¿No tienes cuenta?{" "}
                                                    <Link href="/register" className="text-secondary hover:underline font-bold">
                                                        Inscríbete aquí
                                                    </Link>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground">Inscríbete para acceder</p>
                                        )}
                                    </motion.div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Accordion Item: Cuestionarios */}
                        <AccordionItem value="examenes" className="border border-border/50 bg-white">
                            <AccordionTrigger className="hover:no-underline py-4 px-6 bg-secondary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary text-white shadow-lg shadow-secondary/20">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-dark">EXÁMENES</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-6 pb-2 px-6">
                                {courseModules.map((mod, index) => (
                                    <motion.div
                                        key={`ques-${mod.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-5 bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Eval. {index + 1}</span>
                                        </div>
                                        <h4 className="font-bold mb-3 group-hover:text-secondary transition-colors">Test de Unidad</h4>
                                        
                                        {isEnrolled && !isExpired && paymentVerified ? (
                                            isReadyToStart ? (
                                                <Link 
                                                    href={`/estudiante/cursos/${course.id}`}
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
                                                >
                                                    <Award className="w-3 h-3" /> Ir al Aula Virtual
                                                </Link>
                                            ) : (
                                                <p className="text-[10px] text-amber-600 font-bold">Inicia al completar cupos</p>
                                            )
                                        ) : isEnrolled && !isExpired && !paymentVerified ? (
                                            <p className="text-[10px] text-amber-600 font-bold">Pago requerido para acceder</p>
                                        ) : isEnrolled && isExpired ? (
                                            <p className="text-[10px] text-red-600 font-bold">Tiempo expirado</p>
                                        ) : !session ? (
                                            <div className="text-[10px] text-muted-foreground space-y-1">
                                                <p>
                                                    ¿Ya estás inscrito/a?{" "}
                                                    <Link href="/login" className="text-primary hover:underline font-bold">
                                                        Inicia sesión
                                                    </Link>
                                                </p>
                                                <p>
                                                    ¿No tienes cuenta?{" "}
                                                    <Link href="/register" className="text-secondary hover:underline font-bold">
                                                        Inscríbete aquí
                                                    </Link>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground">Disponible tras inscripción</p>
                                        )}
                                    </motion.div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Accordion Item: Autoevaluación */}
                        <AccordionItem value="autoevaluacion" className="border border-border/50 bg-white">
                            <AccordionTrigger className="hover:no-underline py-4 px-6 bg-yellow-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500 text-white shadow-lg shadow-yellow-500/20">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-700">AUTOEVALUACIÓN</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-6 pb-4 px-6 text-sm text-muted-foreground leading-relaxed">
                                    <p className="font-semibold text-foreground">
                                        Mide tu progreso y asimila los conocimientos (Información Hipotética)
                                    </p>
                                    <p>
                                        La autoevaluación es un proceso fundamental en tu aprendizaje. A través de este módulo, 
                                        podrás reflexionar sobre las competencias adquiridas durante el desarrollo del programa 
                                        e identificar áreas de mejora.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 mt-2">
                                        <li>No tiene calificación numérica que afecte tu promedio.</li>
                                        <li>Te permite prepararte mejor para los exámenes finales.</li>
                                        <li>Incluye retroalimentación automática al finalizar.</li>
                                    </ul>
                                    <div className="mt-4 p-4 bg-muted/30 border border-border/50 rounded-md">
                                        <p className="text-xs font-medium">
                                            * Esta sección estará disponible en tu aula virtual una vez inicies el programa y completes el primer módulo.
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Completion Section */}
                    {isEnrolled && paymentVerified && isEligibleForCert && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-20 text-center bg-primary/5 p-12 border border-primary/10"
                        >
                            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Certificación Disponible</h3>
                            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Has completado los requisitos de este programa. Ya puedes descargar tu certificado oficial y acta de finalización.</p>
                            <Link href={`/formacion-academica/${course.id}/certificado`} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                Ver Documentos de Grado <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    )}
                    {isEnrolled && paymentVerified && !isEligibleForCert && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-20 text-center bg-muted/30 p-10 border border-border"
                        >
                            <div className="w-14 h-14 bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Certificación en Progreso</h3>
                            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                                Tu pago está verificado. Continúa estudiando y completa al menos 4 unidades (o el 80% del programa) para habilitar la descarga de tu certificado oficial.
                            </p>
                        </motion.div>
                    )}

                    {/* End of content hidden when not paid */}
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}
