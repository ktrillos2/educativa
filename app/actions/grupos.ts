"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createGroup(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  const courseId = formData.get("course_id") as string
  const name = formData.get("name") as string
  const start = formData.get("registration_start") as string
  const end = formData.get("registration_end") as string
  const whatsapp = formData.get("whatsapp_link") as string

  if (!courseId || !name || !start || !end) {
    return { error: "Faltan campos obligatorios" }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from("course_groups").insert({
    course_id: courseId,
    name: name,
    registration_start: new Date(start).toISOString(),
    registration_end: new Date(end).toISOString(),
    whatsapp_link: whatsapp || null,
  })

  if (error) {
    console.error("Error creating group:", error)
    return { error: "Error al crear el grupo" }
  }

  revalidatePath("/admin/grupos")
  return { success: true }
}

export async function deleteGroup(groupId: string) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from("course_groups").delete().eq("id", groupId)

  if (error) {
    console.error("Error deleting group:", error)
    return { error: "Error al eliminar el grupo" }
  }

  revalidatePath("/admin/grupos")
  return { success: true }
}
