"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createLiveClass(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  const groupId = formData.get("group_id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const scheduledAt = formData.get("scheduled_at") as string

  if (!groupId || !title || !scheduledAt) {
    return { error: "Faltan campos obligatorios" }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from("live_classes").insert({
    group_id: groupId,
    title,
    description: description || null,
    scheduled_at: new Date(scheduledAt).toISOString(),
    status: 'scheduled'
  })

  if (error) {
    console.error("Error creating live class:", error)
    return { error: "Error al programar la clase" }
  }

  revalidatePath("/admin/clases")
  return { success: true }
}

export async function updateClassStatus(classId: string, status: 'scheduled' | 'in_progress' | 'finished') {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("live_classes").update({ status }).eq("id", classId)

  if (error) return { error: "Error actualizando el estado" }
  
  revalidatePath("/admin/clases")
  return { success: true }
}
