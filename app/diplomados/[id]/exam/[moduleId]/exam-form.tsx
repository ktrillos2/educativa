"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitExam } from "@/app/actions/exam"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Question {
    id: string
    question: string
    options: string[]
    correct: number
}

const FALLBACK_QUESTIONS: Question[] = [
    {
        id: "q1",
        question: "¿Cuál es el objetivo principal de este módulo?",
        options: ["Mejorar procesos", "Ignorar protocolos", "Aumentar gastos", "Ninguna de las anteriores"],
        correct: 0,
    },
    {
        id: "q2",
        question: "¿Qué herramienta es fundamental para el seguimiento?",
        options: ["Calculadora", "Software de Gestión", "Papel y lápiz", "Calendario físico"],
        correct: 1,
    },
    {
        id: "q3",
        question: "La normativa actual exige:",
        options: ["Reportes anuales", "No exige reportes", "Reportes mensuales", "Reportes diarios"],
        correct: 2,
    },
    {
        id: "q4",
        question: "¿Quién es el responsable directo de la implementación?",
        options: ["El cliente", "El proveedor", "El gerente de proyecto", "El becario"],
        correct: 2,
    },
    {
        id: "q5",
        question: "El éxito del proyecto se mide por:",
        options: ["Cantidad de horas", "Cumplimiento de KPIs", "Número de empleados", "Ninguna"],
        correct: 1,
    },
]

