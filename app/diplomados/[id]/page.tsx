import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { EnrollmentDialog } from "@/components/enrollment-dialog"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import {
    Clock,
    Users,
    CalendarDays,
    Banknote,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Download,
    AlertCircle,
    Lock
} from "@/components/ui/icons"
import { diplomados } from "@/lib/data"
import Link from "next/link"
import * as motion from "framer-motion/client"

export default async function DiplomadoDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const course = diplomados.find(d => d.id === params.id)

    if (!course) {
        notFound()
    }

    const session = await getSession()
    let isEnrolled = false
    let paymentVerified = false

    if (session?.userId) {
        const enrollment = await db.execute({
            sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND course_id = ?",
            args: [session.userId, course.id]
        })
        if (enrollment.rows.length > 0) {
            isEnrolled = true
            paymentVerified = Boolean(enrollment.rows[0].payment_verified)
        }
    }

    // Generate an array of modules based on course.modules length for visualization
    const courseModules = Array.from({ length: course.modules }).map((_, i) => ({
        id: `mod - ${i + 1} `,
        title: `Módulo ${i + 1} `,
        docName: `Modulo ${i + 1}.pdf`, // This matches the user's uploaded files (Modulo 1.pdf, etc)
        examName: `Cuestionario Modulo ${i + 1}.docx`
    }))

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
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Diplomados", href: "/diplomados" }, { label: course.title }]} />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <div className="inline-flex px-4 py-1.5 bg-secondary/20 border border-secondary/30 backdrop-blur-sm rounded-full text-sm font-bold text-secondary tracking-wide uppercase">
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
                                    { icon: Clock, text: course.duration, label: "Duración" },
                                    { icon: Users, text: course.students, label: "Cupos" },
                                    { icon: BookOpen, text: `${course.modules} Módulos`, label: "Contenido" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                                        <div className="p-2 bg-secondary/20 rounded-lg">
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
                            <div className="bg-white/95 backdrop-blur-xl text-foreground rounded-3xl p-8 shadow-2xl border border-white/20 sticky top-32">
                                {isEnrolled ? (
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-2xl mb-2 text-primary">¡Ya estás inscrito!</h3>
                                            <p className="text-muted-foreground text-sm">El acceso a este diplomado está activo en tu cuenta.</p>
                                        </div>

                                        {!paymentVerified ? (
                                            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl text-left shadow-sm">
                                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">Tu pago está <strong>pendiente de verificación</strong>. Aún no puedes descargar los módulos ni rendir exámenes.</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-left shadow-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">Pago verificado. <strong>Puedes acceder a todo el material académico.</strong></span>
                                            </div>
                                        )}

                                        <a href="#programa" className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-xl font-bold hover:bg-primary/20 transition-colors">
                                            Ir al Programa <ChevronRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
                                            <div>
                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Inversión Total</p>
                                                <span className="text-4xl font-extrabold text-primary">{course.price}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg"><CalendarDays className="w-4 h-4 text-primary" /></div>
                                                    <span className="text-sm font-medium">Inicia</span>
                                                </div>
                                                <span className="font-bold">{course.startDate}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg"><Banknote className="w-4 h-4 text-primary" /></div>
                                                    <span className="text-sm font-medium">Modalidad</span>
                                                </div>
                                                <span className="font-bold">100% Virtual</span>
                                            </div>
                                        </div>

                                        <EnrollmentDialog courseId={course.id} courseName={course.title} />

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

            {/* Modules Content */}
            <section id="programa" className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">Programa Académico</h2>
                        <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full mb-4"></div>
                        <p className="text-muted-foreground text-lg">Estructura detallada del curso diseñada para tu aprendizaje.</p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-0">
                        {courseModules.map((mod, index) => (
                            <motion.div
                                key={mod.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4 md:gap-8 group relative"
                            >
                                {/* Timeline Indicator */}
                                <div className="flex flex-col items-center pt-2">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-black border-4 border-white shadow-sm shrink-0 z-10 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                        {index + 1}
                                    </div>
                                    {index !== courseModules.length - 1 && (
                                        <div className="w-0.5 h-full min-h-[100px] bg-border/60 group-hover:bg-secondary/30 transition-colors duration-300 mt-2"></div>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/60 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 mb-8 md:mb-12">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div>
                                            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider mb-3">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                Módulo {index + 1}
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{mod.title}</h3>
                                            <p className="text-muted-foreground text-sm">Contenido fundamental y evaluación de la unidad actual.</p>
                                        </div>
                                    </div>

                                    {isEnrolled ? (
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 p-4 md:p-5 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                                                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                                                    <Download className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="block font-bold text-sm truncate mb-1">{mod.docName}</span>
                                                    {paymentVerified ? (
                                                        <a href={`/ api / download / ${mod.docName} `} download className="text-xs font-semibold text-blue-600 hover:underline">
                                                            Descargar Material
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> Pago Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 md:p-5 bg-secondary/5 rounded-xl border border-secondary/10 hover:bg-secondary/10 transition-colors">
                                                <div className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="block font-bold text-sm truncate mb-1">Examen de Unidad</span>
                                                    {paymentVerified ? (
                                                        <Link href={`/ diplomados / ${course.id} /exam/${mod.id} `} className="text-xs font-semibold text-secondary hover:underline">
                                                            Rendir Cuestionario
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> Pago Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 flex items-start gap-4 p-4 md:p-5 bg-muted/20 rounded-xl border border-dashed border-border/60 text-muted-foreground">
                                            <div className="p-2 bg-muted rounded-lg shrink-0">
                                                <Lock className="w-5 h-5 text-muted-foreground/70" />
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">
                                                Inscríbete a este diplomado para desbloquear el material de lectura y los cuestionarios de evaluación.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isEnrolled && paymentVerified && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center bg-primary/5 p-12 rounded-3xl border border-primary/10"
                        >
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">¡Felicidades por tu progreso!</h3>
                            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Cuando hayas culminado todos los módulos del programa, podrás obtener tu certificado oficial ingresando al siguiente enlace.</p>
                            <Link href={`/diplomados/${course.id}/certificado`} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                Obtener Certificado Digital <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    )
}
