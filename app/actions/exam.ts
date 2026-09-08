"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { COURSE_9_QUESTIONS, FALLBACK_QUESTIONS } from "@/lib/exam-data"

export async function submitExam(courseId: string, moduleId: string, answers: Record<string, number>) {
    const session = await getSession()
    if (!session?.userId) {
        return { error: "No autorizado. Inicia sesión para continuar." }
    }

    // Calcular puntaje en el servidor usando los datos verdaderos
    const questionsList = courseId === "9" && COURSE_9_QUESTIONS[moduleId] 
        ? COURSE_9_QUESTIONS[moduleId] 
        : FALLBACK_QUESTIONS;

    let correctCount = 0;
    const results = [];

    for (const q of questionsList) {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correct;
        if (isCorrect) correctCount++;

        results.push({
            questionId: q.id,
            isCorrect,
            correctAnswerIdx: q.correct,
            feedback: isCorrect ? (q.feedbackCorrect || '¡Respuesta correcta!') : (q.feedbackIncorrect || 'Respuesta incorrecta.')
        });
    }

    const score = (correctCount / questionsList.length) * 100;
    const isCompleted = score >= 60;

    try {
        if (session.userId === "mock-user-no-db") {
            revalidatePath(`/diplomados/${courseId}`)
            revalidatePath(`/diplomados/${courseId}/exam/${moduleId}`)
            return { success: true, score, results }
        }

        const supabase = await createClient()

        // Check if progress exists
        const { data: existingProgress, error: fetchError } = await supabase
            .from("progress")
            .select("id, score")
            .eq("user_id", session.userId)
            .eq("course_id", courseId)
            .eq("module_id", moduleId)
            .maybeSingle()

        if (fetchError) {
            console.error("Error fetching progress:", fetchError)
            return { error: "Error al verificar el progreso existente." }
        }

        if (existingProgress) {
            // Only keep the highest score
            const oldScore = Number(existingProgress.score)
            if (score > oldScore) {
                const { error: updateError } = await supabase
                    .from("progress")
                    .update({
                        score: score,
                        completed: isCompleted,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", existingProgress.id)

                if (updateError) {
                    console.error("Error updating progress:", updateError)
                    return { error: "Error al actualizar la calificación." }
                }
            }
        } else {
            const { error: insertError } = await supabase
                .from("progress")
                .insert({
                    user_id: session.userId,
                    course_id: courseId,
                    module_id: moduleId,
                    score: score,
                    completed: isCompleted
                })

            if (insertError) {
                console.error("Error inserting progress:", insertError)
                return { error: "Error al guardar la calificación." }
            }
        }

        revalidatePath(`/diplomados/${courseId}`)
        revalidatePath(`/diplomados/${courseId}/exam/${moduleId}`)

        return { success: true, score, results }
    } catch (error) {
        console.error("Exam submission error:", error)
        return { error: "Ocurrió un error al guardar el examen." }
    }
}
