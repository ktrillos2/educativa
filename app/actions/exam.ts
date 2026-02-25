"use server"

import { db } from "@/lib/db"
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

        const isCompleted = score >= 60 ? 1 : 0

        // Check if progress exists
        const existing = await db.execute({
            sql: "SELECT id, score FROM progress WHERE user_id = ? AND course_id = ? AND module_id = ?",
            args: [session.userId, courseId, moduleId]
        })

        if (existing.rows.length > 0) {
            // Only keep the highest score
            const oldScore = Number(existing.rows[0].score)
            if (score > oldScore) {
                await db.execute({
                    sql: "UPDATE progress SET score = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    args: [score, isCompleted, existing.rows[0].id]
                })
            }
        } else {
            await db.execute({
                sql: "INSERT INTO progress (id, user_id, course_id, module_id, score, completed) VALUES (?, ?, ?, ?, ?, ?)",
                args: [crypto.randomUUID(), session.userId, courseId, moduleId, score, isCompleted]
            })
        }

        revalidatePath(`/diplomados/${courseId}`)
        revalidatePath(`/diplomados/${courseId}/exam/${moduleId}`)

        return { success: true }
    } catch (error) {
        console.error("Exam submission error:", error)
        return { error: "Ocurrió un error al guardar el examen." }
    }
}
