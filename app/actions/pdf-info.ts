"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

/** Supabase Storage bucket configured for PDF files */
const BUCKET_NAME = "course-modules"

/**
 * Uploads a PDF file to Supabase Storage (course-modules bucket) and returns an accessible URL.
 */
async function uploadPdfToStorage(pdfFile: File, destinationPath: string): Promise<string> {
  const isPdf =
    pdfFile.type === "application/pdf" ||
    pdfFile.type.includes("pdf") ||
    pdfFile.name.toLowerCase().endsWith(".pdf")

  if (!isPdf) {
    throw new Error(`El archivo "${pdfFile.name}" debe ser un documento PDF (.pdf).`)
  }

  const maxSizeBytes = 20 * 1024 * 1024 // 20 MB
  if (pdfFile.size > maxSizeBytes) {
    throw new Error(`El PDF pesa ${(pdfFile.size / 1024 / 1024).toFixed(1)} MB. El límite máximo es 20 MB.`)
  }

  const arrayBuffer = await pdfFile.arrayBuffer()
  const supabase = createAdminClient()

  // Attempt upload with application/pdf first, fallback to octet-stream if bucket rules require
  let uploadResult = await supabase.storage
    .from(BUCKET_NAME)
    .upload(destinationPath, arrayBuffer, {
      contentType: "application/pdf",
      upsert: true,
    })

  if (uploadResult.error) {
    uploadResult = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, arrayBuffer, {
        contentType: "application/octet-stream",
        upsert: true,
      })
  }

  if (uploadResult.error) {
    console.error("Error al subir PDF a Supabase Storage:", uploadResult.error)
    throw new Error(`Error al subir el archivo PDF: ${uploadResult.error.message}`)
  }

  // Generate signed URL (valid for 10 years) to support both public & private buckets
  const { data: signedData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(destinationPath, 60 * 60 * 24 * 365 * 10)

  if (signedData?.signedUrl) {
    return signedData.signedUrl
  }

  // Fallback to public URL if bucket is public
  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(destinationPath)
  return publicData.publicUrl
}

/**
 * Uploads a general info PDF (Diplomados or ETDH) and saves its URL in platform_settings.
 * Keys: "info_diplomados_pdf" | "info_etdh_pdf"
 */
export async function uploadGeneralInfoPdf(formData: FormData) {
  const type = formData.get("type") as string // "diplomados" | "etdh"
  const pdfFile = formData.get("pdf_file") as File | null

  if (!pdfFile || pdfFile.size === 0) {
    return { error: "No se seleccionó ningún archivo PDF." }
  }

  try {
    const filename = `info-pdfs/general-${type}-${Date.now()}.pdf`
    const publicUrl = await uploadPdfToStorage(pdfFile, filename)

    const key = type === "etdh" ? "info_etdh_pdf" : "info_diplomados_pdf"
    const supabase = createAdminClient()

    const { error: upsertError } = await supabase
      .from("platform_settings")
      .upsert(
        { key, value: publicUrl, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )

    if (upsertError) {
      console.error("Error al guardar la URL del PDF:", upsertError)
      return { error: "Error de base de datos al registrar el PDF." }
    }

    revalidatePath("/diplomados")
    revalidatePath("/formacion-academica")
    revalidatePath("/admin/configuracion")

    return { success: true, pdfUrl: publicUrl }
  } catch (err: any) {
    console.error("Error al procesar PDF general:", err)
    return { error: err?.message || "Error al subir el archivo PDF." }
  }
}

/**
 * Uploads a course-specific info PDF and saves its URL in platform_settings.
 * Key: "course_pdf_{courseId}"
 */
export async function uploadCourseInfoPdf(formData: FormData) {
  const courseId = formData.get("course_id") as string
  const pdfFile = formData.get("pdf_file") as File | null

  if (!courseId) {
    return { error: "Falta el identificador del curso." }
  }

  if (!pdfFile || pdfFile.size === 0) {
    return { error: "No se seleccionó ningún archivo PDF." }
  }

  try {
    const filename = `info-pdfs/course-${courseId}-${Date.now()}.pdf`
    const publicUrl = await uploadPdfToStorage(pdfFile, filename)

    const key = `course_pdf_${courseId}`
    const supabase = createAdminClient()

    const { error: upsertError } = await supabase
      .from("platform_settings")
      .upsert(
        { key, value: publicUrl, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )

    if (upsertError) {
      console.error("Error al guardar la URL del PDF del curso:", upsertError)
      return { error: "Error de base de datos al guardar la información." }
    }

    revalidatePath("/diplomados")
    revalidatePath("/formacion-academica")
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica/${courseId}`)
    revalidatePath("/admin/configuracion")

    return { success: true, pdfUrl: publicUrl, courseId }
  } catch (err: any) {
    console.error("Error al subir PDF del curso:", err)
    return { error: err?.message || "Error al subir el archivo PDF." }
  }
}

/**
 * Retrieves the stored PDF URL for a given key from platform_settings.
 */
export async function getPdfUrl(key: string): Promise<string | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()

    if (error || !data?.value) {
      return null
    }

    const val = String(data.value).trim()
    if (
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:")
    ) {
      return val
    }
    return null
  } catch (e) {
    console.error("Error al obtener URL de PDF:", e)
    return null
  }
}

/**
 * Backward compatibility helper for getting content or PDF URL.
 */
export async function getInfoContent(key: string): Promise<string | null> {
  return getPdfUrl(key)
}