const COURSE_9_QUESTIONS: Record<string, Question[]> = {
    "mod-1": [
        {
            id: "m1-q1",
            question: "El alcalde de un municipio quiere elaborar el presupuesto sin tener en cuenta el Plan Financiero ni el POAI, porque considera que solo necesita estimar ingresos y gastos.",
            options: [
                "A. Puede hacerlo porque el presupuesto es independiente.",
                "B. Debe incluir Plan Financiero, POAI y Presupuesto Anual dentro del sistema presupuestal.",
                "C. Solo necesita el presupuesto de gastos."
            ],
            correct: 1
        },
        {
            id: "m1-q2",
            question: "Una secretaria municipal afirma que el presupuesto puede ejecutarse sin relación con el Plan de Desarrollo.",
            options: [
                "A. Es correcto, porque el presupuesto es autónomo.",
                "B. El presupuesto debe guardar armonía con el Plan de Desarrollo.",
                "C. Solo se relaciona con la política monetaria."
            ],
            correct: 1
        },
        {
            id: "m1-q3",
            question: "El tesorero municipal propone realizar un gasto que no aparece incluido en el presupuesto aprobado.",
            options: [
                "A. Realizar el gasto si es urgente.",
                "B. No puede ejecutarse porque viola el principio de universalidad.",
                "C. Puede hacerlo si lo aprueba el alcalde verbalmente."
            ],
            correct: 1
        },
        {
            id: "m1-q4",
            question: "El concejo municipal decide destinar impuestos específicos únicamente para una sola dependencia sin considerar otras prioridades.",
            options: [
                "A. Unidad de caja",
                "B. Especialización",
                "C. Anualidad"
            ],
            correct: 0
        },
        {
            id: "m1-q5",
            question: "Un funcionario dice que el presupuesto puede aprobarse para dos años consecutivos.",
            options: [
                "A. Sí, si el concejo lo autoriza.",
                "B. No, porque el presupuesto es anual.",
                "C. Solo si es inversión social."
            ],
            correct: 1
        },
        {
            id: "m1-q6",
            question: "El gerente de una empresa industrial y comercial del Estado (EICE) quiere definir libremente el destino de todos los excedentes financieros.",
            options: [
                "A. Puede hacerlo sin control.",
                "B. El CONPES define la cuantía a reintegrar y mínimo 20% se reinvierte.",
                "C. Los excedentes son totalmente privados."
            ],
            correct: 1
        },
        {
            id: "m1-q7",
            question: "Un municipio incluye dentro del presupuesto nuevos impuestos mediante disposiciones generales.",
            options: [
                "A. Está permitido.",
                "B. Solo si lo aprueba el alcalde.",
                "C. No puede hacerse mediante disposiciones generales."
            ],
            correct: 2
        },
        {
            id: "m1-q8",
            question: "El comité técnico desea modificar el PAC sin participación del Comité de Hacienda.",
            options: [
                "A. Puede hacerlo libremente.",
                "B. El Comité de Hacienda (CONFIS) debe aprobar el PAC y sus modificaciones.",
                "C. Solo la Secretaría de Hacienda decide."
            ],
            correct: 1
        },
        {
            id: "m1-q9",
            question: "Una entidad territorial decide aumentar el presupuesto sin considerar el crecimiento económico.",
            options: [
                "A. Homeóstasis presupuestal",
                "B. Especialización",
                "C. Inembargabilidad"
            ],
            correct: 0
        },
        {
            id: "m1-q10",
            question: "La administración municipal diseña un proyecto educativo sin incluir gastos de funcionamiento necesarios para operarlo.",
            options: [
                "A. Programación integral",
                "B. Unidad de caja",
                "C. Universalidad"
            ],
            correct: 0
        }
    ],
    "mod-2": [
        {
            id: "m2-q1",
            question: "El concejo municipal pretende iniciar el trámite del presupuesto sin que el alcalde haya presentado el proyecto.",
            options: [
                "A. Es válido porque el concejo puede iniciar el proceso presupuestal.",
                "B. No es válido: la iniciativa del presupuesto corresponde al alcalde.",
                "C. Es válido si lo solicita la Secretaría de Planeación."
            ],
            correct: 1
        },
        {
            id: "m2-q2",
            question: "Durante el estudio del presupuesto, un concejal propone aumentar libremente una partida sin concepto del gobierno municipal.",
            options: [
                "A. Puede hacerlo porque el concejo tiene autonomía presupuestal total.",
                "B. Solo puede reducir o modificar partidas con aprobación del gobierno municipal.",
                "C. Puede aumentar cualquier partida si hay mayoría simple."
            ],
            correct: 1
        },
        {
            id: "m2-q3",
            question: "El municipio desea adicionar recursos al presupuesto vigente para un nuevo programa social.",
            options: [
                "A. Se puede hacer por resolución interna de la Secretaría de Hacienda.",
                "B. Requiere un nuevo acuerdo de iniciativa de la administración con fuentes de financiación.",
                "C. Basta con aprobación verbal del alcalde."
            ],
            correct: 1
        },
        {
            id: "m2-q4",
            question: "Una dependencia de la alcaldía quiere ejecutar un proyecto de inversión que no está inscrito en el banco de programas y proyectos.",
            options: [
                "A. Puede ejecutarse si existe disponibilidad de caja.",
                "B. No puede ejecutarse; la inversión debe estar inscrita y viabilizada.",
                "C. Puede ejecutarse si es prioridad política."
            ],
            correct: 1
        },
        {
            id: "m2-q5",
            question: "El alcalde presenta el proyecto de presupuesto fuera del término legal.",
            options: [
                "A. Rige automáticamente el presupuesto presentado extemporáneamente.",
                "B. Se repite el presupuesto del año anterior.",
                "C. El concejo define un presupuesto provisional."
            ],
            correct: 1
        },
        {
            id: "m2-q6",
            question: "El alcalde objeta el presupuesto por posible ilegalidad y el concejo insiste sin cambios.",
            options: [
                "A. El alcalde debe sancionar obligatoriamente sin más trámite.",
                "B. El asunto se remite al Tribunal Administrativo para decisión.",
                "C. El gobernador decide la controversia."
            ],
            correct: 1
        },
        {
            id: "m2-q7",
            question: "El concejo no aprueba el presupuesto dentro del plazo establecido.",
            options: [
                "A. Se paraliza la administración hasta nueva aprobación.",
                "B. Rige el presupuesto presentado oportunamente por el alcalde y se adopta por decreto.",
                "C. Se repite automáticamente el del año anterior."
            ],
            correct: 1
        },
        {
            id: "m2-q8",
            question: "El presupuesto municipal incluye proyectos de inversión que no aparecen en el Plan de Desarrollo.",
            options: [
                "A. Es válido si hay recursos suficientes.",
                "B. No es válido: el presupuesto debe ser concordante con el Plan de Desarrollo.",
                "C. Es opcional la coordinación con el plan."
            ],
            correct: 1
        },
        {
            id: "m2-q9",
            question: "El municipio recibe recursos del Sistema General de Participaciones (SGP) y decide mezclarlos con los demás ingresos para libre uso.",
            options: [
                "A. Es correcto por el principio de unidad de caja.",
                "B. No es correcto; los recursos del SGP tienen destinación específica y no hacen unidad de caja.",
                "C. Solo aplica para educación, no para salud."
            ],
            correct: 1
        },
        {
            id: "m2-q10",
            question: "A usted lo integran al equipo técnico que diseña el Plan Operativo Anual de Inversiones (POAI) para la vigencia siguiente, para lo cual usted debe tener en cuenta que:",
            options: [
                "A. Debe incluir programas priorizados, costos, fuentes de financiación y cronograma de acciones.",
                "B. Solo debe listar proyectos sin costos.",
                "C. Debe limitarse a metas cualitativas sin presupuesto."
            ],
            correct: 0
        }
    ],
    "mod-3": [
        {
            id: "m3-q1",
            question: "La alcaldía debe expedir el decreto de liquidación del presupuesto antes del 25 de diciembre, incorporando las modificaciones aprobadas y corrigiendo errores. ¿Qué acción corresponde a la fase de liquidación del presupuesto?",
            options: [
                "A. Ejecutar pagos sin decreto de liquidación.",
                "B. Expedir el decreto de liquidación con anexo de discriminación del gasto.",
                "C. Crear nuevas apropiaciones sin aprobación."
            ],
            correct: 1
        },
        {
            id: "m3-q2",
            question: "A usted lo agregan a la secretaría de hacienda para apoyar el diseño del presupuesto, por lo tanto, clasifica los gastos entre funcionamiento, servicio de la deuda e inversión. ¿Qué está aplicando correctamente?",
            options: [
                "A. Estructurando la presentación de los gastos del presupuesto.",
                "B. Realizando el plan anual de caja.",
                "C. Realizando la reducción del presupuesto."
            ],
            correct: 0
        },
        {
            id: "m3-q3",
            question: "El jefe financiero necesita registrar primero el Certificado de Disponibilidad Presupuestal (CDP) antes de comprometer recursos. ¿En qué momento de la ejecución está actuando?",
            options: [
                "A. Pago",
                "B. Intención",
                "C. Obligación"
            ],
            correct: 1
        },
        {
            id: "m3-q4",
            question: "Una entidad quiere mover recursos de un rubro que ya no es indispensable hacia otro insuficiente, sin cambiar el valor total del presupuesto. ¿Qué tipo de modificación es?",
            options: [
                "A. Adición",
                "B. Crédito – contracrédito",
                "C. Reducción"
            ],
            correct: 1
        },
        {
            id: "m3-q5",
            question: "El Ministerio de Hacienda estima que los recaudos del año serán inferiores a los gastos comprometidos. ¿Qué medida procede según la norma?",
            options: [
                "A. Adición presupuestal",
                "B. Traslado interno",
                "C. Reducción del presupuesto mediante decreto"
            ],
            correct: 2
        },
        {
            id: "m3-q6",
            question: "La entidad donde usted labora diseña un nuevo servicio autorizado por ley que no estaba en el proyecto original y requiere aumentar el presupuesto. Su jefe le consulta qué trámite debe hacer, para lo cual usted le indica que debe:",
            options: [
                "A. Realizar una adición presupuestal",
                "B. Realizar un aplazamiento",
                "C. Realizar la reserva presupuestal"
            ],
            correct: 0
        },
        {
            id: "m3-q7",
            question: "La dependencia donde usted trabaja recibe bienes y servicios y procede a registrar formalmente la obligación. ¿En qué fase de ejecución se encuentra?",
            options: [
                "A. Perfeccionamiento",
                "B. Obligación",
                "C. Intención"
            ],
            correct: 1
        },
        {
            id: "m3-q8",
            question: "Usted clasifica un gasto como ‘servicios personales asociados a la nómina’. ¿A qué corresponde dentro de la estructura presupuestal?",
            options: [
                "A. Objeto del gasto",
                "B. Programa de inversión",
                "C. Traslado presupuestal"
            ],
            correct: 0
        },
        {
            id: "m3-q9",
            question: "La entidad en que usted trabaja incrementa el valor total aprobado por la corporación administrativa mediante un ajuste. ¿Cómo se clasifica esta acción?",
            options: [
                "A. Acto de ejecución",
                "B. Modificación presupuestal",
                "C. Registro contable simple"
            ],
            correct: 1
        },
        {
            id: "m3-q10",
            question: "El tesorero realiza el desembolso y registra el pago de una obligación ya causada. ¿En qué momento de la ejecución se encuentra?",
            options: [
                "A. Pago",
                "B. Perfeccionamiento",
                "C. Intención"
            ],
            correct: 0
        }
    ],
    "mod-4": [
        {
            id: "m4-q1",
            question: "Usted trabaja en un municipio de categoría cuarta el cual decide destinar el 90% de sus ingresos corrientes de libre destinación a gastos de funcionamiento. ¿Qué debe hacer según la norma?",
            options: [
                "A. Mantener el 90% porque es decisión autónoma del alcalde.",
                "B. Ajustar el presupuesto al límite máximo permitido por la Ley 617 de 2000.",
                "C. Pasar el gasto a inversión para evitar controles."
            ],
            correct: 1
        },
        {
            id: "m4-q2",
            question: "Una entidad territorial paga mesadas pensionales y realiza aportes al FONPET. ¿Cuál afirmación es correcta?",
            options: [
                "A. Ambos computan como gastos de funcionamiento.",
                "B. Ninguno computa como gasto de funcionamiento.",
                "C. Las mesadas pensionales sí computan; los aportes al FONPET no."
            ],
            correct: 2
        },
        {
            id: "m4-q3",
            question: "Durante la programación presupuestal se evidencia un déficit fiscal del año anterior. ¿Qué debe incluir el nuevo presupuesto?",
            options: [
                "A. Una partida para saldar el déficit.",
                "B. Solo un informe interno sin partida.",
                "C. Trasladar el déficit sin registro."
            ],
            correct: 0
        },
        {
            id: "m4-q4",
            question: "El concejo municipal lo cita a usted como secretario de hacienda para explicar la ejecución del gasto. ¿Qué tipo de control se está ejerciendo?",
            options: [
                "A. Realizando Control fiscal.",
                "B. Realizando Control político.",
                "C. Realizando Control interno."
            ],
            correct: 1
        },
        {
            id: "m4-q5",
            question: "Una entidad pública no implementa métodos y procedimientos de autocontrol institucional. ¿Qué incumple?",
            options: [
                "A. Sistema de control interno obligatorio.",
                "B. Control fiscal.",
                "C. Falta de auditoría financiera."
            ],
            correct: 0
        },
        {
            id: "m4-q6",
            question: "Una entidad diseña indicadores para medir resultados y productividad de la gestión pública. ¿Qué sistema fortalece?",
            options: [
                "A. Evaluación de gestión y resultados.",
                "B. Control fiscal.",
                "C. Únicamente auditoría externa."
            ],
            correct: 0
        },
        {
            id: "m4-q7",
            question: "Como funcionario de la Secretaría de Hacienda lo colocan a realizar seguimiento financiero y Planeación monitorea proyectos de inversión. Usted está haciendo el proceso de:",
            options: [
                "A. Seguimiento financiero del presupuesto.",
                "B. Control fiscal exclusivo.",
                "C. Moción de censura."
            ],
            correct: 0
        },
        {
            id: "m4-q8",
            question: "Usted ve a un compañero de la secretaría de Hacienda que ordena gastos sin apropiación disponible ni CDP. ¿Este qué está realizando?",
            options: [
                "A. Conducta regular.",
                "B. Conducta irregular en la ordenación del gasto.",
                "C. Ajuste técnico permitido."
            ],
            correct: 1
        },
        {
            id: "m4-q9",
            question: "El jefe de presupuesto no envía los informes mensuales de ejecución de ingresos y gastos. ¿Usted qué le dice que es este informe?",
            options: [
                "A. Una recomendación opcional.",
                "B. Un requisito obligatorio de informes presupuestales.",
                "C. Solo una práctica interna de control."
            ],
            correct: 1
        },
        {
            id: "m4-q10",
            question: "Un grupo de ciudadanos quiere organizarse para vigilar un contrato público financiado con recursos públicos. ¿Y ellos le piden orientación de cómo lo pueden hacer? Usted los orienta diciéndoles:",
            options: [
                "A. Deben organizar un control interno.",
                "B. Deben crear una veeduría ciudadana.",
                "C. Deben solicitar un control fiscal exclusivo de la Contraloría."
            ],
            correct: 1
        }
    ]
}

