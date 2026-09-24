"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { getFullQuestionsForCourse } from "@/lib/exam-data"

export async function submitExam(courseId: string, moduleId: string, answers: Record<string, number>) {
    const session = await getSession()
    if (!session?.userId) {
        return { error: "No autorizado. Inicia sesión para continuar." }
    }

    // Calcular puntaje en el servidor usando los datos verdaderos
    const questionsList = getFullQuestionsForCourse(courseId, moduleId);

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
            const oldScore = Number(existingProgress.score || 0)
            const currentAttempts = Number((existingProgress as any).attempts || 1)
            const newScore = Math.max(score, oldScore)
            const newlyCompleted = isCompleted || Boolean((existingProgress as any).completed)

            const { error: updateError } = await supabase
                .from("progress")
                .update({
                    score: newScore,
                    completed: newlyCompleted,
                    attempts: currentAttempts + 1,
                    last_score: score,
                    updated_at: new Date().toISOString()
                } as any)
                .eq("id", existingProgress.id)

            if (updateError) {
                console.error("Error updating progress:", updateError)
                // Fallback attempt update if custom columns don't exist in schema
                await supabase
                    .from("progress")
                    .update({
                        score: newScore,
                        completed: newlyCompleted,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", existingProgress.id)
            }
        } else {
            const { error: insertError } = await supabase
                .from("progress")
                .insert({
                    user_id: session.userId,
                    course_id: courseId,
                    module_id: moduleId,
                    score: score,
                    completed: isCompleted,
                    attempts: 1,
                    last_score: score
                } as any)

            if (insertError) {
                // Fallback insert if custom columns don't exist
                await supabase
                    .from("progress")
                    .insert({
                        user_id: session.userId,
                        course_id: courseId,
                        module_id: moduleId,
                        score: score,
                        completed: isCompleted
                    })
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
