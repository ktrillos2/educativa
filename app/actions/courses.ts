"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const COVERS_BUCKET = "course-covers"

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/**
 * Uploads an image File to Supabase Storage and returns its public URL.
 */
async function uploadCoverImage(imageFile: File, courseId: string): Promise<string> {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  if (!validTypes.includes(imageFile.type)) {
    throw new Error(`Formato no soportado: "${imageFile.type}". Usa JPG, PNG o WebP.`)
  }

  const maxSizeBytes = 5 * 1024 * 1024
  if (imageFile.size > maxSizeBytes) {
    throw new Error(
      `La imagen pesa ${(imageFile.size / 1024 / 1024).toFixed(1)} MB. El límite es 5 MB.`
    )
  }

  const ext = imageFile.name.split(".").pop() || "jpg"
  const filePath = `${courseId}-${Date.now()}.${ext}`
  const arrayBuffer = await imageFile.arrayBuffer()

  const supabase = createAdminClient()

  const { error: uploadError } = await supabase.storage
    .from(COVERS_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType: imageFile.type,
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Error al subir la imagen: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Uploads a course info PDF directly to Supabase Storage and stores its URL in platform_settings.
 */
async function processCoursePdf(pdfFile: File, courseId: string): Promise<void> {
  const isPdf =
    pdfFile.type === "application/pdf" ||
    pdfFile.type.includes("pdf") ||
    pdfFile.name.toLowerCase().endsWith(".pdf")

  if (!isPdf || pdfFile.size === 0) return

  const maxSizeBytes = 30 * 1024 * 1024
  if (pdfFile.size > maxSizeBytes) {
    throw new Error(`El PDF pesa ${(pdfFile.size / 1024 / 1024).toFixed(1)} MB. El límite es 30 MB.`)
  }

  try {
    const arrayBuffer = await pdfFile.arrayBuffer()

    // Safety check: If arrayBuffer is empty/drained (< 500 bytes), skip to prevent overwriting a valid PDF URL
    if (!arrayBuffer || arrayBuffer.byteLength < 500) {
      console.warn("ArrayBuffer drains or is under 500 bytes. Skipping processCoursePdf to protect valid PDF record.")
      return
    }

    const supabase = createAdminClient()
    const slugId = slugify(courseId)
    const destinationPath = `course-${slugId}-${Date.now()}.pdf`
    let publicUrl = ""

    try {
      const { data: b } = await supabase.storage.getBucket("info-documents")
      if (!b) {
        await supabase.storage.createBucket("info-documents", { public: true })
      }
    } catch (e) {}

    try {
      const { error: uploadError } = await supabase.storage
        .from("info-documents")
        .upload(destinationPath, arrayBuffer, {
          contentType: "application/pdf",
          upsert: true,
        })

      if (!uploadError) {
        const { data } = supabase.storage.from("info-documents").getPublicUrl(destinationPath)
        publicUrl = data.publicUrl
      }
    } catch (storageErr) {
      console.warn("Storage upload in processCoursePdf failed, using Base64 fallback:", storageErr)
    }

    if (!publicUrl) {
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      if (base64.length < 500) {
        console.warn("Base64 string too short (< 500 chars). Skipping platform_settings update.")
        return
      }
      publicUrl = `data:application/pdf;base64,${base64}`
    }

    const keysToSave = [`course_pdf_${courseId}`, `course_info_${courseId}`]
    if (slugId !== courseId) {
      keysToSave.push(`course_pdf_${slugId}`)
      keysToSave.push(`course_info_${slugId}`)
    }

    for (const key of keysToSave) {
      await supabase
        .from("platform_settings")
        .upsert(
          { key, value: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
    }

    revalidatePath("/diplomados")
    revalidatePath("/formacion-academica")
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica/${courseId}`)
  } catch (err: any) {
    console.error("Error procesando PDF de curso:", err)
    throw new Error(`Error procesando PDF: ${err?.message || "Fallo interno"}`)
  }
}

export async function createCourse(formData: FormData) {
  const supabase = createAdminClient()
  
  let id = formData.get("id") as string
  const title = formData.get("title") as string
  
  if (!id && title) {
    id = slugify(title)
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
  const pdfFile = formData.get("pdf_file") as File | null

  if (imageFile && imageFile.size > 0) {
    try {
      image = await uploadCoverImage(imageFile, id)
    } catch (err: any) {
      return { error: err?.message || "No se pudo guardar la imagen de portada." }
    }
  }

  if (pdfFile && pdfFile.size > 0) {
    try {
      await processCoursePdf(pdfFile, id)
    } catch (err: any) {
      return { error: err?.message || "No se pudo procesar el PDF de información." }
    }
  }

  if (!image) {
    image = "/placeholder.svg"
  }

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
  
  const newId = formData.get("new_id") as string
  const finalId = newId && newId !== id ? newId : id
  
  let image = (formData.get("image") as string) || ""
  const imageFile = formData.get("image_file") as File | null
  const pdfFile = formData.get("pdf_file") as File | null

  if (imageFile && imageFile.size > 0) {
    try {
      image = await uploadCoverImage(imageFile, finalId)
    } catch (err: any) {
      return { error: err?.message || "No se pudo guardar la imagen de portada." }
    }
  }

  if (pdfFile && pdfFile.size > 0) {
    try {
      await processCoursePdf(pdfFile, finalId)
    } catch (err: any) {
      return { error: err?.message || "No se pudo procesar el PDF de información." }
    }
  }

  const students = type === 'etdh' ? `${min_students} cupos` : "50 cupos"

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

  revalidatePath("/admin/cursos")
  revalidatePath("/diplomados")
  revalidatePath("/formacion-academica")
  revalidatePath(`/diplomados/${id}`)
  revalidatePath(`/diplomados/${finalId}`)
  revalidatePath(`/formacion-academica/${id}`)
  revalidatePath(`/formacion-academica/${finalId}`)
  
  redirect("/admin/cursos")
}

export async function deleteCourse(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from("courses").delete().eq("id", id)

  if (error) {
    console.error("Error al eliminar el curso:", error)
    return { error: "No se pudo eliminar el curso." }
  }

  revalidatePath("/admin/cursos")
  revalidatePath("/diplomados")
  revalidatePath("/formacion-academica")

  return { success: true }
}
