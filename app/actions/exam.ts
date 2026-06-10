"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitExam(courseId: string, moduleId: string, score: number) {
    const session = await getSession()
    if (!session?.userId) {
        return { error: "No autorizado. Inicia sesión para continuar." }
    }

    try {
        if (session.userId === "mock-user-no-db") {
            revalidatePath(`/diplomados/${courseId}`)
            revalidatePath(`/diplomados/${courseId}/exam/${moduleId}`)
            return { success: true }
        }

        const isCompleted = score >= 60
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

        return { success: true }
    } catch (error) {
        console.error("Exam submission error:", error)
        return { error: "Ocurrió un error al guardar el examen." }
    }
}
