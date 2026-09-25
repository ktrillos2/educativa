"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function toggleEnrollmentExpiration(enrollmentId: string, isExpired: boolean) {
    const session = await getSession()
    if (!session || session.role !== "admin") {
        return { success: false, error: "No autorizado" }
    }

    try {
        const supabase = createAdminClient()
        const { error } = await supabase
            .from("enrollments")
            .update({ is_expired: isExpired })
            .eq("id", enrollmentId)

        if (error) throw error

        revalidatePath("/admin/usuarios")
        return { success: true }
    } catch (error: any) {
        console.error("Error toggling enrollment expiration:", error)
        return { success: false, error: error.message }
    }
}

export async function forceApproveStudent(userId: string, courseId: string, totalModules: number) {
    const session = await getSession()
    if (!session || session.role !== "admin") {
        return { success: false, error: "No autorizado" }
    }

    try {
        const supabase = createAdminClient()

        // 1. Verificar y actualizar pago
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select("id, payment_verified")
            .eq("user_id", userId)
            .eq("course_id", courseId)
            .maybeSingle()

        if (enrollment && !enrollment.payment_verified) {
            const { error: updateError } = await supabase
                .from("enrollments")
                .update({ payment_verified: true })
                .eq("id", enrollment.id)
            if (updateError) throw updateError;
        }

        // 2. Insertar progreso al 100%
        for (let i = 1; i <= totalModules; i++) {
            const moduleId = `modulo-${i}`
            const { data: existing, error: selectError } = await supabase
                .from("progress")
                .select("id")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .eq("module_id", moduleId)
                .limit(1)
                .maybeSingle()
            if (selectError && selectError.code !== 'PGRST116') throw selectError;

            if (existing) {
                const { error: updateErr } = await supabase
                    .from("progress")
                    .update({ score: 100, completed: true })
                    .eq("id", existing.id)
                if (updateErr) throw updateErr;
            } else {
                // Generar UUID de forma segura
                let uuid = "";
                if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                    uuid = crypto.randomUUID();
                } else {
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                const { error: insertErr } = await supabase
                    .from("progress")
                    .insert({
                        id: uuid,
                        user_id: userId,
                        course_id: courseId,
                        module_id: moduleId,
                        score: 100,
                        completed: true
                    })
                if (insertErr) throw insertErr;
            }
        }

        revalidatePath("/admin/usuarios")
        return { success: true }
    } catch (error: any) {
        console.error("Error force approving student:", error)
        return { success: false, error: error.message }
    }
}
