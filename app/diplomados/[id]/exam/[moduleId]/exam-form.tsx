"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitExam } from "@/app/actions/exam"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export type CleanQuestion = {
    id: string;
    question: string;
    options: string[];
}

export type QuestionResult = {
    questionId: string;
    isCorrect: boolean;
    correctAnswerIdx: number;
    feedback: string;
}

export function ExamForm({ courseId, moduleId, initialQuestions }: { courseId: string; moduleId: string; initialQuestions: CleanQuestion[] }) {
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [finalScore, setFinalScore] = useState(0)
    const [attemptsCount, setAttemptsCount] = useState(0)
    const [feedbackData, setFeedbackData] = useState<QuestionResult[]>([])
    const router = useRouter()

    const handleSelect = (questionId: string, answerIndex: number) => {
        if (submitted) return; // Prevent changing answers after submission
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.keys(answers).length < initialQuestions.length) {
            toast.error("Por favor responde todas las preguntas")
            return
        }

        setLoading(true)

        // Grab attempts from localStorage
        const attemptKey = `exam_attempts_${courseId}_${moduleId}`
        const currentAttempts = parseInt(localStorage.getItem(attemptKey) || "0", 10)
        const newAttempts = currentAttempts + 1
        localStorage.setItem(attemptKey, newAttempts.toString())

        const result = await submitExam(courseId, moduleId, answers)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
            return
        }

        if (result.score >= 60) {
            toast.success(`¡Examen aprobado con ${result.score.toFixed(0)}% en el intento #${newAttempts}!`, { duration: 6000 })
        } else {
            toast.error(`Suspendido (${result.score.toFixed(0)}%). No alcanzaste el puntaje mínimo de 60%.`, { duration: 8000 })
        }

        setFinalScore(result.score)
        setFeedbackData(result.results || [])
        setAttemptsCount(newAttempts)
        setSubmitted(true)
        window.scrollTo(0, 0)
    }

    if (submitted) {
        const passed = finalScore >= 60;
        return (
            <div className="space-y-8 animate-fade-up">
                <div className={`p-6 rounded-lg border ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-700' : 'text-red-700'}`}>
                        {passed ? '¡Examen Aprobado!' : 'Examen Suspendido'}
                    </h2>
                    <p className="text-slate-700">
                        Tu puntaje final es <strong>{finalScore.toFixed(0)}%</strong>. (Intento #{attemptsCount}).
                        {!passed && " Debes repasar el material y volver a intentarlo para alcanzar el mínimo de 60%."}
                    </p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Resultados Detallados</h3>
                    {initialQuestions.map((q, qIndex) => {
                        const userAnswer = answers[q.id];
                        const fData = feedbackData.find(f => f.questionId === q.id);
                        const isCorrect = fData?.isCorrect || false;
                        const correctAnswerIdx = fData?.correctAnswerIdx ?? -1;
                        const feedbackText = fData?.feedback || '';

                        return (
                            <div key={q.id} className={`p-5 rounded-lg border ${isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                <h4 className="font-medium text-lg text-slate-900 mb-3">{qIndex + 1}. {q.question}</h4>
                                <div className="space-y-2 mb-4 pl-4">
                                    {q.options.map((opt, oIndex) => {
                                        let optClass = "text-slate-600";
                                        if (oIndex === correctAnswerIdx) optClass = "text-green-700 font-bold";
                                        else if (oIndex === userAnswer && !isCorrect) optClass = "text-red-700 font-bold line-through";
                                        
                                        return (
                                            <div key={oIndex} className="flex items-start space-x-2">
                                                <div className={`mt-1 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${oIndex === userAnswer ? (isCorrect ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500') : 'border-slate-300'}`}>
                                                    {oIndex === userAnswer && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <span className={optClass}>{opt}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                {feedbackText && (
                                    <div className="p-4 bg-white rounded border text-sm text-slate-700 shadow-sm">
                                        <strong className="block mb-1 text-slate-900">Retroalimentación:</strong>
                                        <p className="whitespace-pre-wrap">{feedbackText}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    {!passed && (
                        <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo(0,0) }}>
                            Reintentar Examen
                        </Button>
                    )}
                    <Button onClick={() => { router.push(`/estudiante/cursos/${courseId}`); router.refresh(); }} className="bg-secondary hover:bg-secondary/90 text-white font-bold">
                        Volver al Aula Virtual
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up">
            {initialQuestions.map((q, qIndex) => (
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
                <Button type="submit" size="lg" className="w-full sm:w-auto font-bold bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-secondary/25 transition-all" disabled={loading}>
                    {loading ? "Evaluando..." : "Enviar Respuestas"}
                </Button>
            </div>
        </form>
    )
}
