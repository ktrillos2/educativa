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

        // Lógica de ETDH: registrar primera descarga de certificado del cohorte
        if (type === "CERTIFICATE") {
            const { createAdminClient } = await import("@/utils/supabase/admin")
            const adminSupabase = createAdminClient()
            
            // Buscar inscripción y tipo de curso
            const { data: enrollmentData } = await adminSupabase
                .from("enrollments")
                .select("group_id, courses(type)")
                .eq("user_id", session.userId)
                .eq("course_id", courseId)
                .maybeSingle()

            if (enrollmentData?.group_id) {
                // Verificar tipo usando un join anidado, si courses(type) falló, lo buscamos manual:
                const isETDH = 
                    (Array.isArray(enrollmentData.courses) ? enrollmentData.courses[0]?.type : (enrollmentData.courses as any)?.type) === "etdh"

                if (isETDH) {
                    // Actualizar el grupo si no tiene la fecha asignada
                    // Para evitar sobrescribir con una fecha más reciente si ya tiene una, usamos un select previo o dependemos de la bd.
                    const { data: group } = await adminSupabase
                        .from("course_groups")
                        .select("first_certificate_download_at")
                        .eq("id", enrollmentData.group_id)
                        .maybeSingle()

                    if (group && !group.first_certificate_download_at) {
                        await adminSupabase
                            .from("course_groups")
                            .update({ first_certificate_download_at: new Date().toISOString() })
                            .eq("id", enrollmentData.group_id)
                    }
                }
            }
        }

        return { success: true }
    } catch (err) {
        console.error("Error inesperado en recordDownload:", err)
        return { success: false, error: "Error inesperado" }
    }
}
