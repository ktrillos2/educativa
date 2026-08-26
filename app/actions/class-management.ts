"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function finishClassWithRecording(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  const classId = formData.get("class_id") as string
  const fileUrl = formData.get("file_url") as string
  const courseId = formData.get("course_id") as string

  if (!classId || !fileUrl) {
    return { error: "Faltan campos obligatorios" }
  }

  const supabase = createAdminClient()

  // 1. Guardar la grabación
  const { error: recordingError } = await supabase.from("class_recordings").insert({
    class_id: classId,
    file_url: fileUrl,
  })

  if (recordingError) {
    console.error("Error guardando grabación:", recordingError)
    return { error: "Error al guardar el enlace de grabación" }
  }

  // 2. Marcar la clase como finalizada
  const { error: updateError } = await supabase
    .from("live_classes")
    .update({ status: "finished" })
    .eq("id", classId)

  if (updateError) {
    console.error("Error actualizando estado de clase:", updateError)
    return { error: "Error al finalizar la clase" }
  }

  revalidatePath(`/admin/clases/${classId}`)
  revalidatePath(`/admin/clases`)
  if (courseId) {
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/diplomados/${courseId}/clase/${classId}`)
  }

  return { success: true }
}

export async function finishClassWithoutRecording(classId: string, courseId?: string) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "No autorizado" }
  }

  if (!classId) return { error: "Falta class_id" }

  const supabase = createAdminClient()

  const { error: updateError } = await supabase
    .from("live_classes")
    .update({ status: "finished" })
    .eq("id", classId)

  if (updateError) {
    console.error("Error actualizando estado de clase:", updateError)
    return { error: "Error al finalizar la clase" }
  }

  revalidatePath(`/admin/clases/${classId}`)
  revalidatePath(`/admin/clases`)
  if (courseId) {
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/diplomados/${courseId}/clase/${classId}`)
  }

  return { success: true }
}
