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
