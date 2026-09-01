"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCourse(formData: FormData) {
  const supabase = createAdminClient()
  
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = formData.get("price") as string
  const duration = formData.get("duration") as string
  const modules = Number(formData.get("modules") || 0)
  const min_students = Number(formData.get("min_students") || 0)
  const image = (formData.get("image") as string) || "/placeholder.svg"
  // Para la columna 'students' que originalmente indicaba modalidad o número de cupos
  const students = type === 'etdh' ? `${min_students} cupos` : "Autoestudio"

  if (!id || !title || !type) {
    return { error: "ID, Título y Tipo son campos requeridos." }
  }

  const { error } = await supabase
    .from("courses")
    .insert({
      id,
      title,
      type,
      description,
      category,
      price,
      duration,
      modules,
      students,
      image
    })

  if (error) {
    console.error("Error al crear el curso:", error)
    if (error.code === '23505') {
      return { error: "Ya existe un curso con este ID." }
    }
    return { error: "Error de base de datos al crear el curso." }
  }

  revalidatePath("/admin/cursos")
  revalidatePath("/diplomados")
  revalidatePath("/formacion-academica")
  
  redirect("/admin/cursos")
}
