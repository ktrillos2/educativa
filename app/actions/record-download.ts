"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"

export async function recordDownload(courseId: string, type: "CERTIFICATE" | "ACTA") {
    try {
        const session = await getSession()
        if (!session?.userId) {
            return { success: false, error: "No autorizado" }
        }

        const supabase = await createClient()

        // Insertar el registro de descarga (si falla, no interrumpimos la descarga del usuario)
        const { error } = await supabase.from("study_acts").insert({
            user_id: session.userId,
            course_id: courseId,
            type: type
        })

        if (error) {
            console.error("Error al registrar la descarga en study_acts:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error("Error inesperado en recordDownload:", err)
        return { success: false, error: "Error inesperado" }
    }
}
