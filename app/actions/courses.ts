"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import fs from "fs"
import path from "path"

export async function createCourse(formData: FormData) {
  const supabase = createAdminClient()
  
  let id = formData.get("id") as string
  const title = formData.get("title") as string
  
  if (!id && title) {
    id = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  }

  const type = formData.get("type") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = formData.get("price") as string
  const duration = formData.get("duration") as string
  const modules = Number(formData.get("modules") || 0)
  const min_students = Number(formData.get("min_students") || 0)
  
  let image = (formData.get("image") as string) || ""
  const imageFile = formData.get("image_file") as File | null

  if (imageFile && imageFile.size > 0) {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]
    if (!validTypes.includes(imageFile.type)) {
      return { error: `Formato de imagen no soportado: "${imageFile.type}". Usa JPG, PNG, WebP o SVG.` }
    }

    // Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024
    if (imageFile.size > maxSizeBytes) {
      return { error: `La imagen es demasiado grande (${(imageFile.size / 1024 / 1024).toFixed(1)} MB). El límite es 5 MB.` }
    }

    try {
      const publicCoursesDir = path.join(process.cwd(), "public", "courses")
      if (!fs.existsSync(publicCoursesDir)) {
        fs.mkdirSync(publicCoursesDir, { recursive: true })
      }
      const ext = path.extname(imageFile.name) || ".jpg"
      const fileName = `${id}-${Date.now()}${ext}`
      const filePath = path.join(publicCoursesDir, fileName)
      const arrayBuffer = await imageFile.arrayBuffer()
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
      image = `/courses/${fileName}`
    } catch (err: any) {
      console.error("Error saving course cover image file:", err)
      return { error: `No se pudo guardar la imagen de portada: ${err?.message || "Error desconocido"}. Intenta de nuevo.` }
    }
  }

  if (!image) {
    image = "/placeholder.svg"
  }

  // Para la columna 'students' que originalmente indicaba modalidad o número de cupos
  const students = type === 'etdh' ? `${min_students} cupos` : "50 cupos"

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
  revalidatePath(`/diplomados/${id}`)
  
  redirect("/admin/cursos")
}

export async function updateCourse(formData: FormData) {
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
  
  let image = (formData.get("image") as string) || ""
  const imageFile = formData.get("image_file") as File | null

  if (imageFile && imageFile.size > 0) {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]
    if (!validTypes.includes(imageFile.type)) {
      return { error: `Formato de imagen no soportado: "${imageFile.type}". Usa JPG, PNG, WebP o SVG.` }
    }

    // Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024
    if (imageFile.size > maxSizeBytes) {
      return { error: `La imagen es demasiado grande (${(imageFile.size / 1024 / 1024).toFixed(1)} MB). El límite es 5 MB.` }
    }

    try {
      const publicCoursesDir = path.join(process.cwd(), "public", "courses")
      if (!fs.existsSync(publicCoursesDir)) {
        fs.mkdirSync(publicCoursesDir, { recursive: true })
      }
      const ext = path.extname(imageFile.name) || ".jpg"
      const fileName = `${id}-${Date.now()}${ext}`
      const filePath = path.join(publicCoursesDir, fileName)
      const arrayBuffer = await imageFile.arrayBuffer()
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
      image = `/courses/${fileName}`
    } catch (err: any) {
      console.error("Error saving course cover image file:", err)
      return { error: `No se pudo guardar la imagen de portada: ${err?.message || "Error desconocido"}. Intenta de nuevo.` }
    }
  }

  const students = type === 'etdh' ? `${min_students} cupos` : "50 cupos"

  const newId = formData.get("new_id") as string
  const finalId = newId && newId !== id ? newId : id

  const updateData: any = {
    title,
    type,
    description,
    category,
    price,
    duration,
    modules,
    students,
  }

  if (newId && newId !== id) {
    updateData.id = newId
  }

  if (image) {
    updateData.image = image
  }

  const { error } = await supabase
    .from("courses")
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error("Error al actualizar el curso:", error)
    return { error: "Error de base de datos al actualizar el curso. Quizás el ID ya existe." }
  }

  // Si cambió el ID, renombrar los archivos relacionados
  if (newId && newId !== id) {
    try {
      const diplomadosDir = path.join(process.cwd(), "diplomados")
      if (fs.existsSync(diplomadosDir)) {
        // exams_{id}.json -> exams_{new_id}.json
        const oldJsonPath = path.join(diplomadosDir, `exams_${id}.json`)
        if (fs.existsSync(oldJsonPath)) fs.renameSync(oldJsonPath, path.join(diplomadosDir, `exams_${newId}.json`))

        // PDFs
        const files = fs.readdirSync(diplomadosDir)
        for (const file of files) {
          if (file.endsWith(`- ${id}.pdf`)) {
            const newFile = file.replace(`- ${id}.pdf`, `- ${newId}.pdf`)
            fs.renameSync(path.join(diplomadosDir, file), path.join(diplomadosDir, newFile))
          }
        }
      }
    } catch (err) {
      console.error("Error renombrando archivos de módulos:", err)
    }
  }

  revalidatePath("/admin/cursos")
  revalidatePath("/diplomados")
  revalidatePath("/formacion-academica")
  revalidatePath(`/diplomados/${finalId}`)
  revalidatePath(`/admin/cursos/${finalId}/editar`)
  revalidatePath(`/admin/cursos/${finalId}/modulos`)
  
  redirect("/admin/cursos")
}

export async function deleteCourse(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from("courses").delete().eq('id', id)
  
  if (error) {
    console.error("Error al eliminar el curso:", error)
    return { error: "Error de base de datos al eliminar el curso." }
  }

  revalidatePath("/admin/cursos")
  revalidatePath("/diplomados")
  revalidatePath("/formacion-academica")
}
