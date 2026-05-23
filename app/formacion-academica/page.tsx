import { FormacionAcademicaList } from "@/components/formacion-academica-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookOpen, GraduationCap, Trophy, Users } from "@/components/ui/icons"

export const metadata = {
    title: "Formación Académica - Academia de Formación Líderes del Mérito",
    description: "Descubre nuestra oferta de programas formales para impulsar tu desarrollo profesional y personal con altos estándares de calidad.",
}

export default function FormacionAcademicaPage() {
    return (
        <main className="flex-grow bg-muted/20">
            {/* Hero Section */}
            <section className="pt-[calc(6rem+1cm)] pb-[1cm] min-h-[100dvh] flex flex-col bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat" />
                <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-between flex-grow">
                    <div>
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Oferta Académica", href: "/#oferta" }, { label: "Formación Académica" }]} />

                        <div className="max-w-3xl mt-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/90 text-sm font-semibold tracking-wider uppercase">Excelencia Educativa</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Formación Académica
                        </h1>
                        <p className="text-white/80 text-xl max-w-2xl leading-relaxed">
                            Programas diseñados para forjar los líderes del mañana, ofreciendo conocimientos profundos y habilidades clave para el éxito profesional en un entorno competitivo.
                        </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-2xl">
                        {[
                            { icon: GraduationCap, value: "15+", label: "Especialidades" },
                            { icon: BookOpen, value: "Flexible", label: "Modalidad" },
                            { icon: Users, value: "1200+", label: "Estudiantes" },
                            { icon: Trophy, value: "Avalados", label: "Por MinEducación" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                                <div className="bg-secondary/20 p-3 rounded-xl mx-auto mb-3 w-12 h-12 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                                    <stat.icon className="h-6 w-6 text-secondary" />
                                </div>
                                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FormacionAcademicaList />
        </main>
    )
}
