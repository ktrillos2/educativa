import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

const BUCKET_NAME = "course-modules"

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const type = formData.get("type") as string // "diplomados" | "etdh" | "course"
    const rawCourseId = formData.get("course_id") as string | null
    const pdfFile = formData.get("pdf_file") as File | null

    if (!pdfFile || pdfFile.size === 0) {
      return NextResponse.json(
        { error: "No se seleccionó ningún archivo PDF." },
        { status: 400 }
      )
    }

    const isPdf =
      pdfFile.type === "application/pdf" ||
      pdfFile.type.includes("pdf") ||
      pdfFile.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      return NextResponse.json(
        { error: `El archivo "${pdfFile.name}" debe ser un documento PDF (.pdf).` },
        { status: 400 }
      )
    }

    const maxSizeBytes = 40 * 1024 * 1024 // 40 MB
    if (pdfFile.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `El PDF pesa ${(pdfFile.size / 1024 / 1024).toFixed(1)} MB. El límite es 40 MB.` },
        { status: 400 }
      )
    }

    let courseId = rawCourseId || ""
    if (type === "course" && !courseId) {
      return NextResponse.json(
        { error: "Debes seleccionar un curso o diplomado válido." },
        { status: 400 }
      )
    }

    const arrayBuffer = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (!buffer || buffer.length < 500) {
      return NextResponse.json(
        { error: "El archivo PDF está vacío o corrupto." },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    let destinationPath = ""
    let viewerUrl = ""
    let primaryKey = ""

    if (type === "course") {
      destinationPath = `${courseId}/info.pdf`
      viewerUrl = `/api/file/${encodeURIComponent(`Info - ${courseId}.pdf`)}`
      primaryKey = `course_pdf_${courseId}`
    } else if (type === "etdh") {
      destinationPath = "info/general-etdh.pdf"
      viewerUrl = "/api/file/General - etdh.pdf"
      primaryKey = "info_etdh_pdf"
    } else {
      destinationPath = "info/general-diplomados.pdf"
      viewerUrl = "/api/file/General - diplomados.pdf"
      primaryKey = "info_diplomados_pdf"
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("Error al subir PDF a Supabase Storage (course-modules):", uploadError)
      return NextResponse.json(
        { error: `Error al guardar PDF en el servidor: ${uploadError.message}` },
        { status: 500 }
      )
    }

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
          { key, value: viewerUrl, updated_at: new Date().toISOString() },
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
      pdfUrl: viewerUrl,
      key: primaryKey,
      message: "¡PDF guardado y publicado exitosamente!",
    })
  } catch (err: any) {
    console.error("Error crítico en /api/upload-pdf:", err)
    return NextResponse.json(
      { error: `[Error Servidor] ${err?.message || "Error interno al procesar el archivo."}` },
      { status: 500 }
    )
  }
}
