"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitExam } from "@/app/actions/exam"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const DUMMY_QUESTIONS = [
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

export function ExamForm({ courseId, moduleId }: { courseId: string; moduleId: string }) {
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSelect = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.keys(answers).length < DUMMY_QUESTIONS.length) {
            toast.error("Por favor responde todas las preguntas")
            return
        }

        setLoading(true)

        let correctCount = 0

        DUMMY_QUESTIONS.forEach(q => {
            if (answers[q.id] === q.correct) {
                correctCount++
            }
        })

        const score = (correctCount / DUMMY_QUESTIONS.length) * 100

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
            toast.success(`¡Examen aprobado con ${score}% en el intento #${newAttempts}!`, { duration: 6000 })
        } else {
            toast.error(`Suspendido (${score}%). No alcanzaste el puntaje mínimo de 60%. Intento #${newAttempts}. Debes repasar el material y volver a intentarlo.`, { duration: 8000 })
        }

        // Saca al usuario del examen
        router.push(`/diplomados/${courseId}`)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {DUMMY_QUESTIONS.map((q, qIndex) => (
                <div key={q.id} className="space-y-4">
                    <h3 className="font-medium text-lg">{qIndex + 1}. {q.question}</h3>
                    <RadioGroup onValueChange={(val) => handleSelect(q.id, parseInt(val))} className="pl-4 space-y-2">
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={oIndex.toString()} id={`${q.id}-${oIndex}`} />
                                <Label htmlFor={`${q.id}-${oIndex}`}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}

            <div className="pt-6 border-t">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
                    {loading ? "Evaluando..." : "Enviar Respuestas"}
                </Button>
            </div>
        </form>
    )
}
