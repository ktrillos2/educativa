"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
    BookOpen,
    ChevronRight,
    ChevronDown,
    CheckCircle,
    Search,
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Award,
    Lock,
    BookMarked,
    Landmark,
    Sparkles,
    Scale,
    Calculator,
    Shield
} from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

interface ModuleContentReaderProps {
    courseId: string
    filename: string
}

interface TocItem {
    id: string
    title: string
    level: number
    description?: string
    keywords?: string[]
}

export function ModuleContentReader({ courseId, filename }: ModuleContentReaderProps) {
    const [activeSectionId, setActiveSectionId] = useState("introduccion")
    const [searchQuery, setSearchQuery] = useState("")
    const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
        introduccion: true
    })

    // Table of contents structure compiled directly from user request
    const tocItems: TocItem[] = useMemo(() => [
        {
            id: "introduccion",
            title: "Introducción",
            level: 1,
            description: "Presentación general de los objetivos de aprendizaje y la estructura del Estatuto Orgánico del Presupuesto.",
            keywords: ["Presupuesto Público", "EOP", "Finanzas Públicas"]
        },
        {
            id: "marco-conceptual",
            title: "Marco Conceptual y Legal",
            level: 1,
            description: "Estudio de las bases constitucionales, normativas y conceptuales de la gestión presupuestal.",
            keywords: ["Constitución", "Decreto 111 de 1996", "Leyes Orgánicas"]
        },
        {
            id: "marco-conceptual-eop",
            title: "Concepto y Cobertura del EOP",
            level: 2,
            description: "El Estatuto Orgánico del Presupuesto (EOP) como marco normativo supremo del presupuesto público.",
            keywords: ["Cobertura", "Estatuto Orgánico", "Ley Orgánica"]
        },
        {
            id: "marco-conceptual-niveles",
            title: "Niveles del Estatuto Orgánico del Presupuesto",
            level: 2,
            description: "Jerarquía y aplicación de las normas presupuestales en los diferentes ámbitos del Estado.",
            keywords: ["Niveles Presupuestales", "Jerarquía Normativa"]
        },
        {
            id: "marco-conceptual-central",
            title: "Presupuesto del Nivel Central (Nación, Departamento y Municipio)",
            level: 2,
            description: "Aplicación y alcance en las entidades públicas del nivel central territorial.",
            keywords: ["Nación", "Departamentos", "Municipios"]
        },
        {
            id: "marco-conceptual-eice",
            title: "Empresas Industriales y Comerciales del Estado (EICE)",
            level: 2,
            description: "Tratamiento presupuestal diferenciado para las entidades públicas industriales.",
            keywords: ["EICE", "Autonomía Financiera", "Empresas Públicas"]
        },
        {
            id: "marco-conceptual-sem",
            title: "Sociedades de Economía Mixta (SEM)",
            level: 2,
            description: "Régimen presupuestal aplicable a las entidades con capital público y privado.",
            keywords: ["SEM", "Capital Mixto", "Régimen Comercial"]
        },
        {
            id: "marco-conceptual-metas",
            title: "Fijación de Metas Financieras y Distribución de Excedentes",
            level: 2,
            description: "Cómo se definen los objetivos financieros generales y el destino de las utilidades públicas.",
            keywords: ["Metas Financieras", "Excedentes Financieros", "CONFIS"]
        },
        {
            id: "sistema-presupuestal",
            title: "Sistema Presupuestal",
            level: 1,
            description: "Análisis de las herramientas e instrumentos de planificación y presupuesto que componen el sistema.",
            keywords: ["Sistema Presupuestal", "Planificación Financiera"]
        },
        {
            id: "sistema-presupuestal-plan",
            title: "Plan Financiero",
            level: 2,
            description: "Instrumento de planificación y gestión financiera de mediano plazo.",
            keywords: ["Plan Financiero", "Mediano Plazo", "Sostenibilidad"]
        },
        {
            id: "sistema-presupuestal-poai",
            title: "Plan Operativo Anual de Inversiones (POAI)",
            level: 2,
            description: "Vínculo entre el Plan de Desarrollo y el Presupuesto Anual de Inversión.",
            keywords: ["POAI", "Inversión Pública", "Proyectos de Inversión"]
        },
        {
            id: "sistema-presupuestal-general",
            title: "Presupuesto General",
            level: 2,
            description: "La estructura e integración de la estimación de ingresos y apropiación de gastos.",
            keywords: ["Presupuesto General", "Ingresos y Gastos"]
        },
        {
            id: "sistema-presupuestal-general-conformacion",
            title: "Conformación del Presupuesto",
            level: 3,
            description: "Estructura interna del Presupuesto General de la Nación (PGN).",
            keywords: ["Estructura", "Presupuesto General"]
        },
        {
            id: "sistema-presupuestal-general-ingresos",
            title: "Presupuesto de Ingresos o Rentas y Recursos de Capital",
            level: 3,
            description: "Estimación de ingresos corrientes y fuentes de financiación de capital.",
            keywords: ["Ingresos Corrientes", "Recursos de Capital", "Rentas"]
        },
        {
            id: "sistema-presupuestal-general-gastos",
            title: "Presupuesto de Gastos o Apropiaciones",
            level: 3,
            description: "Límites máximos de gasto autorizados para funcionamiento, inversión y deuda.",
            keywords: ["Gastos", "Funcionamiento", "Inversión", "Deuda"]
        },
        {
            id: "sistema-presupuestal-general-disposiciones",
            title: "Disposiciones Generales",
            level: 3,
            description: "Normas de ejecución que rigen exclusivamente para el año fiscal respectivo.",
            keywords: ["Disposiciones Generales", "Ejecución Presupuestal"]
        },
        {
            id: "coordinacion",
            title: "Coordinación del Sistema Presupuestal",
            level: 1,
            description: "Instancias de gobernanza y toma de decisiones financieras en el sector público.",
            keywords: ["Coordinación", "CONFIS", "Ministerio de Hacienda"]
        },
        {
            id: "coordinacion-confis",
            title: "Comité de Hacienda o CONFIS",
            level: 2,
            description: "El Consejo Superior de Política Fiscal (CONFIS) como rector de la política fiscal.",
            keywords: ["CONFIS", "Consejo Superior", "Política Fiscal"]
        },
        {
            id: "coordinacion-funciones",
            title: "Funciones del Comité de Hacienda",
            level: 2,
            description: "Competencias detalladas y responsabilidades legales del CONFIS.",
            keywords: ["Funciones CONFIS", "Aprobación Financiera"]
        },
        {
            id: "principios",
            title: "Principios del Sistema Presupuestal",
            level: 1,
            description: "Los postulados fundamentales que rigen y limitan la actividad presupuestal del Estado.",
            keywords: ["Principios", "Reglas Presupuestales", "Legalidad"]
        },
        {
            id: "principios-planificacion",
            title: "Planificación",
            level: 2,
            description: "Concordancia entre el Presupuesto y el Plan Nacional/Territorial de Desarrollo.",
            keywords: ["Planificación", "Plan de Desarrollo"]
        },
        {
            id: "principios-anualidad",
            title: "Anualidad",
            level: 2,
            description: "El año fiscal comienza el 1 de enero y termina el 31 de diciembre.",
            keywords: ["Anualidad", "Año Fiscal", "Vigencia"]
        },
        {
            id: "principios-universalidad",
            title: "Universalidad",
            level: 2,
            description: "El presupuesto debe contener la totalidad de los gastos previstos.",
            keywords: ["Universalidad", "Totalidad de Gastos"]
        },
        {
            id: "principios-unidad-caja",
            title: "Unidad de Caja",
            level: 2,
            description: "Con el recaudo de todos los ingresos se atiende el pago oportuno de las apropiaciones.",
            keywords: ["Unidad de Caja", "Tesorería", "Recaudo"]
        },
        {
            id: "principios-programacion",
            title: "Programación Integral",
            level: 2,
            description: "Todo programa de gastos debe contemplar conjuntamente funcionamiento e inversión.",
            keywords: ["Programación Integral", "Funcionamiento", "Inversión"]
        },
        {
            id: "principios-especializacion",
            title: "Especialización",
            level: 2,
            description: "Las apropiaciones deben referirse en cada organismo exclusivamente a su objeto y funciones.",
            keywords: ["Especialización", "Destinación Específica"]
        },
        {
            id: "principios-inembargabilidad",
            title: "Inembargabilidad",
            level: 2,
            description: "Las rentas y recursos del presupuesto general son inembargables.",
            keywords: ["Inembargabilidad", "Bienes Públicos", "Garantía Social"]
        },
        {
            id: "principios-coherencia",
            title: "Coherencia Macroeconómica",
            level: 2,
            description: "El presupuesto debe ser compatible con las metas macroeconómicas del Banco de la República.",
            keywords: ["Coherencia", "Metas Inflación", "Banco de la República"]
        },
        {
            id: "principios-homeostasis",
            title: "Homeóstasis Presupuestal",
            level: 2,
            description: "El crecimiento del presupuesto debe guardar congruencia con el crecimiento económico.",
            keywords: ["Homeóstasis", "Equilibrio Financiero"]
        },
        {
            id: "marco-procedimental",
            title: "Marco o Aspectos Procedimentales (EOP)",
            level: 1,
            description: "Etapas y procedimientos específicos para la estructuración y clasificación del presupuesto.",
            keywords: ["Procedimientos", "Fases Presupuestales"]
        },
        {
            id: "marco-procedimental-general",
            title: "Presupuesto General",
            level: 2,
            description: "Proceso operativo general y su articulación orgánica.",
            keywords: ["Presupuesto General", "Operación Presupuestal"]
        },
        {
            id: "marco-procedimental-general-conformacion",
            title: "Conformación del Presupuesto (Aspecto Procedimental)",
            level: 3,
            description: "Fases y reglas para dar forma y estructura al presupuesto en el Estatuto.",
            keywords: ["Conformación", "Fases"]
        },
        {
            id: "marco-procedimental-general-conformacion-ingresos",
            title: "Presupuesto de Ingresos",
            level: 4,
            description: "Procedimiento detallado de estimación y clasificación de ingresos públicos.",
            keywords: ["Ingresos", "Recaudo", "Tributos"]
        },
        {
            id: "marco-procedimental-general-conformacion-gastos",
            title: "Presupuesto de Gastos",
            level: 4,
            description: "Procedimiento de asignación, distribución y autorización de gastos del Estado.",
            keywords: ["Gastos", "Apropiaciones", "Asignación"]
        },
        {
            id: "marco-procedimental-general-conformacion-disposiciones",
            title: "Disposiciones Generales (Aspecto Procedimental)",
            level: 4,
            description: "Pautas formales para la redacción y vigencia de las normas de ejecución anual.",
            keywords: ["Normativa de Ejecución", "Vigencia Anual"]
        },
        {
            id: "marco-procedimental-rentas",
            title: "Presupuesto de Rentas y Recursos de Capital",
            level: 2,
            description: "Procedimiento de desglose y ordenamiento de los ingresos del Estado.",
            keywords: ["Rentas", "Recursos de Capital"]
        },
        {
            id: "marco-procedimental-rentas-naturaleza",
            title: "Clasificación por Naturaleza",
            level: 3,
            description: "Identificación de los ingresos según su origen intrínseco (tributario, no tributario).",
            keywords: ["Clasificación por Naturaleza", "Impuestos Directos", "Impuestos Indirectos"]
        },
        {
            id: "marco-procedimental-rentas-destinacion",
            title: "Clasificación por Destinación",
            level: 3,
            description: "Organización de las rentas con base en si tienen un fin legal predeterminado o de libre inversión.",
            keywords: ["Clasificación por Destinación", "Destinación Específica", "Rentas Libres"]
        },
        {
            id: "marco-procedimental-rentas-temporalidad",
            title: "Clasificación por Temporalidad",
            level: 3,
            description: "División de los recursos en ordinarios o recurrentes, y extraordinarios o coyunturales.",
            keywords: ["Temporalidad", "Ingresos Ordinarios", "Ingresos Extraordinarios"]
        },
        {
            id: "marco-procedimental-nacion",
            title: "Clasificación del Presupuesto de Ingresos y Gastos de la Nación",
            level: 2,
            description: "Especificaciones metodológicas del presupuesto a nivel nacional colombiano.",
            keywords: ["Presupuesto de la Nación", "PGN"]
        },
        {
            id: "marco-procedimental-nacion-composicion",
            title: "Composición de los Ingresos",
            level: 3,
            description: "Desglose formal de los recursos de la Nación, incluyendo tributos, tasas y contribuciones.",
            keywords: ["Composición Ingresos", "Impuestos", "Tasas", "Contribuciones"]
        },
        {
            id: "marco-procedimental-nacion-rentas",
            title: "Clasificación del Presupuesto de Rentas y Recursos de Capital (Nación)",
            level: 3,
            description: "Régimen nacional aplicable a créditos externos, cofinanciaciones, excedentes y donaciones.",
            keywords: ["Crédito Externo", "Donaciones", "Excedentes Centrales"]
        },
        {
            id: "marco-procedimental-gastos",
            title: "Presupuesto de Gastos o Apropiaciones",
            level: 2,
            description: "Normas de estructuración y categorización del gasto a nivel nacional.",
            keywords: ["Gastos", "Apropiaciones", "Servicios"]
        },
        {
            id: "marco-procedimental-gastos-clasificacion",
            title: "Clasificación de los Gastos",
            level: 3,
            description: "Divisiones formales de los recursos asignados (Gastos de Personal, Adquisición de Bienes, etc.).",
            keywords: ["Clasificación Gastos", "Gasto de Funcionamiento"]
        },
        {
            id: "marco-procedimental-gastos-clasificacion-deuda",
            title: "Servicio de la Deuda Pública",
            level: 4,
            description: "Apropiaciones destinadas a amortizar capital, pagar intereses y comisiones de deuda nacional o externa.",
            keywords: ["Servicio de la Deuda", "Amortización", "Intereses"]
        },
        {
            id: "marco-procedimental-gastos-clasificacion-inversion",
            title: "Gastos de Inversión",
            level: 4,
            description: "Apropiaciones destinadas al incremento del patrimonio social, infraestructura y programas de desarrollo.",
            keywords: ["Inversión", "Infraestructura", "Desarrollo Social"]
        }
    ], [])

    // Filtered TOC items based on search query
    const filteredTocItems = useMemo(() => {
        if (!searchQuery.trim()) return tocItems
        const query = searchQuery.toLowerCase()
        return tocItems.filter(item => 
            item.title.toLowerCase().includes(query) || 
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query)))
        )
    }, [searchQuery, tocItems])

    // Find current index of the active section
    const activeSectionIndex = useMemo(() => {
        return tocItems.findIndex(item => item.id === activeSectionId)
    }, [activeSectionId, tocItems])

    const handleNext = () => {
        if (activeSectionIndex < tocItems.length - 1) {
            const nextSec = tocItems[activeSectionIndex + 1]
            setActiveSectionId(nextSec.id)
            setCompletedSections(prev => ({ ...prev, [nextSec.id]: true }))
            document.getElementById("reader-scroll-top")?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handlePrev = () => {
        if (activeSectionIndex > 0) {
            const prevSec = tocItems[activeSectionIndex - 1]
            setActiveSectionId(prevSec.id)
            document.getElementById("reader-scroll-top")?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleSelectSection = (id: string) => {
        setActiveSectionId(id)
        setCompletedSections(prev => ({ ...prev, [id]: true }))
        document.getElementById("reader-scroll-top")?.scrollIntoView({ behavior: "smooth" })
    }

    // Dynamic progress calculation
    const readingProgress = useMemo(() => {
        const completedCount = Object.keys(completedSections).length
        return Math.min(100, Math.round((completedCount / tocItems.length) * 100))
    }, [completedSections, tocItems])

    // Generate premium educational text content dynamically based on the section
    const renderActiveContent = () => {
        switch (activeSectionId) {
            case "introduccion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Unidad 1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Estatuto Orgánico del Presupuesto (EOP)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El presupuesto se puede definir como <span className="font-semibold text-slate-900">“la herramienta que le permite al sector público cumplir con la producción de bienes y servicios públicos para satisfacción de las necesidades de la población de conformidad con el rol asignado al Estado en la economía y sociedad del país”</span> (Asociación Internacional del Presupuesto Público, ASIP).
                        </p>
                        <p className="text-base leading-relaxed text-slate-600">
                            La actividad presupuestaria del Estado, en cualquiera de sus niveles, se expresa como una asignación de recursos para el cumplimiento de una actividad concreta, en un periodo de tiempo, a fin de obtener unos resultados concretos (bienes y servicios) para la satisfacción de las necesidades públicas. Existen, por tanto, interrelaciones entre presupuesto, acción estatal y organización social.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20  p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-primary text-white w-fit  mb-4 shadow-lg shadow-primary/20">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Objetivos de la Unidad</h3>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                        <span>Comprender el alcance legal e institucional del EOP a nivel nacional y territorial.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                        <span>Identificar la conformación del Sistema Presupuestal y su vinculación con el Plan de Desarrollo.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                        <span>Analizar y aplicar los Principios Presupuestales que rigen la actividad pública.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20  p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-secondary text-secondary-foreground w-fit  mb-4 shadow-lg shadow-secondary/15">
                                    <BookMarked className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Estructura Temática</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    A lo largo de este módulo exploraremos los fundamentos conceptuales de las finanzas estatales, las normas que rigen a los entes territoriales e industriales, el rol del CONFIS, y el procedimiento técnico para ordenar los gastos e ingresos de la Nación.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/70 border border-border text-xs  font-medium">9 Temas Clave</span>
                                    <span className="px-3 py-1 bg-white/70 border border-border text-xs  font-medium">10 Principios</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-6  mt-8">
                            <h3 className="font-bold text-lg text-slate-900 mb-2">¿Cómo utilizar este visor interactivo?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Este lector interactivo ha sido desarrollado por <strong>K&T</strong> para brindarte una experiencia de aprendizaje premium. Utiliza el panel de navegación izquierdo para explorar los subtemas estructurados en jerarquías lógicas. En cada sección encontrarás el material de estudio resumido, explicaciones ilustrativas y conceptos técnicos detallados. Al finalizar de leer cada tema, avanza con los controles ubicados al final de la página.
                            </p>
                        </div>
                    </div>
                )
            case "marco-conceptual":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Sección 1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Marco Conceptual y Legal</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La gestión presupuestal del Estado colombiano no es discrecional; se fundamenta en un sólido bloque de constitucionalidad y legalidad. Este marco tiene como finalidad garantizar que el dinero público se recaude y asigne con criterios técnicos de transparencia, eficiencia e impacto social.
                        </p>
                        <p className="text-base leading-relaxed text-slate-600">
                            El presupuesto como instrumento financiero por excelencia, está llamado a permitir al Estado garantizar el cumplimiento de su función económica y asegurar la coordinación y organización eficiente en la producción de bienes y servicios públicos.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-6  flex gap-4 items-start shadow-sm">
                            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="font-bold text-sm">Base Constitucional</h4>
                                <p className="text-xs leading-relaxed text-blue-800/90">
                                    El Título XII, Capítulo 3 de la Constitución Política de Colombia (Artículos 345 a 355) establece las directrices supremas del régimen presupuestal del país. Dicta que no podrá hacerse ningún gasto público que no haya sido previamente aprobado por el Congreso, las asambleas departamentales o los concejos distritales y municipales.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Pilares Legales del Sistema</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Ley 38 de 1989", desc: "Norma fundacional del Estatuto Orgánico, encargada de regular los aspectos generales del presupuesto general de la Nación." },
                                    { title: "Ley 179 de 1994", desc: "Introdujo reformas sustanciales orientadas a la modernización y flexibilización de la gestión fiscal." },
                                    { title: "Ley 225 de 1995", desc: "Realizó modificaciones técnicas al régimen de ingresos, recursos de capital y disposiciones generales." }
                                ].map((ley, idx) => (
                                    <div key={idx} className="bg-white border border-border p-5  shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Norma</span>
                                        <h4 className="font-extrabold text-slate-900 mt-1 mb-2">{ley.title}</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">{ley.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-6  flex flex-col md:flex-row items-center gap-6 mt-8">
                            <div className="p-4 bg-primary/10  text-primary">
                                <Landmark className="w-10 h-10" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-bold text-slate-900">Decreto Único Compilatorio: Decreto 111 de 1996</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Con el fin de evitar la dispersión normativa, el Gobierno Nacional compiló estas leyes orgánicas en el <strong>Decreto 111 de 1996</strong>, el cual constituye hoy en día la carta de navegación fundamental para el diseño y administración del presupuesto estatal.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-conceptual-eop":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Concepto y Cobertura del EOP</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El <strong>Estatuto Orgánico del Presupuesto (EOP)</strong> es una ley orgánica y, por lo tanto, tiene una jerarquía superior sobre las leyes ordinarias. Esto significa que la ley anual de presupuesto debe estar estrictamente supeditada a las disposiciones generales y los principios trazados en el Estatuto.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">¿Qué comprende la cobertura del EOP?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Estatuto consta de dos niveles de cobertura que determinan a qué organismos y entidades del Estado se les aplica su régimen. Este alcance asegura la consistencia fiscal global de las cuentas públicas del país.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="border border-border/80 p-5  bg-slate-50/50">
                                    <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Primer Nivel</span>
                                    <h4 className="font-bold text-slate-900 mt-1 mb-2">Presupuesto General de la Nación (PGN)</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                        Compuesto por el presupuesto del nivel central con excepción de los presupuestos de los establecimientos públicos, las empresas industriales y comerciales del Estado y las sociedades de economía mixta con el régimen de aquellas.
                                    </p>
                                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                                        <li>Ramas del Poder Público (Legislativa, Ejecutiva, Judicial).</li>
                                        <li>Ministerio Público (Procuraduría General, Defensoría).</li>
                                        <li>Contraloría General de la República.</li>
                                        <li>Organización Electoral (Registraduría Nacional, CNE).</li>
                                        <li>Ministerios y Departamentos Administrativos.</li>
                                    </ul>
                                </div>

                                <div className="border border-border/80 p-5  bg-slate-50/50">
                                    <span className="text-xs font-extrabold text-secondary uppercase tracking-wider">Segundo Nivel</span>
                                    <h4 className="font-bold text-slate-900 mt-1 mb-2">Entidades Descentralizadas y Estatales</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                        Fija las directrices fiscales y presupuestales aplicables a los entes con personería jurídica y régimen comercial o especial:
                                    </p>
                                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                                        <li>Fijación de metas financieras a todo el sector público.</li>
                                        <li>Distribución de excedentes de las EICE y SEM no financieras.</li>
                                        <li>Empresas de servicios públicos domiciliarios con participación estatal del 90% o más.</li>
                                        <li>Empresas Sociales del Estado (ESE) que constituyen una categoría especial.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-secondary/20 p-6 ">
                            <h4 className="font-bold text-slate-900 mb-2">Regla de Oro Presupuestal</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Ninguna autoridad podrá contraer obligaciones públicas con cargo al tesoro o que comprometan vigencias futuras sin la previa autorización legal o reglamentaria consignada en el marco legal del EOP. Toda erogación debe tener una partida de ingreso equivalente.
                            </p>
                        </div>
                    </div>
                )
            case "marco-conceptual-niveles":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Niveles del Estatuto Orgánico</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Las directrices contenidas en el Estatuto Orgánico del Presupuesto operan bajo un principio de <strong>jerarquía e integración</strong>. Ello implica que las entidades estatales están sujetas a diferentes niveles de regulación presupuestal según su naturaleza jurídica y ámbito geográfico.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                                <h3 className="text-xl font-bold text-slate-950">Los Niveles del Estatuto</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: "Nivel Central del Presupuesto General", desc: "Compuesto por el presupuesto del nivel central propiamente dicho. Abarca los ministerios, departamentos administrativos, órganos constitucionales, ramas legislativa y judicial, y los organismos de control en todos los órdenes territoriales." },
                                        { title: "Establecimientos Públicos y Entidades Descentralizadas", desc: "Se les aplican las disposiciones del Estatuto que rigen a los establecimientos públicos del Estado. Aplica a todas las personas jurídicas públicas cuyo patrimonio esté constituido por fondos públicos, cuenten con patrimonio propio, autonomía administrativa y personería jurídica." },
                                        { title: "Empresas Industriales y Comerciales del Estado (EICE) y Sociedades de Economía Mixta (SEM)", desc: "Se les aplicarán las normas del Estatuto que contengan regulaciones expresas sobre las mismas. Los demás aspectos serán regulados por sus respectivas juntas directivas, siguiendo los lineamientos que para el mismo tipo de entidades tiene la Nación." }
                                    ].map((nivel, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 ">
                                            <h4 className="font-extrabold text-slate-900 mb-1">{nivel.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{nivel.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "marco-conceptual-central":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto del Nivel Central (Nación, Departamento y Municipio)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La articulación del presupuesto del nivel central se basa en la correspondencia fiscal entre la <strong>Nación, los Departamentos y los Municipios</strong>. Cada uno de estos niveles cuenta con competencias propias asignadas por la ley, y sus estructuras presupuestales reflejan su autonomía relativa.
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[
                                { 
                                    level: "Nivel Nacional", 
                                    icon: Landmark, 
                                    focus: "Presupuesto de la Nación", 
                                    desc: "Comprende: Ramas Legislativa y Judicial, Rama Ejecutiva del nivel nacional (Presidencia), Ministerio Público (Procuraduría), Contraloría General de la República, Organización Electoral (Registraduría), Ministerios y Departamentos Administrativos." 
                                },
                                { 
                                    level: "Nivel Departamental", 
                                    icon: Scale, 
                                    focus: "Presupuesto Departamental", 
                                    desc: "Comprende: Despacho del Gobernador, Secretarías y Departamentos Administrativos, Organismos de Control regional, Asamblea Departamental." 
                                },
                                { 
                                    level: "Nivel Municipal", 
                                    icon: Calculator, 
                                    focus: "Presupuesto Municipal", 
                                    desc: "Comprende: Despacho del Alcalde, Secretarías de Despacho, Organismos de Control local, Concejo Municipal, Personería Municipal." 
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-border  p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="p-3 bg-primary/10 text-primary  w-fit">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{item.level}</h3>
                                        <span className="inline-block text-[10px] bg-secondary/20 text-secondary font-bold px-2 py-0.5  uppercase tracking-wider">{item.focus}</span>
                                        <p className="text-xs text-slate-600 leading-relaxed pt-2">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case "marco-conceptual-eice":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.4</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Empresas Industriales y Comerciales del Estado (EICE)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Las <strong>Empresas Industriales y Comerciales del Estado (EICE)</strong> son entidades descentralizadas creadas por la ley que desarrollan actividades de naturaleza comercial o industrial y de gestión económica, de acuerdo con las reglas del derecho privado (salvo excepciones consagradas por ley).
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Clasificación Presupuestal</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Estatuto clasifica presupuestalmente a las EICE en dos categorías fundamentales para regular sus finanzas y excedentes financieros:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="border border-border/60 p-5  bg-slate-50">
                                    <span className="text-xs font-bold text-primary uppercase">Categoría 1</span>
                                    <h4 className="font-extrabold text-slate-900 text-base mt-1 mb-2">EICE Societarias</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Participa la Nación y otras entidades públicas o mixtas. El porcentaje de excedentes financieros se distribuye y determina estrictamente según su participación accionaria.
                                    </p>
                                </div>
                                <div className="border border-border/60 p-5  bg-slate-50">
                                    <span className="text-xs font-bold text-primary uppercase">Categoría 2</span>
                                    <h4 className="font-extrabold text-slate-900 text-base mt-1 mb-2">EICE No Societarias</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Tienen el 100% de participación de la Nación o del ente territorial (por ejemplo, en el orden nacional, Ecopetrol es una sociedad por acciones de carácter comercial de la cual el Estado posee la gran mayoría).
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-100/80  border border-slate-200 text-xs font-mono text-slate-700 mt-4">
                                <strong>Fórmula de Excedente Neto:</strong> Excedente = Patrimonio - Capital Social - Reservas - Superávit y Donaciones
                            </div>
                        </div>
                    </div>
                )
            case "marco-conceptual-sem":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.5</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Sociedades de Economía Mixta (SEM)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Las <strong>Sociedades de Economía Mixta (SEM)</strong> son organismos constituidos bajo la forma de sociedades comerciales con aportes estatales y de capital privado. Desarrollan actividades de naturaleza industrial o mercantil en competencia con particulares.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Aplicación del Régimen Presupuestal</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Estatuto establece una división clara para el manejo presupuestal de estas sociedades:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="p-5 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 mb-2">1. SEM Financieras</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Entidades públicas dedicadas al sector financiero (por ejemplo, bancos de segundo piso como FINDETER, FEN o empresas estatales de leasing y crédito). Tienen regulaciones particulares por la Superintendencia Financiera.
                                    </p>
                                </div>

                                <div className="p-5 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 mb-2">2. SEM No Financieras</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Sujetas a los lineamientos del Estatuto para la distribución y reporte de excedentes. En general, los excedentes financieros se calculan según el porcentaje de participación del Estado sobre la utilidad disponible de la empresa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "marco-conceptual-metas":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 1.6</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Fijación de Metas Financieras y Distribución de Excedentes</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La estabilidad de las finanzas del Estado requiere un control centralizado de los objetivos de endeudamiento, déficit y acumulación de utilidades. Este control se efectúa mediante la <strong>fijación de metas financieras</strong> y la regulación de los excedentes de las entidades públicas.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border border-border p-6  shadow-sm space-y-3">
                                <span className="text-xs uppercase font-extrabold text-primary tracking-wider">Directrices</span>
                                <h3 className="text-base font-bold text-slate-900">1. Controles de Gobierno</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    El Gobierno Nacional establece las directrices y controles para la elaboración y ejecución de los presupuestos de las Empresas Industriales y Comerciales del Estado (EICE) y Sociedades de Economía Mixta (SEM), así como de la distribución de sus excedentes.
                                </p>
                            </div>

                            <div className="bg-white border border-border p-6  shadow-sm space-y-3">
                                <span className="text-xs uppercase font-extrabold text-primary tracking-wider">Giro a la Nación</span>
                                <h3 className="text-base font-bold text-slate-900">2. Excedentes EICE</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Los excedentes financieros de las EICE son propiedad de la Nación. El CONPES define la cuantía que se debe reintegrar anualmente al Tesoro Público para el Presupuesto General. El Estatuto determina que un mínimo del 20% debe reinvertirse en la misma empresa.
                                </p>
                            </div>

                            <div className="bg-white border border-border p-6  shadow-sm space-y-3">
                                <span className="text-xs uppercase font-extrabold text-primary tracking-wider">Participación</span>
                                <h3 className="text-base font-bold text-slate-900">3. Utilidades SEM</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Las utilidades de las SEM nacionales corresponden a la Nación proporcionalmente a su participación en el capital social. El CONPES define qué parte se capitalizará, reservará o repartirá como dividendos públicos.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Sección 2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">El Sistema Presupuestal</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            En Colombia, el presupuesto no funciona como un elemento aislado o desarticulado. Por el contrario, se inscribe dentro de un concepto superior denominado el <strong>Sistema Presupuestal</strong>, compuesto por tres instrumentos técnicos que se enlazan secuencialmente para garantizar la planeación financiera del Estado.
                        </p>
                        <p className="text-base leading-relaxed text-slate-600">
                            La Constitución y la Ley Orgánica de Presupuesto determinan los procedimientos que se deben seguir para aprobar y ejecutar los presupuestos anuales. Para lograr la articulación con el desarrollo local, la Entidad Pública debe adoptar un sistema presupuestal, ordenado por el Estatuto Orgánico del Presupuesto (EOP), que permita una adecuada programación y elaboración del presupuesto, así como una eficiente ejecución del mismo.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Los Tres Componentes del Sistema Presupuestal</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Estatuto establece en su artículo 6º que el Sistema Presupuestal está constituido de forma integral por:
                            </p>

                            <div className="space-y-4 pt-2">
                                {[
                                    { title: "El Plan Financiero (PF)", desc: "Instrumento de planificación y gestión financiera a mediano plazo que coordina la política de ingresos, gastos, déficit y financiamiento." },
                                    { title: "El Plan Operativo Anual de Inversiones (POAI)", desc: "Prioriza los proyectos de inversión a ejecutar financiados o cofinanciados con recursos del presupuesto de la vigencia fiscal respectiva." },
                                    { title: "El Presupuesto General de la Entidad", desc: "Acto administrativo de estimación anual de ingresos y autorización de gastos que materializa de forma operativa los planes anteriores." }
                                ].map((componente, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 border border-border/70  hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8  bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{componente.title}</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed mt-1">{componente.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-plan":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">El Plan Financiero</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El <strong>Plan Financiero</strong> es un instrumento de planificación y gestión financiera, coordinador de la política del gasto con los objetivos económicos del representante legal de la Entidad Pública. Toma en consideración las previsiones de ingreso, gasto, déficit y su financiación compatible con el programa anual de caja y el Plan de Desarrollo.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Importancia y Proyección Temporal</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Plan Financiero permite a todos los niveles de la administración pública proyectar la necesidad de recursos durante el periodo del gobernante para atender la realización de obras, que sin esto no es factible obtener durante una sola vigencia fiscal.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Por consiguiente, el Plan Financiero crea una expectativa de recursos financieros que se van cristalizando vigencia tras vigencia en el Plan Operativo Anual de Inversiones.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 border border-border  bg-slate-50">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Base del PAC</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        El Plan define las metas máximas de pago a efectuarse durante el año, que servirán de base para elaborar el Programa Anual Mensualizado de Caja (PAC). Tiene como base las proyecciones efectivas de caja.
                                    </p>
                                </div>
                                <div className="p-4 border border-border  bg-slate-50">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Metas Cuantificables</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        En este Plan se deben establecer metas cuantificables de recaudo, gastos de funcionamiento, manejo de la deuda e inversión, garantizando la financiación del Plan de Desarrollo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-poai":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Plan Operativo Anual de Inversiones (POAI)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El <strong>Plan Operativo Anual de Inversiones (POAI)</strong> es el instrumento de priorización de las inversiones contempladas y la materialización en la vigencia fiscal respectiva en el plan plurianual de inversiones del Plan de Desarrollo o programa de gobierno.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Estructura del POAI</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El POAI es un instrumento de planeación de corto plazo para el manejo de la inversión en las Entidades del Estado. Sus principales lineamientos legales (Ley 715 de 2001 y Ley 152 de 1994) obligan a:
                            </p>

                            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                                <li>Señalar los proyectos de inversión a ejecutar financiados o cofinanciados con recursos del presupuesto.</li>
                                <li>Clasificar los proyectos por sectores, órganos y programas específicos.</li>
                                <li>Precisar de manera clara y explícita las fuentes de financiación de cada inversión.</li>
                                <li>Establecer indicadores de resultado detallados para el control de la gestión del gasto social.</li>
                                <li>Guardar estricta concordancia con el plan plurianual de inversiones contemplado en el artículo 31 de la Ley 152 de 1994 y contenido en el Plan de Desarrollo.</li>
                            </ul>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-general":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">El Presupuesto General</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El <strong>Presupuesto General</strong> es un acto administrativo por el cual se prevén o se computan anticipadamente las rentas e ingresos que la Entidad espera recibir en una determinada vigencia fiscal, lo mismo que los gastos y apropiaciones en que incurrirán todos los órganos que lo integran y refleja las proyecciones del Plan Financiero.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Funciones y Utilidad del Presupuesto</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El presupuesto general sirve como instrumento político, económico, financiero y administrativo para la toma de decisiones del Estado, determinar la categorización institucional y las cuantías autorizadas para contratar, entre otros.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El acuerdo anual sobre el Presupuesto General de la Entidad es el instrumento mediante el cual se da aplicación operativa al Plan de Desarrollo municipal o territorial.
                            </p>

                            <div className="p-4 bg-slate-50 border border-slate-200  flex gap-3 items-start">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Preparación Técnica Obligatoria</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        De su ejecución anual depende el cumplimiento de las metas fijadas por la administración. Por tal motivo, su proceso de preparación debe ser abordado técnicamente para evitar la sobreestimación de ingresos, la subvaloración de los gastos, o viceversa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-general-conformacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.3.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Conformación del Presupuesto</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El Estatuto Orgánico del Presupuesto define que la conformación del Presupuesto General consta de tres (3) partes o divisiones fundamentales y obligatorias:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 border border-border bg-white  shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5  uppercase">Parte 1</span>
                                    <h4 className="font-extrabold text-slate-900 text-base mt-2">Presupuesto de Ingresos</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Consiste en el estimativo de las rentas e ingresos corrientes, recursos de capital, fondos especiales e ingresos de los establecimientos públicos.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border border-border bg-white  shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-[10px] bg-secondary/20 text-secondary font-bold px-2 py-0.5  uppercase">Parte 2</span>
                                    <h4 className="font-extrabold text-slate-900 text-base mt-2">Presupuesto de Gastos</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Denominado también Acuerdo o Ley de Apropiaciones. Contiene la autorización de los gastos de funcionamiento, inversión y servicio de la deuda pública.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border border-border bg-white  shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5  uppercase">Parte 3</span>
                                    <h4 className="font-extrabold text-slate-900 text-base mt-2">Disposiciones Generales</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Corresponden a las normas tendientes a asegurar la correcta ejecución del presupuesto general, las cuales rigen únicamente para la vigencia fiscal en curso.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-general-ingresos":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.3.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Ingresos o Rentas y Recursos de Capital</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Esta primera gran sección del presupuesto general contiene la estimación de los recursos monetarios que la entidad espera recaudar durante la vigencia fiscal respectiva.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Estructura Detallada de Ingresos</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                De conformidad con el artículo 6º del Estatuto Orgánico, el presupuesto de ingresos y recursos de capital contendrá la estimación detallada de:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Ingresos Corrientes</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Aquellos recaudos regulares que provienen del cobro de tributos (directos o indirectos) e ingresos no tributarios (tasas, multas, contribuciones y rentas de naturaleza corriente).</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Recursos de Capital</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Ingresos extraordinarios por crédito interno o externo, recursos del balance, rendimientos financieros de tesorería, donaciones, excedentes financieros de empresas industriales.</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Contribuciones Parafiscales</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Pagos obligatorios que afectan a un determinado grupo social y económico y se utilizan en su propio beneficio exclusivo, cuando sean administrados por órganos que formen parte del presupuesto.</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Fondos Especiales e Ingresos de Establecimientos Públicos</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Fondos creados por ley para un fin específico e ingresos propios que recaudan directamente los establecimientos descentralizados del ente territorial.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-general-gastos":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.3.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Gastos o Apropiaciones</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Es el estimativo de los gastos autorizados y apropiaciones que podrán ejecutar los diferentes órganos e instituciones durante el año fiscal respectivo. Constituye el límite legal de gasto del sector público.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Títulos y Orígenes que Habilitan el Gasto</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                En el presupuesto de gastos, sólo se pueden incluir apropiaciones que correspondan a:
                            </p>

                            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                                <li>Créditos judicialmente reconocidos.</li>
                                <li>Gastos decretados conforme a las normas preexistentes (Leyes, ordenanzas, acuerdos y actos que organizan la entidad y sus dependencias).</li>
                                <li>Las destinadas a dar cumplimiento a los planes y programas de desarrollo económico y social y a las de las obras públicas de que trata el plan de desarrollo, aprobados por la respectiva corporación corporativa (Concejo, Asamblea o Congreso).</li>
                            </ul>

                            <div className="p-4 bg-slate-50 border border-slate-200  flex flex-col md:flex-row gap-6 mt-4">
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-extrabold text-slate-900 text-sm">Clasificación Básica del Gasto:</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        El presupuesto de gastos o de apropiaciones está conformado por secciones en las cuales se autorizan y ordenan partidas para:
                                    </p>
                                    <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1 mt-1">
                                        <li><strong>Gastos de funcionamiento:</strong> Para la operación normal del Ente.</li>
                                        <li><strong>Gastos de inversión:</strong> Derivados de la planificación del POAI.</li>
                                        <li><strong>Servicio de la deuda pública:</strong> Manejo financiero y amortización.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "sistema-presupuestal-general-disposiciones":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 2.3.4</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Disposiciones Generales</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Las <strong>Disposiciones Generales</strong> corresponden a las normas operativas y de control tendientes a asegurar la correcta ejecución del Presupuesto General de la vigencia.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Características y Restricciones Legales</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-855">
                                Estas normas regirán únicamente para el año fiscal para el cual se expidan.
                            </p>

                            <div className="bg-red-50 border border-red-200 text-red-900 p-5 ">
                                <h4 className="font-extrabold text-sm mb-2 flex items-center gap-1.5"><Shield className="w-4 h-4 text-red-600" /> Restricciones Severas</h4>
                                <p className="text-xs leading-relaxed text-red-800">
                                    Mediante las disposiciones generales NO se podrán:
                                </p>
                                <ul className="text-xs text-red-700 list-disc pl-5 mt-2 space-y-1">
                                    <li>Crear nuevos impuestos, modificar los existentes o conceder exenciones tributarias de cualquier tipo.</li>
                                    <li>Ordenar nuevos gastos públicos.</li>
                                    <li>Dictar normas sobre la organización y funcionamiento de las dependencias.</li>
                                    <li>Modificar las escalas de remuneración de los cargos o las plantas de personal.</li>
                                    <li>Otorgar facultades extraordinarias al representante legal, ni autorizar la contratación directa de empréstitos financieros.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            case "coordinacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Sección 3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Coordinación del Sistema Presupuestal</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La planeación financiera y la programación del gasto requieren una dirección técnica centralizada para garantizar que el total del gasto público anual sea plenamente congruente con los límites de recaudo y las políticas macroeconómicas.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 p-6  flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 bg-primary/10  text-primary shrink-0">
                                <Landmark className="w-12 h-12" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-bold text-slate-900">Órganos Directivos Técnicos</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Esta coordinación fiscal se realiza a nivel territorial a través del <strong>Comité de Hacienda</strong> (o Consejo Territorial de Hacienda) y a nivel nacional a través del <strong>CONFIS</strong> (Consejo Superior de Política Fiscal). Estos órganos asesoran al Representante Legal en materia presupuestal y de política tributaria.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "coordinacion-confis":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 3.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Comité de Hacienda o CONFIS</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El Sistema Presupuestal será coordinado de manera técnica por el <strong>Comité de Hacienda</strong>, que para tal efecto es el órgano de asesoría, consulta, coordinación y seguimiento del Sistema Presupuestal dependiente del despacho del Representante Legal.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Integración Legal del Comité</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                De conformidad con las normas orgánicas, el Comité de Hacienda estará integrado estrictamente por:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                <div className="p-4 border border-border bg-slate-50  text-center">
                                    <div className="p-2 bg-primary text-white w-fit  mx-auto mb-2"><Landmark className="w-5 h-5" /></div>
                                    <h4 className="font-bold text-sm text-slate-900">El Representante Legal</h4>
                                    <p className="text-xs text-slate-500 mt-1">Alcalde o Gobernador (quien lo presidirá y tiene la última palabra sobre las políticas).</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50  text-center">
                                    <div className="p-2 bg-primary text-white w-fit  mx-auto mb-2"><Calculator className="w-5 h-5" /></div>
                                    <h4 className="font-bold text-sm text-slate-900">Jefe de Área Financiera</h4>
                                    <p className="text-xs text-slate-500 mt-1">Secretario de Hacienda o Director de Finanzas (responsable del flujo de caja y recaudo).</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50  text-center">
                                    <div className="p-2 bg-primary text-white w-fit  mx-auto mb-2"><BookOpen className="w-5 h-5" /></div>
                                    <h4 className="font-bold text-sm text-slate-900">Jefe de Planeación</h4>
                                    <p className="text-xs text-slate-500 mt-1">Director o Secretario de Planeación (encargado de priorizar los proyectos y consolidar el POAI).</p>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900  text-xs leading-relaxed mt-4">
                                <strong>Audiencia y Autonomía:</strong> Las decisiones que tengan que ver con las entidades descentralizadas se tomarán con audiencia de sus Directores o Gerentes, quienes participarán en el Comité con voz pero sin voto.
                            </div>
                        </div>
                    </div>
                )
            case "coordinacion-funciones":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 3.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Funciones del Comité de Hacienda</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El Estatuto Orgánico del Presupuesto le atribuye al Comité de Hacienda (CONFIS a nivel territorial) responsabilidades clave y de estricto cumplimiento para regir las finanzas públicas:
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Competencias Detalladas</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Asesorar al Representante Legal sobre la política fiscal de la Entidad.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Aprobar, modificar y evaluar el Plan Financiero y ordenar las medidas técnicas para su cumplimiento.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Analizar y conceptuar sobre las implicaciones fiscales del Plan Operativo Anual de Inversiones (POAI).</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Determinar las metas financieras para la elaboración del programa anual mensualizado de caja (PAC), aprobar el PAC y autorizar sus modificaciones.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Verificar y certificar que el proyecto de Presupuesto de ingresos y gastos de las EICE y las SEM no financieras se ajusta a las metas financieras señaladas en el Plan Financiero del Ente Territorial.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                    <span>Autorizar la expedición de certificados de disponibilidad presupuestal (CDP) con cargo a recursos originados en contratos o convenios de cofinanciación.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )
            case "principios":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Sección 4</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Principios del Sistema Presupuestal</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Los principios presupuestales son preceptos generales que sirven de orientación para la formulación, elaboración, aprobación y ejecución de los elementos del sistema presupuestal.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 p-6  space-y-4">
                            <h4 className="font-bold text-slate-900 flex items-center gap-1.5"><Shield className="w-5 h-5 text-primary" /> Condicionantes de Validez Legal</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Si bien estos principios constituyen los ideales hacia los cuales debe orientarse una buena gestión presupuestal, su no aplicación en la práctica puede afectar la validez del proceso presupuestal.
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed italic bg-white p-4  border border-slate-200">
                                Sentencia C-357 de agosto 11 de 1994 (Corte Constitucional): “…, los principios consagrados en el Estatuto Orgánico de Presupuesto, son precedentes que condicionan la validez del proceso presupuestal, de manera que, al no ser tenidos en cuenta, vician la legitimidad del mismo. No son simples requisitos, sino pautas determinadas por la Ley orgánica y determinantes de la Ley anual de presupuesto (o Acuerdo Territorial de presupuesto).”
                            </p>
                        </div>
                    </div>
                )
            case "principios-planificacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Planificación</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Este principio establece que el presupuesto general de la Entidad debe guardar estricta concordancia con los contenidos del Plan de Desarrollo, el Plan Plurianual de Inversiones, el proceso de planeación financiera (Plan Financiero) y el Plan Operativo Anual de Inversiones (POAI).
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Armonía Estratégica Obligatoria</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Entre el presupuesto anual y el Plan de Desarrollo debe existir una estricta armonía, tal como lo dispone de manera imperativa el <strong>artículo 346 de la Constitución Política</strong>, ya que el presupuesto de cada año debe ser un fiel reflejo de lo que, para plazos mayores, prevé el Plan de Desarrollo de la administración.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-800">
                                Permite integrar el sistema presupuestal con el de planeación para alcanzar los objetivos de desarrollo a corto, mediano y largo plazo.
                            </p>
                        </div>
                    </div>
                )
            case "principios-anualidad":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Anualidad</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El principio de anualidad circunscribe la vigencia del presupuesto al año fiscal, comprendido rigurosamente entre el <strong>1 de enero y el 31 de diciembre</strong> de cada año.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Implicación Operativa</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Por consiguiente, se autoriza y programa el Presupuesto sólo para dicha vigencia fiscal. Transcurrido el 31 de diciembre, las apropiaciones presupuestales expiran y las sumas no comprometidas no podrán ejecutarse, debiendo reincorporarse a través del proceso del balance en la siguiente vigencia.
                            </p>
                        </div>
                    </div>
                )
            case "principios-universalidad":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Universalidad</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El principio de universalidad considera que el presupuesto general contendrá la <strong>totalidad de los gastos públicos</strong> que la administración espera realizar durante la vigencia fiscal respectiva.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Prohibición de Gastos Fuera del Presupuesto</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-850">
                                Ninguna autoridad podrá efectuar gastos públicos, erogaciones con cargo al tesoro público, o transferir crédito alguno que no figuren explícita y previamente autorizados en el presupuesto aprobado.
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Este principio garantiza un control democrático e institucional unificado, impidiendo la existencia de presupuestos paralelos o "cajas menores" no vigiladas por las corporaciones corporativas del Estado.
                            </p>
                        </div>
                    </div>
                )
            case "principios-unidad-caja":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 4</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Unidad de Caja</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Este principio consagra que, con el recaudo de todas las rentas y recursos de capital del ente territorial, se atenderá el pago oportuno de las apropiaciones autorizadas en el presupuesto general.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Manejo Unificado de Tesorería</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Significa que todos los ingresos fiscales, sin importar su origen tributario o no tributario, se incluyen en una sola bolsa común (la cuenta única o de tesorería del municipio), con la cual se pagan todos los gastos autorizados.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                La razón de ser de este principio radica en la facultad que tiene la autoridad presupuestal para orientar el gasto público hacia las áreas que estime prioritarias en su Plan de Desarrollo, sin que se encuentren ingresos previamente predestinados a la financiación de determinados gastos específicos (salvo excepciones constitucionales como el SGP o regalías).
                            </p>
                        </div>
                    </div>
                )
            case "principios-programacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 5</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-905 mt-1">Programación Integral</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La programación integral implica que <span className="font-semibold text-slate-900">“todo programa presupuestal deberá contemplar simultáneamente los gastos de inversión y de funcionamiento que las exigencias técnicas y administrativas demanden como necesarios para su ejecución y operación, de conformidad con los procedimientos y normas legales vigentes”</span>.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-950">Vínculo Indisoluble de Gastos</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Este principio prohíbe formular un programa o proyecto de inversión de infraestructura (por ejemplo, construir un hospital o una sede educativa) sin prever de forma simultánea y en la misma vigencia los gastos de funcionamiento (nómina de médicos o profesores, servicios públicos, mantenimiento) requeridos para poner en marcha dicha obra.
                            </p>
                        </div>
                    </div>
                )
            case "principios-especializacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 6</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Especialización</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El principio de especialización exige que las apropiaciones autorizadas en el presupuesto se refieran, en cada órgano de la administración, estrictamente a su objeto misional y funciones legales.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Rigidez de la Destinación</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-800">
                                Las apropiaciones se ejecutarán estrictamente conforme al fin para el cual fueron programadas.
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Este principio busca impedir la malversación de recursos públicos, prohibiendo desviar rubros aprobados para un fin social u operativo hacia otros objetos de gasto no autorizados en el acuerdo anual (por ejemplo, destinar rubros de alimentación escolar para pagar viáticos).
                            </p>
                        </div>
                    </div>
                )
            case "principios-inembargabilidad":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 7</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Inembargabilidad</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Está consagrado formalmente en el <strong>artículo 19 del decreto 111 de 1996</strong> y consiste en que las rentas incorporadas en el presupuesto general de la entidad, así como los bienes y derechos de los órganos que lo conforman, son inembargables.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Protección del Patrimonio Público</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Con este principio se busca proteger de manera rigurosa los dineros de la Nación y de las Entidades Territoriales, para garantizar la aplicación efectiva del gasto público a los fines de beneficio general y prestación de servicios esenciales.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El objetivo primordial es evitar la imposibilidad de ejecutar el presupuesto de gasto social, ya que no sería viable asumir erogaciones si las rentas fuesen congeladas o retenidas mediante medidas cautelares promovidas por acreedores particulares.
                            </p>

                            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900  text-xs font-semibold">
                                Del principio de Inembargabilidad, se exceptúan las empresas industriales y comerciales del municipio y los procesos judiciales de orden laboral y sentencias ejecutoriadas (bajo reglas específicas).
                            </div>
                        </div>
                    </div>
                )
            case "principios-coherencia":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 8</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Coherencia Macroeconómica</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El presupuesto general del Estado es el principal instrumento de política fiscal del país. Por consiguiente, su volumen global no puede definirse de forma aislada a las metas de inflación o crecimiento económico.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-950">Alineación con la Autoridad Monetaria</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El presupuesto debe ser compatible con las metas macroeconómicas fijadas por el Gobierno Nacional, en estricta coordinación con la Junta Directiva del Banco de la República (quien tiene a su cargo el control de la inflación y la política cambiaria).
                            </p>
                        </div>
                    </div>
                )
            case "principios-homeostasis":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Principio 9</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Homeóstasis Presupuestal</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La homeostasis es un concepto biológico que se aplica al equilibrio fiscal. El principio presupuestal establece que el crecimiento del gasto debe guardar congruencia con el crecimiento económico real.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Evitar Desequilibrios Macroeconómicos</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El crecimiento real del presupuesto de rentas, incluida la totalidad de los créditos adicionales de cualquier naturaleza, deberá guardar estricta congruencia con el crecimiento de la economía de tal manera que no genere un desequilibrio económico de orden nacional o local.
                            </p>
                        </div>
                    </div>
                )
            case "marco-procedimental":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Sección 5</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Marco o Aspectos Procedimentales (EOP)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            En esta unidad, abordaremos las fases y aspectos procedimentales que el Estatuto establece para estructurar, clasificar y ordenar los ingresos y egresos tanto a nivel nacional como de las entidades territoriales colombianas.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 p-6  flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 bg-primary/10  text-primary shrink-0">
                                <BookOpen className="w-12 h-12" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-bold text-slate-900">Fases y Clasificación Operativa</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Exploraremos de manera minuciosa la composición formal de las secciones, los desgloses por su temporalidad o destinación de los ingresos, y el funcionamiento procedimental del servicio de la deuda pública y los gastos de inversión.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-general":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">El Presupuesto General (Procedimental)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El presupuesto es un acto administrativo por el cual se prevén o se computan anticipadamente las rentas e ingresos de la Entidad esperan recibir en una determinada vigencia fiscal, lo mismo que los gastos y apropiaciones en que incurrirán todos los órganos que lo integran y refleja las proyecciones del Plan Financiero.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">La Utilidad del Presupuesto en el Proceso Administrativo</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Sirve como instrumento político, económico, financiero y administrativo, para la toma de decisiones, determinar la categorización y cuantías para contratar entre otros.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-850">
                                En la preparación del presupuesto anual y en su ejecución se debe partir del principio de planificación, según el cual “El presupuesto de una entidad territorial, que se expide anualmente, deberá reflejar los planes de largo, mediano y corto plazo”.
                            </p>
                        </div>
                    </div>
                )
            case "marco-procedimental-general-conformacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Conformación del Presupuesto (Aspecto Procedimental)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Para efectos procedimentales, el Estatuto establece con precisión las tres partes estructurales del Presupuesto:
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">División Estructural Tripartita</h3>
                            <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5">
                                <li><strong>Presupuesto de ingresos o rentas y recursos de capital:</strong> Contiene el estimativo de recursos a percibir.</li>
                                <li><strong>Presupuesto de gastos o de apropiaciones:</strong> Contiene los recursos máximos asignados.</li>
                                <li><strong>Disposiciones generales:</strong> Normativa complementaria anual.</li>
                            </ul>
                        </div>
                    </div>
                )
            case "marco-procedimental-general-conformacion-ingresos":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.2.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Ingresos</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El presupuesto de ingresos y recursos de capital contendrá la estimación detallada de los ingresos corrientes, recursos de capital, contribuciones parafiscales cuando sean administradas por un órgano que haga parte del presupuesto, fondos especiales e ingresos de los establecimientos públicos.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-6 ">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Esta estimación debe estar estrictamente alineada con el Plan Financiero para evitar sobreestimaciones que afecten la liquidez y generen un posterior déficit fiscal.
                            </p>
                        </div>
                    </div>
                )
            case "marco-procedimental-general-conformacion-gastos":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.2.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Gastos</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Es el estimativo de gastos autorizados para la vigencia fiscal. En el presupuesto de gastos, sólo se pueden incluir apropiaciones que correspondan a créditos judicialmente reconocidos, gastos decretados conforme a las normas preexistentes y las destinadas a dar cumplimiento a los planes y programas de desarrollo.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Capacidad de Contratación y Autonomía</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-800">
                                El presupuesto de gastos está conformado por secciones, que para el nivel municipal son: la Administración Central, el Concejo, la Contraloría (donde exista), la Personería Municipal y los establecimientos públicos descentralizados que tengan autonomía jurídica.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                La clasificación en secciones va ligada a la capacidad de contratación según lo regulado por la Ley, a la ordenación del gasto y a la autonomía presupuestal. Aquellos órganos que representan una sección “tendrán la capacidad de contratar y comprometer a nombre de la persona jurídica de la cual hagan parte y ordenar el gasto en desarrollo de las apropiaciones incorporadas en la respectiva sección, lo que constituye la autonomía presupuestal”.
                            </p>
                            <div className="p-4 bg-slate-100  border border-slate-200 text-xs text-slate-600">
                                Tienen esta capacidad las entidades territoriales, los concejos, las contralorías, las personerías y todos los demás órganos estatales de cualquier nivel que tengan personería jurídica, sin perjuicio de la capacidad del Alcalde para celebrar contratos a nombre del municipio.
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-general-conformacion-disposiciones":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.2.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Disposiciones Generales (Aspecto Procedimental)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Las disposiciones generales son normas operativas anuales destinadas a asegurar la correcta ejecución del Presupuesto General de la entidad.
                        </p>

                        <div className="bg-red-50 border border-red-200 text-red-900 p-5 ">
                            <h4 className="font-extrabold text-sm mb-2 flex items-center gap-1.5"><Shield className="w-4 h-4 text-red-600" /> Limitaciones del Legislativo Anual</h4>
                            <p className="text-xs leading-relaxed text-red-800">
                                Mediante las disposiciones generales NO se podrán:
                            </p>
                            <ul className="text-xs text-red-700 list-disc pl-5 mt-2 space-y-1">
                                <li>Crear nuevos impuestos, modificar los existentes o conceder exenciones.</li>
                                <li>Ordenar nuevos gastos públicos.</li>
                                <li>Dictar normas sobre la organización y funcionamiento de las dependencias, ni modificar las escalas de remuneración o las plantas de personal.</li>
                                <li>Otorgar facultades extraordinarias, ni autorizar la contratación de empréstitos financieros.</li>
                            </ul>
                        </div>
                    </div>
                )
            case "marco-procedimental-rentas":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Rentas y Recursos de Capital</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Los ingresos del presupuesto, los cuales también se denominan <strong>fuentes u origen de los recursos</strong>, se pueden clasificar operativamente bajo tres (3) criterios primordiales para la planeación fiscal:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">1. Por su Naturaleza</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Clasificación intrínseca del ingreso que define si proviene de flujos ordinarios y recurrentes o de ingresos esporádicos y extraordinarios.
                                </p>
                            </div>
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">2. Por su Destinación</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Define si los recursos están predeterminados por mandato legal para un fin exclusivo o si son de libre asignación para la planeación territorial.
                                </p>
                            </div>
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">3. Por su Temporalidad</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Divide los ingresos según correspondan a recaudos de la vigencia en curso o a saldos y recursos acumulados en vigencias anteriores.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-rentas-naturaleza":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.3.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación por Naturaleza</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La naturaleza del ingreso determina la regularidad y predictibilidad de los flujos de caja que ingresan al tesoro público:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 border border-border bg-slate-50  space-y-2">
                                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5  uppercase">Ingreso Recurrente</span>
                                <h4 className="font-bold text-slate-900 text-base">Ingresos Regulares</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Son aquellos recibidos de manera regular y constante, y están dados por el desarrollo de las propias actividades y tributos normales de la entidad. Son la base de su normal funcionamiento.
                                </p>
                            </div>

                            <div className="p-5 border border-border bg-slate-50  space-y-2">
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5  uppercase">Ingreso No Recurrente</span>
                                <h4 className="font-bold text-slate-900 text-base">Ingresos Esporádicos</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Son ingresos recibidos de manera esporádica e infrecuente. Tienen carácter excepcional y pueden llegar a percibirse una única vez en el horizonte presupuestal (por ejemplo, venta de activos).
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-rentas-destinacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.3.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación por Destinación</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La destinación del ingreso condiciona la rigidez presupuestal y la libertad del ordenador del gasto para priorizar recursos:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 border border-border bg-slate-50  space-y-2">
                                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5  uppercase">Uso Excluyente</span>
                                <h4 className="font-bold text-slate-900 text-base">Destinación Específica</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Son ingresos con un uso determinado legal o constitucionalmente, de carácter excluyente. Los ingresos no se destinan de manera voluntaria por la administración, sino que obligan a financiar proyectos particulares predefinidos.
                                </p>
                            </div>

                            <div className="p-5 border border-border bg-slate-50  space-y-2">
                                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5  uppercase">Uso Flexible</span>
                                <h4 className="font-bold text-slate-900 text-base">Libre Destinación</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Son ingresos con un uso determinado, pero en concordancia con la planeación financiera global del Ente. Su asignación y uso son determinados directamente por el ordenador del gasto o el ordenador del pago.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-rentas-temporalidad":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.3.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación por Temporalidad</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La temporalidad del ingreso clasifica los recursos según su momento de origen o su naturaleza plurianual:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="p-4 border border-border bg-slate-50 ">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Vigencia Presupuestal</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Si los ingresos se perciben e ingresan efectivamente en la actual vigencia en curso, se clasifican procedimentalmente en <strong>ingresos corrientes</strong> de la vigencia.
                                </p>
                            </div>

                            <div className="p-4 border border-border bg-slate-50 ">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Vigencias Anteriores</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Si los ingresos percibidos corresponden a recursos no ejecutados en anteriores vigencias fiscales, se clasifican como <strong>recursos del balance</strong> del ente público.
                                </p>
                            </div>

                            <div className="p-4 border border-border bg-slate-50 ">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Anticipo de Inversiones</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Es el uso anticipado de los tributos futuros el cual genera endeudamiento público, y se debe establecer estrictamente por el período del gobernante en cumplimiento (según lo regulado por la Ley 617 de 2000).
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-nacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.4</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación del Presupuesto de Ingresos y Gastos de la Nación</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            La consolidación presupuestal del orden nacional agrupa las cuentas de la Nación con el fin de proyectar de forma consistente la balanza comercial y fiscal ante los organismos de crédito internacional.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-6  flex gap-3">
                            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El Estatuto establece las reglas técnicas mediante las cuales se consolida e integra el Presupuesto General de la Nación (PGN), el cual es presentado y debatido anualmente ante el Congreso de la República.
                            </p>
                        </div>
                    </div>
                )
            case "marco-procedimental-nacion-composicion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.4.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Composición de los Ingresos</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El Estatuto Orgánico establece que los ingresos del Presupuesto General de la Nación (PGN) se componen obligatoriamente de la siguiente manera:
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Dos Grandes Fuentes de Composición:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="p-5 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 mb-1">Ingresos de la Nación</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Flujos y recaudos ordinarios y extraordinarios de la administración central de la Nación (ministerios, departamentos administrativos).
                                    </p>
                                </div>
                                <div className="p-5 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 mb-1">Recursos Propios de Establecimientos Públicos</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Rentas y recursos generados directamente por los establecimientos descentralizados del orden nacional que tengan personería y autonomía.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-nacion-rentas":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.4.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación del Presupuesto de Rentas y Recursos de Capital (Nación)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El Estatuto detalla que para la Nación, esta categoría comprende de manera exhaustiva las siguientes subdivisiones de ingresos:
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-3 text-sm text-slate-600">
                            <div className="flex gap-3 py-2 border-b border-slate-100">
                                <span className="font-bold text-primary shrink-0 w-32">1. Ingresos Corrientes</span>
                                <span>Tributarios (directos, indirectos) y no tributarios (tasas, multas).</span>
                            </div>
                            <div className="flex gap-3 py-2 border-b border-slate-100">
                                <span className="font-bold text-primary shrink-0 w-32">2. Recursos de Capital</span>
                                <span>Créditos externos, excedentes de las empresas industriales, donaciones.</span>
                            </div>
                            <div className="flex gap-3 py-2 border-b border-slate-100">
                                <span className="font-bold text-primary shrink-0 w-32">3. Contribuciones</span>
                                <span>Contribuciones parafiscales administradas por entes del presupuesto nacional.</span>
                            </div>
                            <div className="flex gap-3 py-2 border-b border-slate-100">
                                <span className="font-bold text-primary shrink-0 w-32">4. Fondos Especiales</span>
                                <span>Recursos específicos destinados por ley a finalidades especiales.</span>
                            </div>
                            <div className="flex gap-3 py-2">
                                <span className="font-bold text-primary shrink-0 w-32">5. Establecimientos</span>
                                <span>Ingresos propios de los establecimientos públicos del orden nacional.</span>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-gastos":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.5</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Presupuesto de Gastos o Apropiaciones (Procedimental)</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            En el presupuesto de gastos o de apropiaciones, los egresos son denominados técnicamente <strong>fuentes</strong> o usos de fondos públicos.
                        </p>
                        <p className="text-base leading-relaxed text-slate-600">
                            El presupuesto de gastos o apropiaciones es la autorización de gasto que imparte el Congreso, las Asambleas o los Concejos sobre las erogaciones que puede realizar la administración en la vigencia fiscal respectiva. De acuerdo con el Estatuto Orgánico, sólo se pueden incluir apropiaciones que correspondan a créditos judicialmente reconocidos, gastos decretados conforme a las normas preexistentes y obras del Plan de Desarrollo.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Estructura por Secciones Presupuestales</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                El presupuesto de gastos debe especificar las ramas de la administración pública y, en cada una de ellas, el organismo o la entidad a la cual se le autoriza el gasto, lo que se conoce con el nombre de <strong>secciones del presupuesto</strong>.
                            </p>

                            <div className="p-4 bg-slate-50 border border-slate-200  text-xs space-y-2">
                                <p><strong>En el Nivel Nacional las Secciones son:</strong> Rama Legislativa, Rama Judicial, Fiscalía General de la Nación, Procuraduría General, Defensoría del Pueblo, Contraloría General, Registraduría Nacional (incluye CNE), una por cada ministerio y departamento administrativo, la Policía Nacional y una sección especial para el servicio de la deuda pública.</p>
                                <p><strong>En el Nivel Municipal las Secciones son:</strong> la Administración Central, el Concejo Municipal, la Personería, la Contraloría (si es del caso) y los establecimientos públicos descentralizados que tengan autonomía jurídica.</p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-gastos-clasificacion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.5.1</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Clasificación de los Gastos</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Para efectos de reporte y de consistencia macroeconómica, el Presupuesto de Gastos se clasifica obligatoriamente en tres (3) grandes grupos:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">Gastos de Funcionamiento</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Destinados a la operación normal de la entidad (nómina de personal, servicios públicos, adquisición de bienes de oficina, mantenimientos y transferencias legales).
                                </p>
                            </div>
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">Servicio de la Deuda Pública</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Rubros destinados a pagar el capital (amortización), intereses, comisiones y otros costos financieros de los créditos adquiridos.
                                </p>
                            </div>
                            <div className="p-5 border border-border bg-white  shadow-sm">
                                <h4 className="font-bold text-slate-900 text-base mb-2">Gastos de Inversión</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Recursos destinados a programas y proyectos sociales o productivos que generan desarrollo económico y social, clasificados por sectores y programas.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            case "marco-procedimental-gastos-clasificacion-deuda":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.5.2</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Servicio de la Deuda Pública</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            El <strong>Servicio de la Deuda Pública</strong> comprende las apropiaciones destinadas a cumplir con las obligaciones y compromisos financieros adquiridos con entidades bancarias y de crédito nacionales o internacionales.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">¿Qué incluye el Servicio de la Deuda?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                En el orden nacional o territorial, comprende estrictamente:
                            </p>

                            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                                <li><strong>Pago de Capital (Amortización):</strong> Devolución del valor principal del crédito prestado.</li>
                                <li><strong>Pago de Intereses:</strong> Costo del dinero prestado a lo largo del tiempo.</li>
                                <li><strong>Comisiones Bancarias y Costos Financieros:</strong> Cargos asociados al manejo y la estructuración del crédito.</li>
                                <li><strong>Refinanciaciones:</strong> Reestructuración de plazos y condiciones de deuda preexistente.</li>
                            </ul>
                        </div>
                    </div>
                )
            case "marco-procedimental-gastos-clasificacion-inversion":
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Tema 5.5.3</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Gastos de Inversión</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-slate-600">
                            Los <strong>Gastos de Inversión</strong> son aquellos recursos públicos que el Estado destina de forma estratégica a programas y proyectos que generan desarrollo económico, social e infraestructura pública.
                        </p>

                        <div className="bg-white border border-border p-6  shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Objetivo y Alcance de la Inversión</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-800">
                                Su principal objetivo es mejorar de forma tangible la calidad de vida de la población y promover el desarrollo integral del territorio.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Infraestructura Física</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Construcción y pavimentación de vías de comunicación, edificación de centros de salud, hospitales, colegios, acueductos y saneamiento básico.</p>
                                </div>
                                <div className="p-4 border border-border bg-slate-50 ">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Desarrollo Social y Humano</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Programas sociales dirigidos a la superación de la pobreza extrema, proyectos productivos de fomento agrícola o comercial, y proyectos de desarrollo tecnológico.</p>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/5 border border-primary/20  text-xs text-slate-700">
                                <strong>Ejemplo de Inversión Pública:</strong> La construcción y dotación tecnológica de una nueva sede educativa rural para beneficiar a comunidades de escasos recursos.
                            </div>
                        </div>
                    </div>
                )
            default:
                const currentItem = tocItems.find(item => item.id === activeSectionId)
                return (
                    <div className="space-y-8 animate-fade-in text-slate-800">
                        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Detalle de Tema</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{currentItem?.title}</h2>
                        </div>
                        {currentItem?.description && (
                            <p className="text-lg leading-relaxed font-light text-slate-600">
                                {currentItem.description}
                            </p>
                        )}
                        {currentItem?.keywords && currentItem.keywords.length > 0 && (
                            <div className="space-y-3 mt-8">
                                <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Conceptos clave a repasar:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentItem.keywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 ">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
        }
    }

    return (
        <div id="reader-scroll-top" className="flex flex-col lg:flex-row gap-8 min-h-[75vh]">
            {/* Left Sidebar: Table of Contents treeview with search filter */}
            <div className="w-full lg:w-1/4 bg-white  border border-border/80 shadow-sm p-6 flex flex-col gap-6 self-start lg:sticky lg:top-28 max-h-[85vh] overflow-hidden">
                <div>
                    <h3 className="font-extrabold text-primary text-lg mb-1 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-secondary" />
                        Tabla de Contenido
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">Módulo 1: Estatuto Presupuestal</p>
                </div>

                {/* Reader Progress Bar */}
                <div className="space-y-2 pb-4 border-b border-border/60">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-600">Progreso de Lectura</span>
                        <span className="text-primary">{readingProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100  overflow-hidden border border-slate-200/50 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 "
                            style={{ width: `${readingProgress}%` }}
                        />
                    </div>
                </div>

                {/* Filter Search Input */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Buscar tema del módulo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-border  text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-inner"
                    />
                </div>

                {/* Sidebar Navigation Menu */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                    {filteredTocItems.length > 0 ? (
                        filteredTocItems.map((item) => {
                            const isActive = activeSectionId === item.id
                            const isRead = completedSections[item.id]
                            
                            // Define indentations based on hierarchal levels
                            let pl = "pl-2"
                            if (item.level === 2) pl = "pl-5"
                            if (item.level === 3) pl = "pl-8 text-[11px]"
                            if (item.level === 4) pl = "pl-11 text-[10px]"

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectSection(item.id)}
                                    className={`w-full text-left py-2 px-3  transition-all flex items-center justify-between group ${pl} ${
                                        isActive 
                                            ? "bg-primary text-white font-bold shadow-md shadow-primary/20" 
                                            : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium text-xs"
                                    }`}
                                >
                                    <span className="truncate pr-2">{item.title}</span>
                                    {isRead && (
                                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-green-500"}`} />
                                    )}
                                </button>
                            )
                        })
                    ) : (
                        <p className="text-center text-xs text-muted-foreground italic py-8">No se encontraron temas coincidentes.</p>
                    )}
                </div>
            </div>

            {/* Right Panel: Content reading container or iframe PDF fallback */}
            <div className="flex-grow flex flex-col bg-white  border border-border/80 shadow-sm overflow-hidden">
                {/* Panel Action Header */}
                <div className="px-8 py-4 border-b border-border/60 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <Link 
                            href={`/diplomados/${courseId}`}
                            className="p-2 hover:bg-slate-100  transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h4 className="font-extrabold text-sm text-slate-900">Módulo de Presupuesto Público</h4>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Visor de Estudios Oficial de Líderes del Mérito</p>
                        </div>
                    </div>
                </div>

                {/* Main viewport canvas */}
                <div className="flex-grow p-8 md:p-12 overflow-y-auto max-h-[75vh]">
                    {renderActiveContent()}
                </div>

                {/* Pagination footer */}
                <div className="px-8 py-5 border-t border-border/60 bg-slate-50/50 flex justify-between items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={activeSectionIndex === 0}
                        className=" border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold px-4"
                    >
                        <ArrowLeft className="mr-2 w-3.5 h-3.5" /> Anterior
                    </Button>

                    <div className="hidden md:flex text-xs text-muted-foreground font-semibold">
                        Tema {activeSectionIndex + 1} de {tocItems.length}
                    </div>

                    {activeSectionIndex < tocItems.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            className=" bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 shadow-md shadow-primary/10"
                        >
                            Siguiente <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                    ) : (
                        <Link
                            href={`/diplomados/${courseId}`}
                            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-600/95 text-white text-xs font-bold px-5 py-2.5  shadow-md shadow-green-600/10 transition-all"
                        >
                            <Award className="mr-2 w-4 h-4" /> Finalizar Lectura
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
