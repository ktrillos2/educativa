import { FormacionAcademicaList } from "@/components/formacion-academica-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookOpen, GraduationCap, Trophy, Users } from "@/components/ui/icons"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProgramInfoDialog } from "@/components/program-info-dialog"

export const metadata = {
    title: "Formación Académica - Academia de Formación Líderes del Mérito",
    description: "Descubre nuestra oferta de programas formales para impulsar tu desarrollo profesional y personal con altos estándares de calidad.",
}

export default async function FormacionAcademicaPage() {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()
    
    // Fetch ETDH courses based on type column
    const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .eq("type", "etdh")
        .order("created_at", { ascending: true })

    const initialCourses = await Promise.all((coursesData || []).map(async (course) => {
        // Buscar conteo de inscritos (bypassing RLS para obtener el total real)
        const { count: enrolledCount } = await supabaseAdmin
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id)

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            duration: "160 horas",
            students: course.students,
            badge: course.badge,
            category: course.category,
            image: course.image,
            price: course.price,
            startDate: course.start_date,
            modules: course.modules,
            minStudents: course.min_students ?? 15,
            enrolledCount: enrolledCount ?? 0,
        }
    }))

    const uniqueCategories = [
        "Todos",
        ...Array.from(new Set(initialCourses.map((c) => c.category).filter((cat): cat is string => Boolean(cat)))),
    ]

    return (
        <main className="flex-grow bg-muted/20">
            {/* Hero Section */}
            <section className="pt-[calc(6rem+2.5rem)] pb-8 min-h-[100dvh] lg:h-[100dvh] flex flex-col bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat" />
                <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center flex-grow">
                    <div>
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Oferta Académica", href: "/#oferta" }, { label: "ETDH Formación Académica" }]} />

                        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 w-full mt-4">
                            <div className="max-w-3xl w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                                        <BookOpen className="h-5 w-5 text-secondary" />
                                    </div>
                                    <span className="text-secondary text-sm font-semibold tracking-wider uppercase">FORMACIÓN ACADÉMICA DE CALIDAD</span>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                                    Programas ETDH
                                </h1>
                                <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                                    Programas orientados al fortalecimiento de conocimientos y habilidades, con contenidos pertinentes y aplicados a contextos institucionales, laborales y de gestión pública.
                                </p>
                                
                                <div className="mt-5 pl-3 py-1 border-l-2 border-secondary inline-block max-w-3xl">
                                    <h3 className="text-white font-bold text-[11px] md:text-xs uppercase mb-1">
                                        FORMACIÓN ACADÉMICA ETDH, CON RESPALDO LEGAL Y VERIFICABLE.
                                    </h3>
                                    <p className="text-white/80 text-[11px] md:text-xs leading-tight">
                                        Nuestros programas Académicos son ofrecidos con licencia de funcionamiento institucional y registro otorgado por la Secretaría de Educación del Departamento del Cesar, conforme al Decreto 1075 de 2015 del Ministerio de Educación Nacional, y son reportados en el SIET para su consulta y verificación.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full lg:w-[420px] flex-shrink-0 mt-4 lg:mt-[52px] flex justify-end">
                                <Dialog>
                                    <DialogTrigger className="w-full text-left px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors border-l-4 border-yellow-400 backdrop-blur-xl shadow-lg outline-none rounded-none cursor-pointer">
                                        <strong className="text-yellow-300 text-sm block">Información Legal Importante</strong>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl bg-foreground text-background border-yellow-500/30 rounded-none shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-yellow-400 text-xl font-bold">Información Legal Importante</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4 text-sm leading-relaxed max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <p className="mb-4">
                                                Al inscribirse en nuestros programas de Educación para el Trabajo y el Desarrollo Humano (ETDH), 
                                                el estudiante acepta los términos y condiciones de la institución. Todos nuestros programas cumplen 
                                                con las normativas vigentes del Ministerio de Educación Nacional y cuentan con el respectivo 
                                                registro ante la Secretaría de Educación pertinente. La institución se reserva el derecho de 
                                                modificar las fechas de inicio, los contenidos curriculares y el cuerpo docente según sea necesario 
                                                para garantizar la excelencia académica y cumplir con los requisitos legales establecidos. 
                                                La certificación está sujeta al cumplimiento de los requisitos académicos y de asistencia exigidos 
                                                por la ley para los programas formales.
                                            </p>
                                            <p>
                                                El presente documento constituye el acuerdo integral entre el estudiante y la institución. 
                                                Cualquier modificación a estos términos deberá realizarse por escrito y contar con la aprobación de la dirección académica. 
                                                Para información más detallada sobre las políticas de reembolso, retiro voluntario o cancelación de matrícula, 
                                                por favor consulte nuestro Manual de Convivencia y Reglamento Estudiantil vigente. 
                                                El uso de la plataforma educativa virtual y sus recursos asociados implica la aceptación total de nuestras políticas de privacidad y uso de datos.
                                            </p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 bg-white/5 backdrop-blur-sm p-4 border border-white/10 shadow-2xl items-start">
                        {[
                            { icon: GraduationCap, topText: "15+", value: "ETDH", label: "Formación Académica" },
                            { icon: BookOpen, topText: "", value: "Flexible", label: "Virtual" },
                            { icon: Users, topText: "1200+", value: "Certificados", label: "Conocimientos Académicos" },
                            { icon: Trophy, topText: "", value: "Verificable", label: "Registro en SIET" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center h-full">
                                <div className="bg-secondary/20 p-2.5 mx-auto mb-3 w-10 h-10 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                                    <stat.icon className="h-5 w-5 text-secondary" />
                                </div>
                                {stat.topText && <p className="text-base text-white/90 mb-0.5 font-medium">{stat.topText}</p>}
                                <p className="text-xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-white/70 leading-tight px-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-8 relative z-20">
                <ProgramInfoDialog type="etdh" />
            </div>

            <FormacionAcademicaList initialCourses={initialCourses} initialCategories={uniqueCategories} />
        </main>
    )
}