export function ExamForm({ courseId, moduleId }: { courseId: string; moduleId: string }) {
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Determine the active questions list
    const questionsList = courseId === "9" && COURSE_9_QUESTIONS[moduleId] 
        ? COURSE_9_QUESTIONS[moduleId] 
        : FALLBACK_QUESTIONS

    const handleSelect = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.keys(answers).length < questionsList.length) {
            toast.error("Por favor responde todas las preguntas")
            return
        }

        setLoading(true)

        let correctCount = 0

        questionsList.forEach(q => {
            if (answers[q.id] === q.correct) {
                correctCount++
            }
        })

        const score = (correctCount / questionsList.length) * 100

        // Grab attempts from localStorage
        const attemptKey = `exam_attempts_${courseId}_${moduleId}`
        const currentAttempts = parseInt(localStorage.getItem(attemptKey) || "0", 10)
        const newAttempts = currentAttempts + 1
        localStorage.setItem(attemptKey, newAttempts.toString())

        const result = await submitExam(courseId, moduleId, score)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
            return
        }

        if (score >= 60) {
            toast.success(`¡Examen aprobado con ${score.toFixed(0)}% en el intento #${newAttempts}!`, { duration: 6000 })
        } else {
            toast.error(`Suspendido (${score.toFixed(0)}%). No alcanzaste el puntaje mínimo de 60%. Intento #${newAttempts}. Debes repasar el material y volver a intentarlo.`, { duration: 8000 })
        }

        // Return user to the course details page
        router.push(`/diplomados/${courseId}`)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {questionsList.map((q, qIndex) => (
                <div key={q.id} className="space-y-4">
                    <h3 className="font-medium text-lg text-slate-900">{qIndex + 1}. {q.question}</h3>
                    <RadioGroup onValueChange={(val) => handleSelect(q.id, parseInt(val))} className="pl-4 space-y-3">
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-start space-x-3 cursor-pointer group">
                                <RadioGroupItem value={oIndex.toString()} id={`${q.id}-${oIndex}`} className="mt-1" />
                                <Label htmlFor={`${q.id}-${oIndex}`} className="text-slate-700 font-normal leading-normal cursor-pointer group-hover:text-primary transition-colors">
                                    {opt}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}

            <div className="pt-6 border-t border-slate-200">
                <Button type="submit" size="lg" className="w-full sm:w-auto font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg hover:shadow-secondary/25 transition-all" disabled={loading}>
                    {loading ? "Evaluando..." : "Enviar Respuestas"}
                </Button>
            </div>
        </form>
    )
}
