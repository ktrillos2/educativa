import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

const BUCKET_NAME = "info-documents"

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/**
 * Ensures the public 'info-documents' bucket exists in Supabase Storage.
 */
async function ensureBucket(supabase: any) {
  try {
    const { data: bucket, error } = await supabase.storage.getBucket(BUCKET_NAME)
    if (!bucket || error) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
      })
    }
  } catch (e) {
    console.warn("No se pudo verificar o crear el bucket:", e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const type = formData.get("type") as string // "diplomados" | "etdh" | "course"
    const rawCourseId = formData.get("course_id") as string | null
    const pdfFile = formData.get("pdf_file") as File | null

    // Validación Paso 1: Recepción del archivo
    if (!pdfFile || pdfFile.size === 0) {
      return NextResponse.json(
        { error: "[Paso 1/4 - Validación] No se adjuntó ningún archivo PDF." },
        { status: 400 }
      )
    }

    // Validación Paso 2: Formato del archivo
    const isPdf =
      pdfFile.type === "application/pdf" ||
      pdfFile.type.includes("pdf") ||
      pdfFile.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      return NextResponse.json(
        { error: `[Paso 2/4 - Formato] El archivo "${pdfFile.name}" no es un PDF válido.` },
        { status: 400 }
      )
    }

    // Validación Paso 3: Tamaño del archivo
    const maxSizeBytes = 30 * 1024 * 1024 // 30 MB
    if (pdfFile.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `[Paso 3/4 - Tamaño] El PDF pesa ${(pdfFile.size / 1024 / 1024).toFixed(1)} MB. El límite es 30 MB.` },
        { status: 400 }
      )
    }

    // Validación Paso 4: Identificador de Curso si aplica
    let courseId = rawCourseId || ""
    if (type === "course" && !courseId) {
      return NextResponse.json(
        { error: "[Paso 4/4 - Identificador] Debes seleccionar un curso o diplomado válido." },
        { status: 400 }
      )
    }

    const arrayBuffer = await pdfFile.arrayBuffer()
    if (!arrayBuffer || arrayBuffer.byteLength < 500) {
      return NextResponse.json(
        { error: "[Error de Contenido] El archivo PDF seleccionado está vacío o no tiene suficiente contenido." },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    await ensureBucket(supabase)

    let destinationPath = ""
    let primaryKey = ""

    if (type === "course") {
      destinationPath = `course-${slugify(courseId)}-${Date.now()}.pdf`
      primaryKey = `course_pdf_${courseId}`
    } else if (type === "etdh") {
      destinationPath = `general-etdh-${Date.now()}.pdf`
      primaryKey = "info_etdh_pdf"
    } else {
      destinationPath = `general-diplomados-${Date.now()}.pdf`
      primaryKey = "info_diplomados_pdf"
    }

    let publicUrl = ""

    // Subir a Supabase Storage bucket 'info-documents'
    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(destinationPath, arrayBuffer, {
          contentType: "application/pdf",
          upsert: true,
        })

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(destinationPath)
        publicUrl = data.publicUrl
      } else {
        console.warn("Error en upload a info-documents, reintentando con octet-stream:", uploadError.message)
        const { error: retryError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(destinationPath, arrayBuffer, {
            contentType: "application/octet-stream",
            upsert: true,
          })

        if (!retryError) {
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(destinationPath)
          publicUrl = data.publicUrl
        }
      }
    } catch (e: any) {
      console.warn("Error de almacenamiento:", e?.message)
    }

    // Respaldo Base64 Data URL si el almacenamiento falló
    if (!publicUrl) {
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      publicUrl = `data:application/pdf;base64,${base64}`
    }

    // Guardar la URL en platform_settings
    const keysToSave = [primaryKey]
    if (type === "course" && courseId) {
      keysToSave.push(`course_info_${courseId}`)
      const slugId = slugify(courseId)
      if (slugId !== courseId) {
        keysToSave.push(`course_pdf_${slugId}`)
        keysToSave.push(`course_info_${slugId}`)
      }
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
    revalidatePath("/admin/configuracion")
    if (courseId) {
      revalidatePath(`/diplomados/${courseId}`)
      revalidatePath(`/formacion-academica/${courseId}`)
    }

    return NextResponse.json({
      success: true,
      pdfUrl: publicUrl.startsWith("data:") ? "DataURL (Guardado en BD)" : publicUrl,
      key: primaryKey,
      message: "¡PDF subido y registrado exitosamente!",
    })
  } catch (err: any) {
    console.error("Error crítico en /api/upload-pdf:", err)
    return NextResponse.json(
      { error: `[Error Servidor] ${err?.message || "Error interno del servidor al procesar la solicitud."}` },
      { status: 500 }
    )
  }
}
