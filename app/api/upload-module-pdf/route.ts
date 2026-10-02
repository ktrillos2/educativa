import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Aumentar el tiempo máximo de ejecución en Vercel (requiere plan Pro para >10s)
export const maxDuration = 60

const MODULES_BUCKET = "course-modules"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log("[upload-module-pdf] Iniciando subida de PDF de módulo...")

  try {
    // Verificar sesión de administrador
    const session = await getSession()
    if (!session?.userId) {
      console.warn("[upload-module-pdf] Acceso no autorizado.")
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const formData = await request.formData()
    const courseId = formData.get("courseId") as string | null
    const moduleIndex = Number(formData.get("moduleIndex"))
    const file = formData.get("file") as File | null

    console.log(`[upload-module-pdf] courseId=${courseId}, moduleIndex=${moduleIndex}, fileSize=${file?.size ?? 0} bytes`)

    if (!courseId || !moduleIndex || !file || file.size === 0) {
      return NextResponse.json(
        { error: "Faltan datos o el archivo PDF está vacío." },
        { status: 400 }
      )
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.type.includes("pdf") ||
      file.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      return NextResponse.json(
        { error: `El archivo "${file.name}" debe ser un documento PDF (.pdf).` },
        { status: 400 }
      )
    }

    const maxSizeBytes = 50 * 1024 * 1024 // 50 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El límite es 50 MB.` },
        { status: 400 }
      )
    }

    // Leer el archivo
    console.log("[upload-module-pdf] Leyendo arrayBuffer...")
    const arrayBuffer = await file.arrayBuffer()
    const storagePath = `${courseId}/modulo-${moduleIndex}.pdf`

    // Subir a Supabase Storage
    console.log(`[upload-module-pdf] Subiendo a Storage: ${storagePath}`)
    const supabase = createAdminClient()

    const { error: uploadError } = await supabase.storage
      .from(MODULES_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("[upload-module-pdf] Error en Storage upload:", uploadError)
      return NextResponse.json(
        { error: `Error al subir el PDF a Storage: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log("[upload-module-pdf] PDF subido a Storage exitosamente. Actualizando BD...")

    // Actualizar module_pdfs en la BD
    const { data: courseData, error: fetchError } = await supabase
      .from("courses")
      .select("module_pdfs, modules")
      .eq("id", courseId)
      .maybeSingle()

    if (fetchError || !courseData) {
      console.error("[upload-module-pdf] Error al obtener el curso:", fetchError)
      return NextResponse.json(
        { error: "No se encontró el curso en la base de datos." },
        { status: 404 }
      )
    }

    const currentPdfs = (courseData.module_pdfs as Record<string, boolean>) || {}
    currentPdfs[`mod-${moduleIndex}`] = true

    const newModulesCount = Math.max(courseData.modules || 0, moduleIndex)

    const { error: updateError } = await supabase
      .from("courses")
      .update({
        module_pdfs: currentPdfs,
        modules: newModulesCount,
      } as any)
      .eq("id", courseId)

    if (updateError) {
      console.error("[upload-module-pdf] Error al actualizar curso en BD:", updateError)
      return NextResponse.json(
        { error: `Error al actualizar la base de datos: ${updateError.message}` },
        { status: 500 }
      )
    }

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica/${courseId}`)
    revalidatePath(`/estudiante/cursos/${courseId}`)

    const elapsed = Date.now() - startTime
    const targetFileName = `Modulo ${moduleIndex} - ${courseId}.pdf`
    console.log(`[upload-module-pdf] Completado exitosamente en ${elapsed}ms. Archivo: ${targetFileName}`)

    return NextResponse.json({
      success: true,
      message: `El archivo ${targetFileName} fue cargado correctamente.`,
      moduleIndex,
      fileName: targetFileName,
      elapsed,
    })
  } catch (err: any) {
    const elapsed = Date.now() - startTime
    console.error(`[upload-module-pdf] Error crítico tras ${elapsed}ms:`, err)
    return NextResponse.json(
      { error: `Error interno al subir el PDF: ${err?.message || "Error desconocido"}` },
      { status: 500 }
    )
  }
}
